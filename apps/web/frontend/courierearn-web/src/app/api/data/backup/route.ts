import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

// POST - Create data backup
export async function POST(request: Request) {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { backupName = "Manual Backup", backupType = "manual" } = body;

  // Get user ID
  const { data: userData } = await supabase
    .from("users")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();

  if (!userData) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  try {
    // Gather all user data
    const [
      { data: userProfile },
      { data: transactions },
      { data: pickups },
      { data: warnings },
      { data: kpiScores },
      { data: notificationPrefs }
    ] = await Promise.all([
      supabase.from("users").select("*").eq("id", userData.id).single(),
      supabase.from("transactions").select("*").eq("user_id", userData.id),
      supabase.from("pickups").select("*").eq("user_id", userData.id),
      supabase.from("user_warnings").select("*").eq("user_id", userData.id),
      supabase.from("monthly_kpi_scores").select("*").eq("user_id", userData.id),
      supabase.from("user_notification_preferences").select("*").eq("user_id", userData.id).single()
    ]);

    const backupData = {
      user: userProfile,
      transactions: transactions || [],
      pickups: pickups || [],
      warnings: warnings || [],
      kpiScores: kpiScores || [],
      notificationPreferences: notificationPrefs,
      exportedAt: new Date().toISOString(),
      version: "1.0"
    };

    const backupJson = JSON.stringify(backupData);
    const fileSize = Buffer.byteLength(backupJson, 'utf8');

    // Create backup record
    const { data: backup, error } = await supabase
      .from("user_data_backups")
      .insert({
        user_id: userData.id,
        backup_name: backupName,
        backup_data: backupData,
        backup_type: backupType,
        file_size: fileSize
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      backup,
      downloadUrl: `/api/data/download/${backup.id}`
    });

  } catch (error) {
    console.error("Backup creation error:", error);
    return NextResponse.json({ error: "Failed to create backup" }, { status: 500 });
  }
}

// GET - List user backups
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

  // Get user backups
  const { data: backups } = await supabase
    .from("user_data_backups")
    .select("id, backup_name, backup_type, file_size, created_at")
    .eq("user_id", userData.id)
    .order("created_at", { ascending: false });

  return NextResponse.json({ backups: backups || [] });
}
