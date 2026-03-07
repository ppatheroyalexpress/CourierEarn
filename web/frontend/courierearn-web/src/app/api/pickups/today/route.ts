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
  if (!userRowId) return NextResponse.json({ total: 0, items: [] });

  const todayStr = formatDateISO(new Date());
  const { data, error } = await supabase
    .from("pickups")
    .select("*")
    .eq("user_id", userRowId)
    .eq("location", "daily-pickup")
    .gte("scheduled_at", `${todayStr}T00:00:00Z`)
    .lte("scheduled_at", `${todayStr}T23:59:59Z`);
  if (error) return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  const total = ((data ?? []) as Array<{ notes: string | null }>).reduce((acc, cur) => {
    const notes = String(cur.notes || "");
    const houses = Number(notes.match(/houses=(\d+)/)?.[1] ?? 0);
    const parcels = Number(notes.match(/parcels=(\d+)/)?.[1] ?? 0);
    return acc + houses + parcels;
  }, 0);
  return NextResponse.json({ total, items: data ?? [] });
}
