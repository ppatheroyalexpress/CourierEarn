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
      todayCashCollect: 0,
      todayNotCashCollect: 0,
      todayEc: 0,
      todayHouses: 0,
      todayParcels: 0,
      mtdEarnings: 0,
      mtdEc: 0,
    });
  }

  const todayStr = formatDateISO(new Date());
  const { data: txToday } = await supabase
    .from("transactions")
    .select("amount, cash_collect, not_cash, ec")
    .eq("user_id", userRowId)
    .eq("pickup_location", "daily-delivery")
    .gte("delivered_at", `${todayStr}T00:00:00Z`)
    .lte("delivered_at", `${todayStr}T23:59:59Z`);

  const todayCommission = ((txToday ?? []) as Array<{ amount: number }>).reduce(
    (acc, cur) => acc + Number(cur.amount || 0),
    0
  );
  
  const todayCashCollect = ((txToday ?? []) as Array<{ cash_collect: number }>).reduce(
    (acc, cur) => acc + Number(cur.cash_collect || 0),
    0
  );
  
  const todayNotCashCollect = ((txToday ?? []) as Array<{ not_cash: number }>).reduce(
    (acc, cur) => acc + Number(cur.not_cash || 0),
    0
  );
  
  const todayEc = ((txToday ?? []) as Array<{ ec: number }>).reduce(
    (acc, cur) => acc + Number(cur.ec || 0),
    0
  );
  
  const todayDeliveryTotal = todayCashCollect + todayNotCashCollect + todayEc;

  const { data: puToday } = await supabase
    .from("pickups")
    .select("houses, parcels")
    .eq("user_id", userRowId)
    .eq("location", "daily-pickup")
    .gte("scheduled_at", `${todayStr}T00:00:00Z`)
    .lte("scheduled_at", `${todayStr}T23:59:59Z`);
  
  const todayHouses = ((puToday ?? []) as Array<{ houses: number }>).reduce(
    (acc, cur) => acc + Number(cur.houses || 0),
    0
  );
  
  const todayParcels = ((puToday ?? []) as Array<{ parcels: number }>).reduce(
    (acc, cur) => acc + Number(cur.parcels || 0),
    0
  );
  
  const todayPickupTotal = todayHouses + todayParcels;

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
    todayCashCollect,
    todayNotCashCollect,
    todayEc,
    todayHouses,
    todayParcels,
    mtdEarnings,
    mtdEc,
  });
}
