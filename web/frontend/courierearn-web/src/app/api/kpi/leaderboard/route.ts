import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { computeDeliveryKpiFromAmount, computePickupKpiFromNotes } from "@/lib/kpi";

export async function GET() {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get all users with their KPI points
  const { data: users, error: usersError } = await supabase
    .from("users")
    .select("id, username, branch, auth_user_id");

  if (usersError) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }

  // Calculate KPI points for each user
  const leaderboard = [];
  
  for (const userData of users || []) {
    // Get all transactions for this user
    const { data: txAll } = await supabase
      .from("transactions")
      .select("amount")
      .eq("user_id", userData.id);

    const deliveryKpi = ((txAll ?? []) as Array<{ amount: number }>).reduce(
      (acc, cur) => acc + computeDeliveryKpiFromAmount(cur.amount),
      0
    );

    // Get all pickups for this user
    const { data: puAll } = await supabase
      .from("pickups")
      .select("notes")
      .eq("user_id", userData.id);

    const pickupKpi = ((puAll ?? []) as Array<{ notes: string | null }>).reduce(
      (acc, cur) => acc + computePickupKpiFromNotes(cur.notes),
      0
    );

    const totalKpi = deliveryKpi + pickupKpi;

    leaderboard.push({
      id: userData.id,
      username: userData.username || "Anonymous",
      branch: userData.branch || "Unknown",
      totalKpi,
      deliveryKpi,
      pickupKpi,
    });
  }

  // Sort by total KPI points (descending)
  leaderboard.sort((a, b) => b.totalKpi - a.totalKpi);

  // Add rankings
  const rankedLeaderboard = leaderboard.map((user, index) => ({
    ...user,
    rank: index + 1,
  }));

  // Get current user's rank
  const currentUserRow = users?.find(u => u.auth_user_id === user.id);
  const currentUserRank = rankedLeaderboard.find(u => u.id === currentUserRow?.id);

  return NextResponse.json({
    leaderboard: rankedLeaderboard.slice(0, 50), // Top 50 users
    currentUserRank: currentUserRank || null,
  });
}
