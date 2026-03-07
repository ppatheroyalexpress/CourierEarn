import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: rows, error } = await supabase
    .from("users")
    .select("*")
    .eq("auth_user_id", user.id)
    .limit(1);
  if (error) {
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
  const profile = rows?.[0] ?? null;
  return NextResponse.json({ profile });
}
