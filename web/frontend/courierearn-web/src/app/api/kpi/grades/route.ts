import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
    const supabase = await getSupabaseServerClient();
    const { searchParams } = new URL(request.url);
    let branch = searchParams.get("branch");

    if (!branch) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data: userData } = await supabase
                .from("users")
                .select("branch")
                .eq("auth_user_id", user.id)
                .single();
            branch = userData?.branch || 'A';
        } else {
            branch = 'A';
        }
    }

    const { data: grades } = await supabase
        .from("kpi_grades")
        .select("*")
        .eq("branch", branch)
        .order("grade", { ascending: true });

    return NextResponse.json({
        branch,
        grades: grades || []
    });
}
