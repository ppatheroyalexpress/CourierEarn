import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (code) {
    const supabase = await getSupabaseServerClient();
    const { data: { session } } = await supabase.auth.exchangeCodeForSession(code);
    
    if (session?.user) {
      // Ensure user profile exists in public.users
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', session.user.id)
        .single();
        
      if (!existingUser) {
        await supabase.from('users').insert({
          auth_user_id: session.user.id,
          email: session.user.email,
          full_name: session.user.user_metadata?.full_name || 'Courier',
          avatar_url: session.user.user_metadata?.avatar_url,
        });
      }
    }
  }

  return NextResponse.redirect(new URL("/", request.url));
}
