"use client";
import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function KPIPage() {
    const [loading, setLoading] = useState(true);
    const [kpiData, setKpiData] = useState<any>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch("/api/kpi/current");
                if (res.ok) {
                    const data = await res.json();
                    setKpiData(data);
                }
            } catch (err) {
                console.error("Error fetching KPI:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
                <div className="animate-pulse text-zinc-500 font-medium">Loading KPI...</div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-black p-6">
            <div className="max-w-xl mx-auto space-y-6">
                <header>
                    <h1 className="text-3xl font-black tracking-tight">KPI Performance</h1>
                    <p className="text-zinc-500">Track your delivery and pickup targets.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-8 rounded-[2rem] bg-black dark:bg-white text-white dark:text-black shadow-xl">
                        <div className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-2">Daily Points</div>
                        <div className="text-4xl font-black">{kpiData?.dailyPoints?.total?.toFixed(1) || "0.0"}</div>
                    </div>

                    <div className="p-8 rounded-[2rem] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                        <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Monthly Achievement</div>
                        <div className="text-4xl font-black">{kpiData?.monthlyKpi?.total_points || 0}</div>
                    </div>
                </div>

                <section className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-zinc-100 dark:border-zinc-800">
                        <h2 className="text-sm font-black uppercase tracking-widest">Branch {kpiData?.branch || 'A'} Targets</h2>
                    </div>
                    <div className="p-6">
                        <div className="text-sm text-zinc-500">
                            Grade thresholds and performance metrics for your assigned branch.
                        </div>
                        {/* Simple list or table can go here */}
                        <div className="mt-4 space-y-2">
                            {kpiData?.grades?.map((g: any) => (
                                <div key={g.grade} className="flex justify-between items-center py-2 border-b border-zinc-50 dark:border-zinc-800 last:border-0">
                                    <span className="font-bold">Grade {g.grade}</span>
                                    <span className="text-zinc-600 dark:text-zinc-400 text-sm">{g.monthly_ll_point} pts monthly</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
