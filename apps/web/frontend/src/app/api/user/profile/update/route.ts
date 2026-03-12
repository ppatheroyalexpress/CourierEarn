import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function PUT(request: Request) {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    full_name?: string | null;
    branch?: string | null;
    phone?: string | null;
    email?: string | null;
    avatar_url?: string | null;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const lower = (v: string | null | undefined) => (v ? v.toLowerCase() : v ?? null);
  const payload = {
    auth_user_id: user.id,
    email: body.email ?? null,
    full_name: lower(body.full_name ?? null),
    branch: lower(body.branch ?? null),
    phone: lower(body.phone ?? null),
    avatar_url: body.avatar_url ?? null,
  };

  const { data: rows } = await supabase
    .from("users")
    .select("id")
    .eq("auth_user_id", user.id)
    .limit(1);
  const existingId = rows?.[0]?.id || null;

  if (existingId) {
    const { error } = await supabase.from("users").update(payload).eq("id", existingId);
    if (error) {
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } else {
    const { error } = await supabase.from("users").insert(payload);
    if (error) {
      return NextResponse.json({ error: "Failed to create profile" }, { status: 500 });
    }
    return NextResponse.json({ ok: true, created: true });
  }
}
