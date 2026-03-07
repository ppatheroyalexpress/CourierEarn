import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

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
  const limit = Number(searchParams.get("limit") || 50);
  const since = searchParams.get("since");
  const until = searchParams.get("until");

  const { data: rows } = await supabase.from("users").select("id").eq("auth_user_id", user.id).limit(1);
  const userRowId = rows?.[0]?.id || null;
  if (!userRowId) return NextResponse.json({ transactions: [] });

  let query = supabase.from("transactions").select("*").eq("user_id", userRowId).order("created_at", { ascending: false }).limit(limit);
  if (since) {
    query = query.gte("created_at", since);
  }
  if (until) {
    query = query.lte("created_at", until);
  }
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
  return NextResponse.json({ transactions: data ?? [] });
}

export async function POST(request: Request) {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    pickup_location: string;
    dropoff_location: string;
    amount: number;
    status?: string;
    delivered_at?: string | null;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!body || typeof body.pickup_location !== "string" || typeof body.dropoff_location !== "string") {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (typeof body.amount !== "number" || isNaN(body.amount)) {
    return NextResponse.json({ error: "amount must be a number" }, { status: 400 });
  }
  const { data: rows } = await supabase.from("users").select("id").eq("auth_user_id", user.id).limit(1);
  const userRowId = rows?.[0]?.id || null;
  if (!userRowId) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const payload = {
    user_id: userRowId,
    pickup_location: body.pickup_location,
    dropoff_location: body.dropoff_location,
    amount: body.amount,
    status: body.status ?? "delivered",
    delivered_at: body.delivered_at ?? null,
  };
  const { error } = await supabase.from("transactions").insert(payload);
  if (error) return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
