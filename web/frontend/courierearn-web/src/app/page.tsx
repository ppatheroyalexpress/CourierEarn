import Image from "next/image";
import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            CourierEarn
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            {user
              ? `Signed in as ${user.email ?? user.id}`
              : "You are not signed in."}
          </p>
          <div className="flex gap-4">
            {!user ? (
              <Link
                href="/login"
                className="px-4 py-2 rounded bg-black text-white"
              >
                Login
              </Link>
            ) : (
              <form action="/logout" method="POST">
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-black text-white"
                >
                  Logout
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
