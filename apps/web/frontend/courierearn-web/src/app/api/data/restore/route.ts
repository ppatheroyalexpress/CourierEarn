import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

// POST - Restore data from backup
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
  const { backupId } = body;

  if (!backupId) {
    return NextResponse.json({ error: "Backup ID required" }, { status: 400 });
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

  try {
    // Get backup data
    const { data: backup } = await supabase
      .from("user_data_backups")
      .select("backup_data")
      .eq("id", backupId)
      .eq("user_id", userData.id)
      .single();

    if (!backup) {
      return NextResponse.json({ error: "Backup not found" }, { status: 404 });
    }

    const backupData = backup.backup_data;

    // Start a transaction-like operation
    // Note: Supabase doesn't support true transactions, so we'll do sequential operations
    
    // Clear existing data (except user profile)
    await Promise.all([
      supabase.from("transactions").delete().eq("user_id", userData.id),
      supabase.from("pickups").delete().eq("user_id", userData.id),
      supabase.from("user_warnings").delete().eq("user_id", userData.id),
      supabase.from("monthly_kpi_scores").delete().eq("user_id", userData.id)
    ]);

    // Restore transactions
    if (backupData.transactions && backupData.transactions.length > 0) {
      const transactionsToRestore = backupData.transactions.map((t: any) => ({
        ...t,
        user_id: userData.id,
        id: undefined // Let database generate new IDs
      }));
      
      await supabase.from("transactions").insert(transactionsToRestore);
    }

    // Restore pickups
    if (backupData.pickups && backupData.pickups.length > 0) {
      const pickupsToRestore = backupData.pickups.map((p: any) => ({
        ...p,
        user_id: userData.id,
        id: undefined
      }));
      
      await supabase.from("pickups").insert(pickupsToRestore);
    }

    // Restore warnings
    if (backupData.warnings && backupData.warnings.length > 0) {
      const warningsToRestore = backupData.warnings.map((w: any) => ({
        ...w,
        user_id: userData.id,
        id: undefined
      }));
      
      await supabase.from("user_warnings").insert(warningsToRestore);
    }

    // Restore KPI scores
    if (backupData.kpiScores && backupData.kpiScores.length > 0) {
      const kpiScoresToRestore = backupData.kpiScores.map((k: any) => ({
        ...k,
        user_id: userData.id,
        id: undefined
      }));
      
      await supabase.from("monthly_kpi_scores").insert(kpiScoresToRestore);
    }

    // Restore notification preferences
    if (backupData.notificationPreferences) {
      const { notificationPreferences } = backupData;
      await supabase
        .from("user_notification_preferences")
        .upsert({
          user_id: userData.id,
          daily_reminder_enabled: notificationPreferences.daily_reminder_enabled,
          daily_reminder_time: notificationPreferences.daily_reminder_time,
          day_off_enabled: notificationPreferences.day_off_enabled,
          day_off_day: notificationPreferences.day_off_day,
          sound_enabled: notificationPreferences.sound_enabled,
          vibration_enabled: notificationPreferences.vibration_enabled
        });
    }

    return NextResponse.json({ 
      message: "Data restored successfully",
      restoredItems: {
        transactions: backupData.transactions?.length || 0,
        pickups: backupData.pickups?.length || 0,
        warnings: backupData.warnings?.length || 0,
        kpiScores: backupData.kpiScores?.length || 0
      }
    });

  } catch (error) {
    console.error("Restore error:", error);
    return NextResponse.json({ error: "Failed to restore data" }, { status: 500 });
  }
}
