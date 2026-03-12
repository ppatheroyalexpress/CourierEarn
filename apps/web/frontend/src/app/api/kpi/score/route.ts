import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { calculateKPIGrade, getKPITargets } from "@courierearn/shared/utils/calculations";

function formatDateISO(d: Date) {
  return d.toISOString().slice(0, 10);
}

export async function GET(request: Request) {
  const supabase = await getSupabaseServerClient();
  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month") || formatDateISO(new Date()).slice(0, 7); // Format: '2024-03'

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get user info with branch grade
  const { data: userData } = await supabase
    .from("users")
    .select("id, branch_grade")
    .eq("auth_user_id", user.id)
    .single();

  if (!userData) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Get month's data
  const startDate = `${month}-01T00:00:00Z`;
  const endDate = new Date(parseInt(month.split('-')[0]), parseInt(month.split('-')[1]), 0);
  const endOfMonth = `${endDate.toISOString().slice(0, 10)}T23:59:59Z`;

  // Get transactions for the month
  const { data: transactions } = await supabase
    .from("transactions")
    .select("cash_collect, not_cash, ec")
    .eq("user_id", userData.id)
    .gte("created_at", startDate)
    .lte("created_at", endOfMonth);

  // Get pickups for the month
  const { data: pickups } = await supabase
    .from("pickups")
    .select("houses, parcels")
    .eq("user_id", userData.id)
    .gte("scheduled_at", startDate)
    .lte("scheduled_at", endOfMonth);

  // Calculate achieved scores
  const achieved = {
    delivery: (transactions || []).reduce((sum, t) => sum + (t.cash_collect || 0) + (t.not_cash || 0), 0),
    pickup: (pickups || []).reduce((sum, p) => sum + (p.houses || 0), 0),
    ec: (transactions || []).filter(t => t.ec && t.ec > 0).length,
    total: 0 // Will be calculated
  };

  // Total is sum of all KPI points
  achieved.total = achieved.delivery + achieved.pickup + achieved.ec;

  // Get user's active warnings
  const { data: warnings } = await supabase
    .from("user_warnings")
    .select("*")
    .eq("user_id", userData.id)
    .eq("is_active", true);

  const warningCount = warnings ? warnings.length : 0;

  // Get KPI targets for user's branch grade
  const targets = getKPITargets(userData.branch_grade as 'A' | 'B' | 'C');

  // Calculate grade and percentage
  const score = calculateKPIGrade(achieved, targets, warningCount);
  score.userId = userData.id;
  score.month = month;
  
  const scoreWithWarnings = {
    ...score,
    warnings_applied: warningCount
  };

  // Save or update monthly score
  const { data: existingScore } = await supabase
    .from("monthly_kpi_scores")
    .select("*")
    .eq("user_id", userData.id)
    .eq("month", month)
    .single();

  if (existingScore) {
    await supabase
      .from("monthly_kpi_scores")
      .update({
        delivery_score: achieved.delivery,
        pickup_score: achieved.pickup,
        ec_score: achieved.ec,
        total_score: achieved.total,
        percentage: scoreWithWarnings.percentage,
        grade: scoreWithWarnings.grade,
        warnings_applied: warningCount,
        updated_at: new Date().toISOString()
      })
      .eq("id", existingScore.id);
  } else {
    await supabase
      .from("monthly_kpi_scores")
      .insert({
        user_id: userData.id,
        month,
        delivery_score: achieved.delivery,
        pickup_score: achieved.pickup,
        ec_score: achieved.ec,
        total_score: achieved.total,
        percentage: scoreWithWarnings.percentage,
        grade: scoreWithWarnings.grade,
        warnings_applied: warningCount
      });
  }

  return NextResponse.json({
    achieved,
    targets,
    score: scoreWithWarnings,
    warnings: warningCount
  });
}
