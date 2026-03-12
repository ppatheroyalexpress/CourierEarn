import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

function formatDateISO(d: Date) {
  return d.toISOString().slice(0, 7);
}

export async function GET() {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const currentMonth = formatDateISO(new Date());

  // Get monthly KPI scores for current month
  const { data: monthlyScores } = await supabase
    .from("monthly_kpi_scores")
    .select(`
      *,
      user:users(id, username, branch)
    `)
    .eq("month", currentMonth)
    .order("percentage", { ascending: false });

  // Get warning counts for all users
  const { data: warningCounts } = await supabase
    .from("user_warnings")
    .select("user_id")
    .eq("is_active", true);

  // Count warnings per user
  const warningsMap = new Map();
  (warningCounts || []).forEach(warning => {
    const current = warningsMap.get(warning.user_id) || 0;
    warningsMap.set(warning.user_id, current + 1);
  });

  // Build leaderboard with Top 5
  const leaderboard = (monthlyScores || []).map(score => ({
    id: score.user.id,
    username: score.user.username || "Anonymous",
    branch: score.user.branch || "Unknown",
    grade: score.grade,
    percentage: score.percentage,
    warnings: warningsMap.get(score.user_id) || 0,
    deliveryScore: score.delivery_score,
    pickupScore: score.pickup_score,
    ecScore: score.ec_score,
    totalScore: score.total_score
  })).slice(0, 5); // Top 5 only

  // Add rankings
  const rankedLeaderboard = leaderboard.map((user, index) => ({
    ...user,
    rank: index + 1,
  }));

  // Get current user's rank
  const currentUserRow = (monthlyScores || []).find(score => score.user.auth_user_id === user.id);
  let currentUserRank = null;
  
  if (currentUserRow) {
    const allRanked = (monthlyScores || [])
      .map(score => ({
        id: score.user.id,
        username: score.user.username || "Anonymous",
        branch: score.user.branch || "Unknown",
        grade: score.grade,
        percentage: score.percentage,
        warnings: warningsMap.get(score.user_id) || 0,
        deliveryScore: score.delivery_score,
        pickupScore: score.pickup_score,
        ecScore: score.ec_score,
        totalScore: score.total_score
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .map((user, index) => ({
        ...user,
        rank: index + 1,
      }));

    currentUserRank = allRanked.find(u => u.id === currentUserRow.user.id);
  }

  // Get monthly champions (previous month)
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  const previousMonth = formatDateISO(lastMonth);

  const { data: champions } = await supabase
    .from("monthly_champions")
    .select(`
      *,
      champion:users(id, username),
      runner_up:users(id, username),
      third_place:users(id, username)
    `)
    .eq("month", previousMonth)
    .single();

  return NextResponse.json({
    leaderboard: rankedLeaderboard,
    currentUserRank,
    monthlyChampions: champions
  });
}
