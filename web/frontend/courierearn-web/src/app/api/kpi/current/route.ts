import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { calculateDailyPoints, calculateGrade } from "@/lib/kpi";

function formatDateISO(d: Date) {
    return d.toISOString().slice(0, 10);
}

export async function GET() {
    const supabase = await getSupabaseServerClient();
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get internal user id and branch
    const { data: userData } = await supabase
        .from("users")
        .select("id, branch")
        .eq("auth_user_id", user.id)
        .single();

    if (!userData) {
        return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }

    const userRowId = userData.id;
    const branch = userData.branch || 'A';
    const todayStr = formatDateISO(new Date());

    // 1. Get deliveries (transactions)
    const { data: txToday } = await supabase
        .from("transactions")
        .select("id")
        .eq("user_id", userRowId)
        .eq("pickup_location", "daily-delivery")
        .eq("dropoff_location", todayStr);

    const deliveries = txToday?.length || 0;

    // 2. Get pickups
    const { data: puToday } = await supabase
        .from("pickups")
        .select("notes")
        .eq("user_id", userRowId)
        .eq("location", "daily-pickup")
        .gte("scheduled_at", `${todayStr}T00:00:00Z`)
        .lte("scheduled_at", `${todayStr}T23:59:59Z`);

    let pickupLocations = 0;
    let pickupWaybills = 0;

    puToday?.forEach(pu => {
        const notes = String(pu.notes || "");
        const houses = Number(notes.match(/houses=(\d+)/)?.[1] ?? 0);
        const parcels = Number(notes.match(/parcels=(\d+)/)?.[1] ?? 0);
        pickupLocations += houses;
        pickupWaybills += parcels;
    });

    const dailyPoints = calculateDailyPoints(deliveries, pickupLocations, pickupWaybills);

    // 3. Get monthly points
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // 1-indexed for DB

    const { data: monthlyKpi } = await supabase
        .from("monthly_kpi")
        .select("*")
        .eq("user_id", userRowId)
        .eq("year", year)
        .eq("month", month)
        .single();

    // 4. Get grade config for this branch
    const { data: grades } = await supabase
        .from("kpi_grades")
        .select("*")
        .eq("branch", branch)
        .order("grade", { ascending: true });

    return NextResponse.json({
        dailyPoints,
        monthlyKpi: monthlyKpi || { total_points: 0, grade: 5, year, month },
        branch,
        grades: grades || []
    });
}
