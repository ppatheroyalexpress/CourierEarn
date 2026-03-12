import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getKPITargets } from "@courierearn/shared/utils/calculations";

export async function GET(request: Request) {
    const supabase = await getSupabaseServerClient();
    const { searchParams } = new URL(request.url);
    let branchGrade = searchParams.get("branchGrade") as 'A' | 'B' | 'C';

    if (!branchGrade || !['A', 'B', 'C'].includes(branchGrade)) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data: userData } = await supabase
                .from("users")
                .select("branch_grade")
                .eq("auth_user_id", user.id)
                .single();
            branchGrade = userData?.branch_grade || 'C';
        } else {
            branchGrade = 'C';
        }
    }

    // Get KPI targets from database or use defaults
    const { data: dbGrades } = await supabase
        .from("kpi_grades")
        .select("*")
        .eq("branch_grade", branchGrade)
        .order("grade_level", { ascending: false });

    let grades;
    if (dbGrades && dbGrades.length > 0) {
        grades = dbGrades.map(g => ({
            grade: g.grade_level.toString(),
            delivery: g.delivery_target,
            pickup: g.pickup_target,
            ec: g.ec_target,
            total: g.total_target
        }));
    } else {
        // Fallback to calculated targets
        grades = getKPITargets(branchGrade);
    }

    return NextResponse.json({
        branchGrade,
        grades
    });
}
