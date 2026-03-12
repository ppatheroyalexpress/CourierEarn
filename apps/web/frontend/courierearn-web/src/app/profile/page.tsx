"use client";
import { useEffect, useMemo, useState, useRef } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Settings, Info, Upload, Trash2, TrendingUp, Award } from "lucide-react";

type Profile = {
  id: string;
  auth_user_id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  branch: string | null;
  phone: string | null;
  total_earnings?: number;
  total_kpi_points?: number;
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

        // Use stored totals or calculate if not available
        const earnings = p?.total_earnings || 0;
        const kpiPoints = p?.total_kpi_points || 0;
        
        setTotalEarnings(earnings);
        setKpi(kpiPoints);

        // If totals are not stored, calculate and update them
        if (!p?.total_earnings || !p?.total_kpi_points) {
          // Calculate earnings using new commission formula
          const { data: txData } = await supabase
            .from("transactions")
            .select("cash_collect, not_cash")
            .eq("user_id", p?.id ?? "");
          
          const { data: pickupData } = await supabase
            .from("pickups")
            .select("parcels")
            .eq("user_id", p?.id ?? "");

          const cashTotal = (txData || []).reduce((sum, t) => sum + (t.cash_collect || 0), 0);
          const notCashTotal = (txData || []).reduce((sum, t) => sum + (t.not_cash || 0), 0);
          const parcelsTotal = (pickupData || []).reduce((sum, p) => sum + (p.parcels || 0), 0);
          
          const calculatedEarnings = (cashTotal * 200) + (notCashTotal * 100) + (parcelsTotal * 50);
          const calculatedKpi = (txData || []).length + (pickupData || []).length;

          // Update user totals
          await supabase
            .from("users")
            .update({
              total_earnings: calculatedEarnings,
              total_kpi_points: calculatedKpi
            })
            .eq("id", p?.id);

          setTotalEarnings(calculatedEarnings);
          setKpi(calculatedKpi);
        }
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
      <div className="max-w-md mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <Link
            href="/dashboard"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:bg-zinc-50 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold">Profile</h1>
          <div className="w-10 h-10" />
        </header>

        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full border-4 border-white dark:border-zinc-900 overflow-hidden shadow-xl bg-zinc-200 dark:bg-zinc-800">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-black text-zinc-400">
                  {profile?.full_name?.[0]?.toUpperCase() || "C"}
                </div>
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 flex gap-1">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors"
                title="Upload Avatar"
              >
                <Upload className="w-4 h-4" />
              </button>
              {avatarPreview && (
                <button
                  onClick={removeAvatar}
                  className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                  title="Remove Avatar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={onAvatarChange}
          />
        </div>

        {/* User Info */}
        <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-6 mb-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
          <div className="space-y-4">
            <div>
              <input
                className="w-full text-2xl font-bold bg-transparent border-none focus:outline-none placeholder:text-zinc-400 text-center"
                value={profile?.full_name || ""}
                placeholder="Username"
                onChange={(e) =>
                  setProfile((p) => (p ? { ...p, full_name: e.target.value.toLowerCase() } : p))
                }
              />
            </div>
            <div>
              <input
                className="w-full text-zinc-500 bg-transparent border-none focus:outline-none text-center"
                value={authEmail || ""}
                readOnly
              />
            </div>
            <div>
              <input
                className="w-full text-zinc-600 bg-transparent border-none focus:outline-none text-center placeholder:text-zinc-400"
                value={profile?.phone || ""}
                placeholder="Phone Number"
                onChange={(e) =>
                  setProfile((p) => (p ? { ...p, phone: e.target.value } : p))
                }
              />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-[1.5rem] p-4 text-white shadow-lg">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="text-xs font-medium opacity-90 text-center">Total Earnings</div>
            <div className="text-xl font-black text-center">MMK {totalEarnings.toLocaleString()}</div>
          </div>
          <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-[1.5rem] p-4 text-white shadow-lg">
            <div className="flex items-center justify-center mb-2">
              <Award className="w-6 h-6" />
            </div>
            <div className="text-xs font-medium opacity-90 text-center">KPI Points</div>
            <div className="text-xl font-black text-center">{kpi.toFixed(1)}</div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="space-y-3">
          <Link
            href="/settings"
            className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 rounded-[1.5rem] shadow-sm border border-zinc-200 dark:border-zinc-800 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-3">
              <Settings className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
              <span className="font-medium">Settings</span>
            </div>
            <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          
          <Link
            href="/about"
            className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 rounded-[1.5rem] shadow-sm border border-zinc-200 dark:border-zinc-800 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-3">
              <Info className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
              <span className="font-medium">About</span>
            </div>
            <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Version Info */}
        <div className="mt-8 text-center">
          <div className="text-xs text-zinc-500 font-medium">Version v1.0 "Yam"</div>
          <div className="text-xs text-zinc-400 mt-1">CourierEarn KPI Engine</div>
        </div>

        {/* Save Button */}
        <div className="mt-8">
          <button
            onClick={saveProfile}
            disabled={saving}
            className="w-full py-3 rounded-[1.5rem] bg-black dark:bg-white text-white dark:text-black font-bold shadow-lg shadow-black/10 disabled:opacity-50 hover:scale-[1.02] transition-transform"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </div>
    </main>
  );
}
