import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

// POST - Clear all user data
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
  const { confirmation } = body;

  // Require explicit confirmation
  if (confirmation !== "DELETE_ALL_MY_DATA") {
    return NextResponse.json({ 
      error: "Invalid confirmation. Please provide 'DELETE_ALL_MY_DATA' to proceed." 
    }, { status: 400 });
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
    // Delete all user data in order of dependencies
    const deleteResults = await Promise.all([
      supabase.from("transactions").delete().eq("user_id", userData.id).select("count"),
      supabase.from("pickups").delete().eq("user_id", userData.id).select("count"),
      supabase.from("user_warnings").delete().eq("user_id", userData.id).select("count"),
      supabase.from("monthly_kpi_scores").delete().eq("user_id", userData.id).select("count"),
      supabase.from("user_data_backups").delete().eq("user_id", userData.id).select("count"),
      supabase.from("user_mobile_sessions").delete().eq("user_id", userData.id).select("count")
    ]);

    // Reset user stats
    await supabase
      .from("users")
      .update({
        total_earnings: 0,
        total_kpi_points: 0
      })
      .eq("id", userData.id);

    // Count deleted items
    const deletedCounts = deleteResults.map((result, index) => ({
      table: ['transactions', 'pickups', 'warnings', 'kpiScores', 'backups', 'sessions'][index],
      count: result.data?.length || 0
    }));

    return NextResponse.json({ 
      message: "All data cleared successfully",
      deletedCounts,
      warning: "This action is permanent and cannot be undone."
    });

  } catch (error) {
    console.error("Clear data error:", error);
    return NextResponse.json({ error: "Failed to clear data" }, { status: 500 });
  }
}
