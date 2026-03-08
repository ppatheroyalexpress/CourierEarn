import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ktiuugjljkffoqpgkpsj.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0aXV1Z2psamtmZm9xcGdrcHNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3MTkxNDQsImV4cCI6MjA4ODI5NTE0NH0.1jBKvQgx8n3Q9dvsnSpIri0O_He4sK4E_j8-Re31kWI";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

function formatDateISO(d: Date) {
  return d.toISOString().slice(0, 10);
}

async function seedData() {
  console.log("Fetching first user from public.users...");
  const { data: users, error: userError } = await supabase.from("users").select("id").limit(1);
  
  if (userError || !users || users.length === 0) {
    console.error("No user found in public.users. Please log in to the app first to create your profile.");
    return;
  }

  const userId = users[0].id;
  console.log(`Seeding data for user ID: ${userId}`);

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const todayStr = formatDateISO(today);
  const yesterdayStr = formatDateISO(yesterday);

  // Seed Transactions for today
  console.log("Seeding transactions for today...");
  await supabase.from("transactions").insert([
    {
      user_id: userId,
      pickup_location: "daily-delivery",
      dropoff_location: todayStr,
      amount: 15.50,
      status: "delivered",
      delivered_at: today.toISOString(),
    },
    {
      user_id: userId,
      pickup_location: "daily-delivery",
      dropoff_location: todayStr,
      amount: 25.00,
      status: "delivered",
      delivered_at: today.toISOString(),
    }
  ]);

  // Seed Transactions for yesterday
  console.log("Seeding transactions for yesterday...");
  await supabase.from("transactions").insert([
    {
      user_id: userId,
      pickup_location: "daily-delivery",
      dropoff_location: yesterdayStr,
      amount: 10.00,
      status: "delivered",
      delivered_at: yesterday.toISOString(),
    }
  ]);

  // Seed Pickups for today
  console.log("Seeding pickups for today...");
  await supabase.from("pickups").insert([
    {
      user_id: userId,
      scheduled_at: today.toISOString(),
      location: "daily-pickup",
      notes: "houses=5;parcels=20",
    }
  ]);

  // Seed Pickups for yesterday
  console.log("Seeding pickups for yesterday...");
  await supabase.from("pickups").insert([
    {
      user_id: userId,
      scheduled_at: yesterday.toISOString(),
      location: "daily-pickup",
      notes: "houses=3;parcels=10",
    }
  ]);

  console.log("Seeding completed successfully!");
}

seedData();
