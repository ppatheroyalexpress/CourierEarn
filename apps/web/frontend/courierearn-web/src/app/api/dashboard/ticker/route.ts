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
  if (!userRowId) return NextResponse.json({ text: "No data for yesterday" });

  const y = new Date();
  y.setDate(y.getDate() - 1);
  const yesterdayStr = formatDateISO(y);

  const { data: txYesterday } = await supabase
    .from("transactions")
    .select("amount, dropoff_location")
    .eq("user_id", userRowId)
    .eq("pickup_location", "daily-delivery")
    .eq("dropoff_location", yesterdayStr);
  const yEarnings = ((txYesterday ?? []) as Array<{ amount: number }>).reduce(
    (acc, cur) => acc + Number(cur.amount || 0),
    0
  );

  const { data: puYesterday } = await supabase
    .from("pickups")
    .select("notes")
    .eq("user_id", userRowId)
    .eq("location", "daily-pickup")
    .gte("scheduled_at", `${yesterdayStr}T00:00:00Z`)
    .lte("scheduled_at", `${yesterdayStr}T23:59:59Z`);

  const yPickup = ((puYesterday ?? []) as Array<{ notes: string | null }>).reduce((acc, cur) => {
    const notes = String(cur.notes || "");
    const houses = Number(notes.match(/houses=(\d+)/)?.[1] ?? 0);
    const parcels = Number(notes.match(/parcels=(\d+)/)?.[1] ?? 0);
    return acc + houses + parcels;
  }, 0);

  const text =
    yEarnings || yPickup
      ? `Yesterday — Earnings: ${yEarnings.toFixed(2)} | Pickups: ${yPickup}`
      : "No data for yesterday";
  return NextResponse.json({ text });
}
