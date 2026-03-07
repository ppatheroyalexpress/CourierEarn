import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { computeDeliveryKpiFromAmount, computePickupKpiFromNotes } from "@/lib/kpi";

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
  if (!userRowId) return NextResponse.json({ total: 0, delivery: 0, pickup: 0 });

  const { data: txAll } = await supabase.from("transactions").select("amount").eq("user_id", userRowId);
  const delivery = ((txAll ?? []) as Array<{ amount: number }>).reduce(
    (acc, cur) => acc + computeDeliveryKpiFromAmount(cur.amount),
    0
  );

  const { data: puAll } = await supabase.from("pickups").select("notes").eq("user_id", userRowId);
  const pickup = ((puAll ?? []) as Array<{ notes: string | null }>).reduce(
    (acc, cur) => acc + computePickupKpiFromNotes(cur.notes),
    0
  );

  const total = delivery + pickup;
  return NextResponse.json({ total, delivery, pickup });
}
