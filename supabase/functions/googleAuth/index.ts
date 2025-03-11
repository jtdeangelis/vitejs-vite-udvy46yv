import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/**
 * Environment variables stored in Supabase (Settings -> Functions -> Environment Variables).
 */
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") || "";
const CLIENT_ID = Deno.env.get("VITE_GOOGLE_CLIENT_ID") || "";
const CLIENT_SECRET = Deno.env.get("VITE_GOOGLE_SECRET_ID") || "";
const REDIRECT_URI = Deno.env.get("VITE_REDIRECT_URI") || "http://localhost:5173";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

serve(async (req: Request) => {
  // Log the requested URL to help with debugging
  console.log(`Request to ${req.url}, method: ${req.method}`);
  
  const url = new URL(req.url);
  console.log(`Path: ${url.pathname}`);

  // Handle CORS Preflight Requests
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // Extract Authorization Token
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
  const token = authHeader.split(" ")[1];

  // Verify Token with Supabase
  const { data: user, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized: Invalid token" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

    // Handle the googleAuth endpoint for both operations
    if (url.pathname === "/googleAuth") {
        // GET request - return auth URL
        if (req.method === "GET") {
        const scope = [
            "https://www.googleapis.com/auth/photoslibrary.readonly",
            "https://www.googleapis.com/auth/photoslibrary",
            "https://www.googleapis.com/auth/photoslibrary.sharing"
        ].join(" ");
        
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;
    
        return new Response(JSON.stringify({ url: authUrl }), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
    } 
    
    // POST request - exchange code for token
    if (req.method === "POST") {
      try {
        const body = await req.json();
        const code = body.code;
        if (!code) {
          return new Response(JSON.stringify({ error: "No code provided" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }

        console.log("Exchanging code for token");
        const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            code,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            redirect_uri: REDIRECT_URI,
            grant_type: "authorization_code"
          })
        });

        if (!tokenRes.ok) {
          const errorData = await tokenRes.text();
          console.error("Token exchange error:", errorData);
          return new Response(JSON.stringify({ error: errorData }), {
            status: tokenRes.status,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }

        const tokens = await tokenRes.json();
        return new Response(JSON.stringify(tokens), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      } catch (err) {
        console.error("Server error:", err);
        return new Response(JSON.stringify({ error: String(err) }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }
  }

  // Default response for unhandled paths
  return new Response(JSON.stringify({ error: "Not Found" }), {
    status: 404, 
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
});