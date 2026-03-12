import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await context.params;
  let body: Partial<{ pickup_location: string; dropoff_location: string; amount: number; status: string; delivered_at: string | null }>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const { data: rows } = await supabase.from("users").select("id").eq("auth_user_id", user.id).limit(1);
  const userRowId = rows?.[0]?.id || null;
  if (!userRowId) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { error } = await supabase.from("transactions").update(body).eq("id", id).eq("user_id", userRowId);
  if (error) return NextResponse.json({ error: "Failed to update transaction" }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await context.params;
  const { data: rows } = await supabase.from("users").select("id").eq("auth_user_id", user.id).limit(1);
  const userRowId = rows?.[0]?.id || null;
  if (!userRowId) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { error } = await supabase.from("transactions").delete().eq("id", id).eq("user_id", userRowId);
  if (error) return NextResponse.json({ error: "Failed to delete transaction" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
