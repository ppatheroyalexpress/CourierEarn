import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { avatar_url?: string | null };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const avatar_url = body.avatar_url ?? null;
  if (avatar_url && typeof avatar_url !== "string") {
    return NextResponse.json({ error: "avatar_url must be a string" }, { status: 400 });
  }

  const { data: rows } = await supabase
    .from("users")
    .select("id")
    .eq("auth_user_id", user.id)
    .limit(1);
  const existingId = rows?.[0]?.id || null;
  if (!existingId) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }
  const { error } = await supabase.from("users").update({ avatar_url }).eq("id", existingId);
  if (error) {
    return NextResponse.json({ error: "Failed to update avatar" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { data: rows } = await supabase
    .from("users")
    .select("id")
    .eq("auth_user_id", user.id)
    .limit(1);
  const existingId = rows?.[0]?.id || null;
  if (!existingId) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }
  const { error } = await supabase.from("users").update({ avatar_url: null }).eq("id", existingId);
  if (error) {
    return NextResponse.json({ error: "Failed to remove avatar" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
