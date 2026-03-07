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
  if (!userRowId) {
    return NextResponse.json({
      todayCommission: 0,
      todayPickupTotal: 0,
      todayDeliveryTotal: 0,
      mtdEarnings: 0,
      mtdEc: 0,
    });
  }

  const todayStr = formatDateISO(new Date());
  const { data: txToday } = await supabase
    .from("transactions")
    .select("amount, dropoff_location")
    .eq("user_id", userRowId)
    .eq("pickup_location", "daily-delivery")
    .eq("dropoff_location", todayStr);

  const todayCommission = ((txToday ?? []) as Array<{ amount: number }>).reduce(
    (acc, cur) => acc + Number(cur.amount || 0),
    0
  );
  const todayDeliveryTotal = (txToday ?? []).length;

  const { data: puToday } = await supabase
    .from("pickups")
    .select("notes")
    .eq("user_id", userRowId)
    .eq("location", "daily-pickup")
    .gte("scheduled_at", `${todayStr}T00:00:00Z`)
    .lte("scheduled_at", `${todayStr}T23:59:59Z`);
  const todayPickupTotal = ((puToday ?? []) as Array<{ notes: string | null }>).reduce((acc, cur) => {
    const notes = String(cur.notes || "");
    const houses = Number(notes.match(/houses=(\d+)/)?.[1] ?? 0);
    const parcels = Number(notes.match(/parcels=(\d+)/)?.[1] ?? 0);
    return acc + houses + parcels;
  }, 0);

  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const startISO = `${start.toISOString().slice(0, 10)}T00:00:00Z`;
  const endISO = `${end.toISOString().slice(0, 10)}T23:59:59Z`;
  const { data: txMonth } = await supabase
    .from("transactions")
    .select("amount, dropoff_location")
    .eq("user_id", userRowId)
    .gte("created_at", startISO)
    .lte("created_at", endISO);
  const mtdEarnings = ((txMonth ?? []) as Array<{ amount: number }>).reduce(
    (acc, cur) => acc + Number(cur.amount || 0),
    0
  );
  const mtdEc = (txMonth ?? []).length;

  return NextResponse.json({
    todayCommission,
    todayPickupTotal,
    todayDeliveryTotal,
    mtdEarnings,
    mtdEc,
  });
}
