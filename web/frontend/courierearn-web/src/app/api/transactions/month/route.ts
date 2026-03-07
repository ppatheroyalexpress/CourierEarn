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
  const { data: rows } = await supabase.from("users").select("id").eq("auth_user_id", user.id).limit(1);
  const userRowId = rows?.[0]?.id || null;
  if (!userRowId) return NextResponse.json({ total: 0, count: 0, items: [] });

  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const startISO = `${start.toISOString().slice(0, 10)}T00:00:00Z`;
  const endISO = `${end.toISOString().slice(0, 10)}T23:59:59Z`;

  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", userRowId)
    .gte("created_at", startISO)
    .lte("created_at", endISO);
  if (error) return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  const total = ((data ?? []) as Array<{ amount: number }>).reduce(
    (acc, cur) => acc + Number(cur.amount || 0),
    0
  );
  return NextResponse.json({ total, count: (data ?? []).length, items: data ?? [] });
}
