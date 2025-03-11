import { createClient } from "@supabase/supabase-js";

const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Initialize Supabase client
const supabase = createClient(
  "https://xjovcbxzeezjrdmcvxxu.supabase.co", 
  SUPABASE_ANON_KEY
);

export async function getGoogleAuthUrl() {
  // Get the current user's access token
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session) throw new Error("User not authenticated");

  const token = data.session.access_token; // JWT token

  // The base URL for the single googleAuth endpoint
  const base = "https://xjovcbxzeezjrdmcvxxu.supabase.co/functions/v1/googleAuth";
  
  try {
    const res = await fetch(base, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` // Add Auth header
      }
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Auth URL error response:", errorText);
      throw new Error(`Failed to get Google Auth URL: ${res.status} ${res.statusText}`);
    }

    const responseData = await res.json();
    if (!responseData.url) throw new Error("Failed to get Google Auth URL");
    
    return responseData.url as string;
  } catch (error) {
    console.error("Error getting Google Auth URL:", error);
    throw error;
  }
}

export async function exchangeCodeForToken(code: string) {
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session) throw new Error("User not authenticated");

  const token = data.session.access_token;

  // Same endpoint for both operations, but using POST for token exchange
  const base = "https://xjovcbxzeezjrdmcvxxu.supabase.co/functions/v1/googleAuth";

  try {
    console.log("Sending code to exchange for token");
    const res = await fetch(base, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ code })
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Token exchange error response:", errorText);
      throw new Error(`Error exchanging code: ${res.status} ${res.statusText}`);
    }

    const responseData = await res.json();
    console.log("Token exchange successful");
    
    if (responseData.error) {
      throw new Error(JSON.stringify(responseData.error));
    }

    return responseData;
  } catch (error) {
    console.error("Error exchanging code:", error);
    throw error;
  }
}