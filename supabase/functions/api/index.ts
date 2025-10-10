import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";

const app = new Hono();

// Middlewares
app.use('*', logger());
app.use('/*', cors({
  origin: '*',
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
}));

// Helpers
function getAdminClient() {
  const url = Deno.env.get('SUPABASE_URL');
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !key) throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  return createClient(url, key);
}

function getAnonClient(authorization?: string | null) {
  const url = Deno.env.get('SUPABASE_URL');
  const anon = Deno.env.get('SUPABASE_ANON_KEY');
  if (!url || !anon) throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY');
  return createClient(url, anon, {
    global: { headers: { Authorization: authorization ?? '' }},
  });
}

async function getAuthUser(authorization?: string | null) {
  if (!authorization) return null;
  const token = authorization?.startsWith('Bearer ')
    ? authorization.slice('Bearer '.length)
    : authorization;
  const admin = getAdminClient();
  const { data, error } = await admin.auth.getUser(token);
  if (error) return null;
  return data.user;
}

// Health
app.get('/health', (c) => c.json({ status: 'ok' }));

// Profiles
app.get('/profiles/:id', async (c) => {
  const id = c.req.param('id');
  const admin = getAdminClient();
  const { data: profile, error } = await admin
    .from('profiles')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) return c.json({ error: error.message }, 400);
  if (!profile) return c.json({ error: 'Not found' }, 404);

  // Aggregate counts
  const [postsCount, followersCount, followingCount] = await Promise.all([
    admin.from('posts').select('id', { count: 'exact', head: true }).eq('author_id', id),
    admin.from('follows').select('following_id', { count: 'exact', head: true }).eq('following_id', id),
    admin.from('follows').select('follower_id', { count: 'exact', head: true }).eq('follower_id', id),
  ]);
  return c.json({
    profile,
    metrics: {
      posts: postsCount.count ?? 0,
      followers: followersCount.count ?? 0,
      following: followingCount.count ?? 0,
    }
  });
});

app.post('/profiles', async (c) => {
  const auth = c.req.header('Authorization');
  const user = await getAuthUser(auth);
  if (!user) return c.json({ error: 'Unauthorized' }, 401);
  const body = await c.req.json().catch(() => ({} as any));

  const payload = {
    id: user.id,
    username: body.username ?? user.email?.split('@')[0] ?? `user_${user.id.slice(0, 8)}`,
    display_name: body.display_name ?? user.user_metadata?.full_name ?? 'New User',
    avatar_url: body.avatar_url ?? user.user_metadata?.avatar_url ?? null,
    background_url: body.background_url ?? null,
    bio: body.bio ?? null,
    created_at: new Date().toISOString(),
  };

  const admin = getAdminClient();
  const { data, error } = await admin
    .from('profiles')
    .upsert(payload, { onConflict: 'id' })
    .select('*')
    .maybeSingle();
  if (error) return c.json({ error: error.message }, 400);
  return c.json({ profile: data });
});

// Follow / Unfollow
app.post('/profiles/:id/follow', async (c) => {
  const targetId = c.req.param('id');
  const auth = c.req.header('Authorization');
  const user = await getAuthUser(auth);
  if (!user) return c.json({ error: 'Unauthorized' }, 401);
  if (user.id === targetId) return c.json({ error: 'Cannot follow yourself' }, 400);

  const admin = getAdminClient();
  const { error } = await admin
    .from('follows')
    .upsert({ follower_id: user.id, following_id: targetId })
    .select('*');
  if (error) return c.json({ error: error.message }, 400);
  return c.json({ ok: true });
});

app.delete('/profiles/:id/follow', async (c) => {
  const targetId = c.req.param('id');
  const auth = c.req.header('Authorization');
  const user = await getAuthUser(auth);
  if (!user) return c.json({ error: 'Unauthorized' }, 401);
  const admin = getAdminClient();
  const { error } = await admin
    .from('follows')
    .delete()
    .eq('follower_id', user.id)
    .eq('following_id', targetId);
  if (error) return c.json({ error: error.message }, 400);
  return c.json({ ok: true });
});

// Posts
app.get('/posts', async (c) => {
  const limit = Number(c.req.query('limit') ?? '20');
  const admin = getAdminClient();
  const { data: posts, error } = await admin
    .from('posts')
    .select('id, content, media_url, created_at, author_id')
    .order('created_at', { ascending: false })
    .limit(Math.min(limit, 100));
  if (error) return c.json({ error: error.message }, 400);

  // Enrich with author and counts
  const enriched = await Promise.all((posts ?? []).map(async (p) => {
    const [{ data: author }, { count: likesCount }, { count: commentsCount }] = await Promise.all([
      admin.from('profiles').select('id, username, display_name, avatar_url').eq('id', p.author_id).maybeSingle(),
      admin.from('likes').select('post_id', { count: 'exact', head: true }).eq('post_id', p.id),
      admin.from('comments').select('post_id', { count: 'exact', head: true }).eq('post_id', p.id),
    ]);
    return { ...p, author, likes_count: likesCount ?? 0, comments_count: commentsCount ?? 0 };
  }));

  return c.json({ posts: enriched });
});

app.get('/posts/:id', async (c) => {
  const id = c.req.param('id');
  const admin = getAdminClient();
  const { data: post, error } = await admin
    .from('posts')
    .select('id, content, media_url, created_at, author_id')
    .eq('id', id)
    .maybeSingle();
  if (error) return c.json({ error: error.message }, 400);
  if (!post) return c.json({ error: 'Not found' }, 404);
  const [{ data: author }, { count: likesCount }, { count: commentsCount }] = await Promise.all([
    admin.from('profiles').select('id, username, display_name, avatar_url').eq('id', post.author_id).maybeSingle(),
    admin.from('likes').select('post_id', { count: 'exact', head: true }).eq('post_id', post.id),
    admin.from('comments').select('post_id', { count: 'exact', head: true }).eq('post_id', post.id),
  ]);
  return c.json({ post: { ...post, author, likes_count: likesCount ?? 0, comments_count: commentsCount ?? 0 } });
});

app.post('/posts', async (c) => {
  const auth = c.req.header('Authorization');
  const user = await getAuthUser(auth);
  if (!user) return c.json({ error: 'Unauthorized' }, 401);
  const body = await c.req.json().catch(() => ({} as any));
  const payload = {
    author_id: user.id,
    content: body.content ?? null,
    media_url: body.media_url ?? null,
  };
  const admin = getAdminClient();
  const { data, error } = await admin
    .from('posts')
    .insert(payload)
    .select('*')
    .maybeSingle();
  if (error) return c.json({ error: error.message }, 400);
  return c.json({ post: data });
});

app.delete('/posts/:id', async (c) => {
  const id = c.req.param('id');
  const auth = c.req.header('Authorization');
  const user = await getAuthUser(auth);
  if (!user) return c.json({ error: 'Unauthorized' }, 401);
  const admin = getAdminClient();
  // Ensure ownership
  const { data: post } = await admin.from('posts').select('author_id').eq('id', id).maybeSingle();
  if (!post) return c.json({ error: 'Not found' }, 404);
  if (post.author_id !== user.id) return c.json({ error: 'Forbidden' }, 403);
  const { error } = await admin.from('posts').delete().eq('id', id);
  if (error) return c.json({ error: error.message }, 400);
  return c.json({ ok: true });
});

// Likes
app.post('/posts/:id/like', async (c) => {
  const postId = c.req.param('id');
  const auth = c.req.header('Authorization');
  const user = await getAuthUser(auth);
  if (!user) return c.json({ error: 'Unauthorized' }, 401);
  const admin = getAdminClient();
  const { error } = await admin
    .from('likes')
    .upsert({ post_id: postId, user_id: user.id });
  if (error) return c.json({ error: error.message }, 400);
  return c.json({ ok: true });
});

app.delete('/posts/:id/like', async (c) => {
  const postId = c.req.param('id');
  const auth = c.req.header('Authorization');
  const user = await getAuthUser(auth);
  if (!user) return c.json({ error: 'Unauthorized' }, 401);
  const admin = getAdminClient();
  const { error } = await admin
    .from('likes')
    .delete()
    .eq('post_id', postId)
    .eq('user_id', user.id);
  if (error) return c.json({ error: error.message }, 400);
  return c.json({ ok: true });
});

// Comments
app.get('/posts/:id/comments', async (c) => {
  const postId = c.req.param('id');
  const admin = getAdminClient();
  const { data: comments, error } = await admin
    .from('comments')
    .select('id, content, created_at, author_id')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });
  if (error) return c.json({ error: error.message }, 400);
  const enriched = await Promise.all((comments ?? []).map(async (cm) => {
    const { data: author } = await admin
      .from('profiles')
      .select('id, username, display_name, avatar_url')
      .eq('id', cm.author_id)
      .maybeSingle();
    return { ...cm, author };
  }));
  return c.json({ comments: enriched });
});

app.post('/posts/:id/comments', async (c) => {
  const postId = c.req.param('id');
  const auth = c.req.header('Authorization');
  const user = await getAuthUser(auth);
  if (!user) return c.json({ error: 'Unauthorized' }, 401);
  const body = await c.req.json().catch(() => ({} as any));
  if (!body.content || String(body.content).trim().length === 0) {
    return c.json({ error: 'Content is required' }, 400);
  }
  const admin = getAdminClient();
  const { data, error } = await admin
    .from('comments')
    .insert({ post_id: postId, author_id: user.id, content: body.content })
    .select('*')
    .maybeSingle();
  if (error) return c.json({ error: error.message }, 400);
  return c.json({ comment: data });
});

app.delete('/comments/:id', async (c) => {
  const id = c.req.param('id');
  const auth = c.req.header('Authorization');
  const user = await getAuthUser(auth);
  if (!user) return c.json({ error: 'Unauthorized' }, 401);
  const admin = getAdminClient();
  const { data: cm } = await admin.from('comments').select('author_id').eq('id', id).maybeSingle();
  if (!cm) return c.json({ error: 'Not found' }, 404);
  if (cm.author_id !== user.id) return c.json({ error: 'Forbidden' }, 403);
  const { error } = await admin.from('comments').delete().eq('id', id);
  if (error) return c.json({ error: error.message }, 400);
  return c.json({ ok: true });
});

// Simple feed (global)
app.get('/feed', async (c) => {
  const limit = Number(c.req.query('limit') ?? '20');
  const admin = getAdminClient();
  const { data: posts, error } = await admin
    .from('posts')
    .select('id, content, media_url, created_at, author_id')
    .order('created_at', { ascending: false })
    .limit(Math.min(limit, 100));
  if (error) return c.json({ error: error.message }, 400);
  const enriched = await Promise.all((posts ?? []).map(async (p) => {
    const [{ data: author }, { count: likesCount }, { count: commentsCount }] = await Promise.all([
      admin.from('profiles').select('id, username, display_name, avatar_url').eq('id', p.author_id).maybeSingle(),
      admin.from('likes').select('post_id', { count: 'exact', head: true }).eq('post_id', p.id),
      admin.from('comments').select('post_id', { count: 'exact', head: true }).eq('post_id', p.id),
    ]);
    return { ...p, author, likes_count: likesCount ?? 0, comments_count: commentsCount ?? 0 };
  }));
  return c.json({ feed: enriched });
});

Deno.serve(app.fetch);
