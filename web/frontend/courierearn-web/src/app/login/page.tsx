"use client";
import { useCallback, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const signInWithGoogle = useCallback(async () => {
    setLoading(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${siteUrl}/auth/callback`,
        },
      });
      if (error) {
        console.error(error.message);
        alert("Failed to start Google sign-in.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="p-6 rounded border max-w-sm w-full text-center">
        <h1 className="text-2xl font-semibold mb-4">Sign in to CourierEarn</h1>
        <button
          onClick={signInWithGoogle}
          disabled={loading}
          className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
        >
          {loading ? "Redirecting..." : "Continue with Google"}
        </button>
      </div>
    </main>
  );
}
