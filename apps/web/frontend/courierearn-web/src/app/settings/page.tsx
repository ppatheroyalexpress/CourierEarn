"use client";
import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function SettingsPage() {
    const supabase = useMemo(() => getSupabaseBrowserClient(), []);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [resettingWarnings, setResettingWarnings] = useState(false);
    const [profile, setProfile] = useState<{ id: string; branch: string } | null>(null);
    const [warningCount, setWarningCount] = useState(0);

    useEffect(() => {
        async function fetchProfile() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: rows } = await supabase
                    .from("users")
                    .select("id, branch")
                    .eq("auth_user_id", user.id)
                    .limit(1);
                if (rows?.[0]) {
                    setProfile({
                        id: rows[0].id,
                        branch: rows[0].branch || 'A'
                    });

                    // Fetch warning count
                    const { data: warnings } = await supabase
                        .from("user_warnings")
                        .select("id")
                        .eq("user_id", rows[0].id)
                        .eq("is_active", true);
                    
                    setWarningCount(warnings?.length || 0);
                }
            }
            setLoading(false);
        }
        fetchProfile();
    }, [supabase]);

    const saveSettings = async (newBranch: string) => {
        if (!profile) return;
        setSaving(true);
        try {
            setProfile(p => p ? { ...p, branch: newBranch } : null);
            const { error } = await supabase
                .from("users")
                .update({ branch: newBranch })
                .eq("id", profile.id);

            if (error) throw error;
            alert("Settings updated!");
        } catch (err) {
            console.error("Error saving branch:", err);
            alert("Failed to save branch");
        } finally {
            setSaving(false);
        }
    };

    const resetWarnings = async () => {
        if (!profile) return;
        if (!confirm("Are you sure you want to reset all your warnings? This action cannot be undone.")) {
            return;
        }
        
        setResettingWarnings(true);
        try {
            const response = await fetch('/api/warnings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    targetUserId: profile.id
                })
            });

            if (!response.ok) {
                throw new Error('Failed to reset warnings');
            }

            const result = await response.json();
            setWarningCount(0);
            alert(`Successfully reset ${result.resetCount} warnings!`);
        } catch (err) {
            console.error("Error resetting warnings:", err);
            alert("Failed to reset warnings");
        } finally {
            setResettingWarnings(false);
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
                <div className="animate-pulse text-zinc-500 font-medium">Loading settings…</div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-24">
            <div className="max-w-xl mx-auto p-6 md:p-12">
                <header className="flex items-center gap-4 mb-12">
                    <Link
                        href="/dashboard"
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:bg-zinc-50 transition-colors"
                    >
                        <svg className="w-5 h-5 text-zinc-600 dark:text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <h1 className="text-3xl font-black tracking-tight text-black dark:text-white">Settings</h1>
                </header>

                <section className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden p-8 md:p-12">
                    <div className="mb-10">
                        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400 mb-6 flex items-center gap-3">
                            <span className="w-8 h-[2px] bg-black dark:bg-white rounded-full"></span>
                            Work Configuration
                        </h2>
                        <div>
                            <label className="text-lg font-bold text-zinc-700 dark:text-zinc-300 mb-4 block">Operation Branch</label>
                            <div className="grid grid-cols-5 gap-3">
                                {['A', 'B', 'C', 'D', 'E'].map((b) => (
                                    <button
                                        key={b}
                                        onClick={() => saveSettings(b)}
                                        disabled={saving || profile?.branch === b}
                                        className={`h-14 rounded-2xl font-black text-xl transition-all duration-300 ring-offset-2 dark:ring-offset-zinc-900 ${profile?.branch === b
                                            ? "bg-black text-white dark:bg-white dark:text-black shadow-lg shadow-black/20"
                                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                                            } disabled:cursor-default`}
                                    >
                                        {b}
                                    </button>
                                ))}
                            </div>
                            <p className="mt-6 text-sm text-zinc-500 font-medium bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-700">
                                Note: Your KPI targets and grade thresholds are determined by your branch assignment. Changing this will update your monthly goals immediately.
                            </p>
                        </div>
                    </div>

                    <div className="mb-10">
                        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400 mb-6 flex items-center gap-3">
                            <span className="w-8 h-[2px] bg-black dark:bg-white rounded-full"></span>
                            General
                        </h2>
                        <div>
                            <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-200 dark:border-zinc-700">
                                <div className="flex items-center space-x-3">
                                    <AlertTriangle className={`w-5 h-5 ${warningCount > 0 ? 'text-red-500' : 'text-green-500'}`} />
                                    <div>
                                        <div className="font-semibold text-zinc-700 dark:text-zinc-300">Active Warnings</div>
                                        <div className="text-sm text-zinc-500">
                                            {warningCount > 0 ? `${warningCount} active warning${warningCount > 1 ? 's' : ''} affecting your KPI grade` : 'No active warnings'}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={resetWarnings}
                                    disabled={resettingWarnings || warningCount === 0}
                                    className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 flex items-center space-x-2 ${
                                        warningCount === 0
                                            ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed"
                                            : resettingWarnings
                                            ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 cursor-wait"
                                            : "bg-red-500 hover:bg-red-600 text-white hover:shadow-lg"
                                    }`}
                                >
                                    <RefreshCw className={`w-4 h-4 ${resettingWarnings ? 'animate-spin' : ''}`} />
                                    <span>{resettingWarnings ? 'Resetting...' : 'Reset Warnings'}</span>
                                </button>
                            </div>
                            <p className="mt-4 text-sm text-zinc-500 font-medium">
                                Each active warning reduces your KPI grade by 1 level. Reset warnings to restore your full grade potential.
                            </p>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-zinc-100 dark:border-zinc-800">
                        <div className="flex justify-between items-center opacity-40">
                            <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Version 1.2.0</span>
                            <span className="text-xs font-medium text-zinc-400">CourierEarn KPI Engine</span>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
