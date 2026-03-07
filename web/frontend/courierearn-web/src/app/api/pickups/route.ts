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
  if (!userRowId) return NextResponse.json({ pickups: [] });

  let query = supabase.from("pickups").select("*").eq("user_id", userRowId).order("scheduled_at", { ascending: false }).limit(limit);
  if (since) query = query.gte("scheduled_at", since);
  if (until) query = query.lte("scheduled_at", until);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: "Failed to fetch pickups" }, { status: 500 });
  return NextResponse.json({ pickups: data ?? [] });
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
  let body: { scheduled_at: string; location: string; notes?: string | null };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!body || typeof body.scheduled_at !== "string" || typeof body.location !== "string") {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  const { data: rows } = await supabase.from("users").select("id").eq("auth_user_id", user.id).limit(1);
  const userRowId = rows?.[0]?.id || null;
  if (!userRowId) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const payload = {
    user_id: userRowId,
    scheduled_at: body.scheduled_at,
    location: body.location,
    notes: body.notes ?? null,
  };
  const { error } = await supabase.from("pickups").insert(payload);
  if (error) return NextResponse.json({ error: "Failed to create pickup" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
