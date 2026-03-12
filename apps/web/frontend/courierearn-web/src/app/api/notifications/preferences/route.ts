import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

// GET - Fetch user notification preferences
export async function GET() {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get user ID
  const { data: userData } = await supabase
    .from("users")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();

  if (!userData) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Get notification preferences
  const { data: preferences } = await supabase
    .from("user_notification_preferences")
    .select("*")
    .eq("user_id", userData.id)
    .single();

  // If no preferences exist, create defaults
  if (!preferences) {
    const { data: newPrefs } = await supabase
      .from("user_notification_preferences")
      .insert({
        user_id: userData.id,
        daily_reminder_enabled: true,
        daily_reminder_time: "20:00:00",
        day_off_enabled: false,
        sound_enabled: true,
        vibration_enabled: true
      })
      .select()
      .single();

    return NextResponse.json({ preferences: newPrefs });
  }

  return NextResponse.json({ preferences });
}

// PUT - Update notification preferences
export async function PUT(request: Request) {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const {
    daily_reminder_enabled,
    daily_reminder_time,
    day_off_enabled,
    day_off_day,
    sound_enabled,
    vibration_enabled
  } = body;

  // Get user ID
  const { data: userData } = await supabase
    .from("users")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();

  if (!userData) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Update preferences
  const { data: updatedPrefs, error } = await supabase
    .from("user_notification_preferences")
    .update({
      daily_reminder_enabled,
      daily_reminder_time,
      day_off_enabled,
      day_off_day: day_off_enabled ? day_off_day : null,
      sound_enabled,
      vibration_enabled,
      updated_at: new Date().toISOString()
    })
    .eq("user_id", userData.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ preferences: updatedPrefs });
}
