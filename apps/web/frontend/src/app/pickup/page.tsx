"use client";
import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function PickupEntryPage() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [houses, setHouses] = useState<number>(0);
  const [parcels, setParcels] = useState<number>(0);
  const [userRowId, setUserRowId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      const uid = data.user?.id ?? null;
      if (!uid) {
        setErrorMessage("Please sign in to save entries.");
        setLoadingUser(false);
        return;
      }
      const { data: profile, error } = await supabase
        .from("users")
        .upsert(
          { auth_user_id: uid, email: data.user?.email ?? null },
          { onConflict: "auth_user_id" }
        )
        .select("*")
        .single();
      if (error) {
        setErrorMessage(error.message);
      } else {
        setUserRowId(profile?.id ?? null);
      }
      setLoadingUser(false);
    })();
  }, [supabase]);

  const total = houses + parcels;

  const save = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    if (!userRowId) {
      setErrorMessage("User not loaded. Please try again.");
      return;
    }
    if (total <= 0) {
      setErrorMessage("Please enter at least one pickup.");
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase.from("pickups").insert({
        user_id: userRowId,
        scheduled_at: new Date(date).toISOString(),
        location: "daily-pickup",
        houses: houses,
        parcels: parcels,
        notes: `houses=${houses};parcels=${parcels}`,
      });
      if (error) {
        setErrorMessage(error.message);
      } else {
        setSuccessMessage("Saved pickup entry");
        setHouses(0);
        setParcels(0);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black p-4 md:p-8">
      <div className="max-w-xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <Link 
            href="/dashboard" 
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:bg-zinc-50 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-xl font-bold">Pickup Entry</h1>
          <button
            onClick={save}
            disabled={saving || loadingUser || total <= 0}
            className="px-6 py-2 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold text-sm shadow-lg shadow-black/10 disabled:opacity-50 hover:scale-105 transition-transform"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </header>
        {(errorMessage || successMessage) && (
          <div
            className={`mb-6 rounded-2xl px-4 py-3 text-sm font-medium ${
              errorMessage
                ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                : "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
            }`}
          >
            {errorMessage ?? successMessage}
          </div>
        )}

        <div className="space-y-6 bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm mb-8">
          <div>
            <label className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-2 block">Date</label>
            <input
              type="date"
              className="w-full px-0 py-2 text-xl font-bold bg-transparent border-b border-zinc-100 dark:border-zinc-800 focus:border-black dark:focus:border-white focus:outline-none transition-colors"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-8 pt-4">
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-2 block" title="Number of pickup houses">Pickup Houses</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                className="w-full px-0 py-1 text-2xl font-bold bg-transparent border-b border-transparent focus:border-zinc-200 focus:outline-none"
                value={houses || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || /^\d+$/.test(val)) {
                    setHouses(val === "" ? 0 : Number(val));
                  }
                }}
              />
            </div>
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-2 block" title="Number of pickup parcels">Pickup Parcels</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                className="w-full px-0 py-1 text-2xl font-bold bg-transparent border-b border-transparent focus:border-zinc-200 focus:outline-none"
                value={parcels || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || /^\d+$/.test(val)) {
                    setParcels(val === "" ? 0 : Number(val));
                  }
                }}
              />
            </div>
          </div>
        </div>

        <div className="p-8 rounded-[2rem] bg-black dark:bg-white text-center shadow-xl shadow-black/10">
          <div className="text-xs font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-1">Total Pickups</div>
          <div className="text-5xl font-black text-white dark:text-black tracking-tighter">{total}</div>
        </div>
      </div>
    </main>
  );
}
