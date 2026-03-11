import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = "https://ktiuugjljkffoqpgkpsj.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0aXV1Z2psamtmZm9xcGdrcHNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3MTkxNDQsImV4cCI6MjA4ODI5NTE0NH0.1jBKvQgx8n3Q9dvsnSpIri0O_He4sK4E_j8-Re31kWI";

export function getSupabaseBrowserClient() {
    return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
