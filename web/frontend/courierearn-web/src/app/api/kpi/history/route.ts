import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { computeDeliveryKpiFromAmount, computePickupKpiFromNotes } from "@/lib/kpi";

function iso(d: Date) {
  return d.toISOString().slice(0, 10);
}

export async function GET(request: Request) {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const days = Math.max(1, Math.min(90, Number(searchParams.get("days") || 30)));

  const { data: rows } = await supabase.from("users").select("id").eq("auth_user_id", user.id).limit(1);
  const userRowId = rows?.[0]?.id || null;
  if (!userRowId) return NextResponse.json({ history: [] });

  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - days + 1);
  const startISO = `${iso(start)}T00:00:00Z`;
  const endISO = `${iso(end)}T23:59:59Z`;

  const { data: txRange } = await supabase
    .from("transactions")
    .select("amount, dropoff_location, created_at")
    .eq("user_id", userRowId)
    .gte("created_at", startISO)
    .lte("created_at", endISO);

  const { data: puRange } = await supabase
    .from("pickups")
    .select("notes, scheduled_at")
    .eq("user_id", userRowId)
    .gte("scheduled_at", startISO)
    .lte("scheduled_at", endISO);

  const byDate = new Map<string, { date: string; delivery: number; pickup: number; total: number }>();
  for (const row of (txRange ?? []) as Array<{ amount: number; dropoff_location: string }>) {
    const d = row.dropoff_location || iso(new Date());
    const current = byDate.get(d) || { date: d, delivery: 0, pickup: 0, total: 0 };
    current.delivery += computeDeliveryKpiFromAmount(row.amount);
    current.total = current.delivery + current.pickup;
    byDate.set(d, current);
  }
  for (const row of (puRange ?? []) as Array<{ notes: string | null; scheduled_at: string }>) {
    const d = row.scheduled_at?.slice(0, 10) || iso(new Date());
    const current = byDate.get(d) || { date: d, delivery: 0, pickup: 0, total: 0 };
    current.pickup += computePickupKpiFromNotes(row.notes);
    current.total = current.delivery + current.pickup;
    byDate.set(d, current);
  }
  const history = Array.from(byDate.values()).sort((a, b) => (a.date < b.date ? -1 : 1));
  return NextResponse.json({ history });
}
