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

    const { data: userData } = await supabase
        .from("users")
        .select("id")
        .eq("auth_user_id", user.id)
        .single();

    if (!userData) {
        return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }

    const { data: warnings } = await supabase
        .from("user_warnings")
        .select("*")
        .eq("user_id", userData.id)
        .order("warning_date", { ascending: false });

    return NextResponse.json({
        warnings: warnings || []
    });
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

    const { data: userData } = await supabase
        .from("users")
        .select("id")
        .eq("auth_user_id", user.id)
        .single();

    if (!userData) {
        return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }

    const { date, count } = await request.json();

    if (!date) {
        return NextResponse.json({ error: "Missing date" }, { status: 400 });
    }

    // Create or update warning for that date
    const { data, error } = await supabase
        .from("user_warnings")
        .upsert({
            user_id: userData.id,
            warning_date: date,
            warning_count: count || 1
        }, { onConflict: 'user_id, warning_date' })
        .select();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
        warning: data?.[0]
    });
}
