import { serve } from "https://deno.land/std@0.177.0/http/server.ts"

serve(async (req) => {
  // Handle CORS
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  }

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  // Handle GET requests
  if (req.method === "GET") {
    const data = {
      message: "Hello from Agent Mode!"
    }

    return new Response(
      JSON.stringify(data),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    )
  }

  // Method not allowed
  return new Response("Method Not Allowed", { 
    status: 405,
    headers: corsHeaders 
  })
})