import { cookies } from "next/headers";
import { createServerClient, type CookieMethodsServer, type CookieOptionsWithName } from "@supabase/auth-helpers-nextjs";

export async function getSupabaseServerClient() {
  const cookieStore = await cookies();

  const cookieOptions: CookieOptionsWithName = {
    name: (process.env.AUTH_COOKIE_NAME || "sb-session") as string,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
  };

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: ({
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        getAll() {
          return cookieStore.getAll().map((c) => ({ name: c.name, value: c.value }));
        },
        set(name: string, value: string, options?: Record<string, unknown>) {
          cookieStore.set({ name, value, ...(options || {}) });
        },
        setAll(cookies: Array<{ name: string; value: string; options?: Record<string, unknown> }>) {
          cookies.forEach((c) => cookieStore.set(c));
        },
        remove(name: string, options?: Record<string, unknown>) {
          cookieStore.delete({ name, ...(options || {}) });
        },
        removeAll(cookies: Array<{ name: string; options?: Record<string, unknown> }>) {
          cookies.forEach((c) => cookieStore.delete(c));
        },
      } as unknown as CookieMethodsServer),
      cookieOptions,
    }
  );
}
