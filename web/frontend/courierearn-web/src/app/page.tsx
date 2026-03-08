import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="mb-12">
          <div className="w-24 h-24 bg-black dark:bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl rotate-3 hover:rotate-0 transition-transform duration-500">
            <span className="text-white dark:text-black text-4xl font-bold">CE</span>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-black dark:text-zinc-50 mb-4">
            CourierEarn
          </h1>
          <p className="max-w-md text-xl text-zinc-600 dark:text-zinc-400 mx-auto leading-relaxed">
            Track your deliveries, calculate earnings, and monitor your performance in one place.
          </p>
        </div>

        <div className="flex flex-col gap-4 w-full max-w-xs">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="w-full px-6 py-4 rounded-2xl bg-black text-white font-bold text-lg hover:scale-105 transition-transform shadow-lg shadow-black/20"
              >
                Go to Dashboard
              </Link>
              <p className="text-sm text-zinc-500">
                Signed in as <span className="font-medium text-zinc-900 dark:text-zinc-100">{user.email}</span>
              </p>
            </>
          ) : (
            <Link
              href="/login"
              className="w-full px-6 py-4 rounded-2xl bg-black text-white font-bold text-lg hover:scale-105 transition-transform shadow-lg shadow-black/20"
            >
              Get Started with Google
            </Link>
          )}
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl w-full">
          {[
            { title: 'Real-time Stats', desc: 'See your daily commissions and pickups instantly.' },
            { title: 'Easy Entry', desc: 'Log deliveries and pickups with just a few taps.' },
            { title: 'Performance', desc: 'Track your KPI points and monthly earnings.' }
          ].map((feature, i) => (
            <div key={i} className="p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-left">
              <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>
      
      <footer className="p-8 text-center text-zinc-400 text-sm border-t dark:border-zinc-900">
        &copy; {new Date().getFullYear()} CourierEarn. Built for Couriers.
      </footer>
    </div>
  );
}
