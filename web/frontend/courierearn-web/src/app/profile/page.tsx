"use client";
import { useEffect, useMemo, useState, useRef } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import Link from "next/link";

type Profile = {
  id: string;
  auth_user_id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  branch: string | null;
  phone: string | null;
};

export default function ProfilePage() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [authEmail, setAuthEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [kpi, setKpi] = useState<number>(0);
  const [totalEarnings, setTotalEarnings] = useState<number>(0);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      const uid = data.user?.id ?? null;
      const email = data.user?.email ?? null;
      setUserId(uid);
      setAuthEmail(email);
      if (uid) {
        const { data: rows } = await supabase
          .from("users")
          .select("*")
          .eq("auth_user_id", uid)
          .limit(1);
        const p = rows?.[0] ?? null;
        setProfile(p);
        setAvatarPreview(p?.avatar_url ?? null);

        const { data: txSum } = await supabase
          .from("transactions")
          .select("amount")
          .eq("user_id", p?.id ?? "")
          .eq("pickup_location", "daily-delivery");
        const earnings =
          ((txSum ?? []) as Array<{ amount: number }>).reduce(
            (acc, cur) => acc + Number(cur.amount || 0),
            0
          ) || 0;
        setTotalEarnings(earnings);

        const { data: pickups } = await supabase
          .from("pickups")
          .select("notes")
          .eq("user_id", p?.id ?? "")
          .eq("location", "daily-pickup");
        const pickupKpi = ((pickups ?? []) as Array<{ notes: string | null }>).reduce((acc, cur) => {
          const notes = String(cur.notes || "");
          const houses = Number(notes.match(/houses=(\d+)/)?.[1] ?? 0);
          const parcels = Number(notes.match(/parcels=(\d+)/)?.[1] ?? 0);
          return acc + houses + parcels * 0.1;
        }, 0);
        const txCount = (txSum ?? []).length;
        setKpi(txCount + pickupKpi);
      }
      setLoading(false);
    })();
  }, [supabase]);

  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setAvatarPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const saveProfile = async () => {
    if (!userId) return;
    setSaving(true);
    try {
      const lower = (v: string | null) => (v ? v.toLowerCase() : v);
      const payload = {
        auth_user_id: userId,
        email: authEmail,
        full_name: lower(profile?.full_name ?? null),
        branch: lower(profile?.branch ?? null),
        phone: lower(profile?.phone ?? null),
        avatar_url: avatarPreview,
      };
      if (profile?.id) {
        await supabase.from("users").update(payload).eq("id", profile.id);
      } else {
        const { data } = await supabase.from("users").insert(payload).select("*").limit(1);
        const p = data?.[0] ?? null;
        setProfile(p);
      }
      alert("Profile saved");
    } finally {
      setSaving(false);
    }
  };

  const removeAvatar = () => {
    setAvatarPreview(null);
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="animate-pulse text-zinc-500 font-medium">Loading profile…</div>
      </main>
    );
  }

  if (!userId) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black p-6 text-center">
        <div>
           <p className="text-zinc-500 mb-4">You need to sign in to view your profile.</p>
           <Link href="/login" className="px-4 py-2 bg-black text-white rounded-xl font-bold">Sign In</Link>
        </div>
      </main>
    );
  }

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
          <h1 className="text-xl font-bold">Your Profile</h1>
          <button
            onClick={saveProfile}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold text-sm shadow-lg shadow-black/10 disabled:opacity-50 hover:scale-105 transition-transform"
          >
            {saving ? "Saving…" : "Edit"}
          </button>
        </header>

        <div className="flex flex-col items-center mb-10">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full border-4 border-white dark:border-zinc-900 overflow-hidden shadow-xl bg-zinc-200 dark:bg-zinc-800">
              {avatarPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl font-black text-zinc-400">
                  {profile?.full_name?.[0]?.toUpperCase() || "C"}
                </div>
              )}
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={onAvatarChange}
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 text-xs font-bold rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 transition-colors"
            >
              Upload
            </button>
            <button 
              onClick={removeAvatar}
              className="px-4 py-2 text-xs font-bold rounded-xl border border-red-100 dark:border-red-900/30 text-red-500 bg-red-50/50 dark:bg-red-900/10 hover:bg-red-50 transition-colors"
            >
              Remove
            </button>
          </div>
        </div>

        <div className="space-y-6 bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm mb-8">
          <div>
            <label className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-2 block">Username</label>
            <input
              className="w-full px-0 py-1 text-xl font-bold bg-transparent border-b border-transparent focus:border-zinc-200 focus:outline-none placeholder:text-zinc-300"
              value={profile?.full_name ?? ""}
              placeholder="e.g. ppa | 30"
              onChange={(e) =>
                setProfile((p) => (p ? { ...p, full_name: e.target.value.toLowerCase() } : p))
              }
            />
          </div>

          <div>
            <label className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-2 block">Email Address</label>
            <input 
              className="w-full px-0 py-1 text-zinc-500 bg-transparent focus:outline-none cursor-not-allowed" 
              value={authEmail ?? ""} 
              readOnly 
            />
          </div>

          <div className="grid grid-cols-2 gap-8 pt-4">
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-2 block">Branch</label>
              <input
                className="w-full px-0 py-1 font-bold bg-transparent border-b border-transparent focus:border-zinc-200 focus:outline-none placeholder:text-zinc-300"
                value={profile?.branch ?? ""}
                placeholder="e.g. downtown"
                onChange={(e) =>
                  setProfile((p) => (p ? { ...p, branch: e.target.value.toLowerCase() } : p))
                }
              />
            </div>
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-2 block">Phone</label>
              <input
                className="w-full px-0 py-1 font-bold bg-transparent border-b border-transparent focus:border-zinc-200 focus:outline-none placeholder:text-zinc-300"
                value={profile?.phone ?? ""}
                placeholder="e.g. 09..."
                onChange={(e) =>
                  setProfile((p) => (p ? { ...p, phone: e.target.value.toLowerCase() } : p))
                }
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-6 rounded-[2rem] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center shadow-sm">
            <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Total Earnings</div>
            <div className="text-2xl font-black text-black dark:text-white">{totalEarnings.toFixed(2)}</div>
          </div>
          <div className="p-6 rounded-[2rem] bg-black dark:bg-white text-center shadow-lg shadow-black/10">
            <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-1">KPI Points</div>
            <div className="text-2xl font-black text-white dark:text-black">{kpi.toFixed(1)}</div>
          </div>
        </div>
      </div>
    </main>
  );
}
