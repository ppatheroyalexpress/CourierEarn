import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

// GET - Fetch user warnings
export async function GET(request: Request) {
  const supabase = await getSupabaseServerClient();
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get user ID if not provided
  let targetUserId = userId;
  if (!targetUserId) {
    const { data: userData } = await supabase
      .from("users")
      .select("id")
      .eq("auth_user_id", user.id)
      .single();
    targetUserId = userData?.id;
  }

  if (!targetUserId) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Get user's warnings
  const { data: warnings } = await supabase
    .from("user_warnings")
    .select(`
      *,
      creator:created_by(username),
      resetter:reset_by(username)
    `)
    .eq("user_id", targetUserId)
    .order("created_at", { ascending: false });

  return NextResponse.json({
    warnings: warnings || [],
    activeCount: (warnings || []).filter(w => w.is_active).length
  });
}

// POST - Create new warning
export async function POST(request: Request) {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { targetUserId, warningType, reason, points = 1 } = body;

  if (!targetUserId || !warningType || !reason) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Verify creator has permission (admin or manager)
  const { data: creator } = await supabase
    .from("users")
    .select("id, role")
    .eq("auth_user_id", user.id)
    .single();

  if (!creator || !['admin', 'manager'].includes(creator.role)) {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
  }

  // Create warning
  const { data: warning, error } = await supabase
    .from("user_warnings")
    .insert({
      user_id: targetUserId,
      warning_type: warningType,
      reason,
      points,
      created_by: creator.id,
      is_active: true
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ warning });
}

// PUT - Reset/clear warnings
export async function PUT(request: Request) {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { targetUserId, warningIds } = body;

  if (!targetUserId) {
    return NextResponse.json({ error: "Target user ID required" }, { status: 400 });
  }

  // Verify resetter has permission
  const { data: resetter } = await supabase
    .from("users")
    .select("id, role")
    .eq("auth_user_id", user.id)
    .single();

  if (!resetter || !['admin', 'manager'].includes(resetter.role)) {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
  }

  // Reset warnings
  let query = supabase
    .from("user_warnings")
    .update({
      is_active: false,
      reset_at: new Date().toISOString(),
      reset_by: resetter.id
    })
    .eq("user_id", targetUserId);

  if (warningIds && warningIds.length > 0) {
    query = query.in("id", warningIds);
  }

  const { data: updatedWarnings, error } = await query.select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ 
    message: "Warnings reset successfully",
    resetCount: updatedWarnings?.length || 0
  });
}
