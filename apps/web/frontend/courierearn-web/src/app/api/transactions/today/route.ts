import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

function formatDateISO(d: Date) {
  return d.toISOString().slice(0, 10);
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
  const { data: rows } = await supabase.from("users").select("id").eq("auth_user_id", user.id).limit(1);
  const userRowId = rows?.[0]?.id || null;
  if (!userRowId) return NextResponse.json({ total: 0, count: 0, items: [] });

  const todayStr = formatDateISO(new Date());
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", userRowId)
    .eq("pickup_location", "daily-delivery")
    .eq("dropoff_location", todayStr);
  if (error) return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  const total = ((data ?? []) as Array<{ amount: number }>).reduce(
    (acc, cur) => acc + Number(cur.amount || 0),
    0
  );
  return NextResponse.json({ total, count: (data ?? []).length, items: data ?? [] });
}
