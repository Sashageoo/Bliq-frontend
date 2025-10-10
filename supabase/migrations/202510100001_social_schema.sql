-- Enable required extensions
create extension if not exists pgcrypto;

-- Profiles table (1:1 with auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text not null,
  avatar_url text,
  background_url text,
  bio text,
  created_at timestamptz not null default now()
);

-- Posts table
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  content text,
  media_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Comments table
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

-- Likes table (many-to-many user<->post)
create table if not exists public.likes (
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

-- Follows table (who follows whom)
create table if not exists public.follows (
  follower_id uuid not null references public.profiles(id) on delete cascade,
  following_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, following_id),
  check (follower_id <> following_id)
);

-- Indexes
create index if not exists idx_posts_author_created on public.posts(author_id, created_at desc);
create index if not exists idx_comments_post_created on public.comments(post_id, created_at desc);
create index if not exists idx_likes_post on public.likes(post_id);
create index if not exists idx_likes_user on public.likes(user_id);
create index if not exists idx_follows_follower on public.follows(follower_id);
create index if not exists idx_follows_following on public.follows(following_id);

-- Trigger to update updated_at on posts
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_posts_updated_at
before update on public.posts
for each row execute function public.set_updated_at();

-- RLS policies
alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.likes enable row level security;
alter table public.follows enable row level security;

-- Profiles policies
create policy if not exists "profiles_read_all" on public.profiles
for select using (true);
create policy if not exists "profiles_self_insert" on public.profiles
for insert with check (auth.uid() = id);
create policy if not exists "profiles_self_update" on public.profiles
for update using (auth.uid() = id);

-- Posts policies
create policy if not exists "posts_read_all" on public.posts
for select using (true);
create policy if not exists "posts_insert_own" on public.posts
for insert with check (auth.uid() = author_id);
create policy if not exists "posts_update_own" on public.posts
for update using (auth.uid() = author_id);
create policy if not exists "posts_delete_own" on public.posts
for delete using (auth.uid() = author_id);

-- Comments policies
create policy if not exists "comments_read_all" on public.comments
for select using (true);
create policy if not exists "comments_insert_own" on public.comments
for insert with check (auth.uid() = author_id);
create policy if not exists "comments_delete_own" on public.comments
for delete using (auth.uid() = author_id);

-- Likes policies
create policy if not exists "likes_read_all" on public.likes
for select using (true);
create policy if not exists "likes_insert_own" on public.likes
for insert with check (auth.uid() = user_id);
create policy if not exists "likes_delete_own" on public.likes
for delete using (auth.uid() = user_id);

-- Follows policies
create policy if not exists "follows_read_all" on public.follows
for select using (true);
create policy if not exists "follows_insert_own" on public.follows
for insert with check (auth.uid() = follower_id);
create policy if not exists "follows_delete_own" on public.follows
for delete using (auth.uid() = follower_id);
