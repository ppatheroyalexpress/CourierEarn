import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ktiuugjljkffoqpgkpsj.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0aXV1Z2psamtmZm9xcGdrcHNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3MTkxNDQsImV4cCI6MjA4ODI5NTE0NH0.1jBKvQgx8n3Q9dvsnSpIri0O_He4sK4E_j8-Re31kWI";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkData() {
  console.log("Checking users table...");
  const { data: users, error: userError } = await supabase.from("users").select("*");
  if (userError) {
    console.error("Error fetching users:", userError);
  } else {
    console.log(`Found ${users?.length || 0} users:`, users);
  }

  console.log("\nChecking transactions table...");
  const { data: transactions, error: txError } = await supabase.from("transactions").select("*").limit(5);
  if (txError) {
    console.error("Error fetching transactions:", txError);
  } else {
    console.log(`Found ${transactions?.length || 0} transactions (limited to 5):`, transactions);
  }

  console.log("\nChecking pickups table...");
  const { data: pickups, error: pickupError } = await supabase.from("pickups").select("*").limit(5);
  if (pickupError) {
    console.error("Error fetching pickups:", pickupError);
  } else {
    console.log(`Found ${pickups?.length || 0} pickups (limited to 5):`, pickups);
  }
}

checkData();
