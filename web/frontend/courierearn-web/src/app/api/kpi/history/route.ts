import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: userData } = await supabase
    .from("users")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();

  if (!userData) {
    return NextResponse.json({ error: "User profile not found" }, { status: 404 });
  }

  // Fetch monthly KPI history
  const { data: monthlyHistory } = await supabase
    .from("monthly_kpi")
    .select("*")
    .eq("user_id", userData.id)
    .order("year", { ascending: false })
    .order("month", { ascending: false });

  return NextResponse.json({
    history: monthlyHistory || []
  });
}
