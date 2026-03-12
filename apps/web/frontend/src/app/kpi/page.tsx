"use client";
import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function KPIPage() {
    const [loading, setLoading] = useState(true);
    const [kpiData, setKpiData] = useState<any>(null);
    const [showHelp, setShowHelp] = useState(false);

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
                <header className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">KPI Performance</h1>
                        <p className="text-zinc-500">Track your delivery and pickup targets.</p>
                    </div>
                    <button
                        onClick={() => setShowHelp(true)}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:bg-zinc-50 transition-colors"
                    >
                        <span className="text-lg font-bold">?</span>
                    </button>
                </header>

                {/* KPI Info Modal */}
                {showHelp && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
                        <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl space-y-6 border border-zinc-200 dark:border-zinc-800">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-black italic tracking-tight uppercase">KPI Scoring Rules</h2>
                                <button onClick={() => setShowHelp(false)} className="text-zinc-400 hover:text-black dark:hover:text-white transition-colors">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-sm">Delivery Waybill</span>
                                        <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Base Points</span>
                                    </div>
                                    <span className="text-xl font-black">+1.0</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-sm">Pickup Location</span>
                                        <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Efficiency</span>
                                    </div>
                                    <span className="text-xl font-black">+1.0</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-sm">Pickup Waybill</span>
                                        <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Volume Bonus</span>
                                    </div>
                                    <span className="text-xl font-black">+0.1</span>
                                </div>
                            </div>

                            <p className="text-xs text-zinc-500 font-medium leading-relaxed bg-zinc-100 dark:bg-zinc-800 p-6 rounded-3xl mt-4 border border-dashed border-zinc-300 dark:border-zinc-700">
                                <span className="text-black dark:text-white font-bold block mb-1">Warning Penalty:</span>
                                Any recorded violation or warning during the month will result in a automatic grade reduction, regardless of total points.
                            </p>
                        </div>
                    </div>
                )}

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
                        <h2 className="text-sm font-black uppercase tracking-widest">Branch {kpiData?.branch?.toUpperCase() || 'A'} Targets</h2>
                    </div>
                    <div className="p-6">
                        <div className="text-sm text-zinc-500">
                            Grade thresholds and performance metrics for your assigned branch.
                        </div>
                        <div className="mt-4 space-y-2">
                            {kpiData?.grades?.map((g: any) => (
                                <div key={g.grade} className="flex justify-between items-center py-2 border-b border-zinc-50 dark:border-zinc-800 last:border-0 text-sm font-bold">
                                    <span>Grade {g.grade}</span>
                                    <span>{g.monthly_ll_point} pts <span className="text-[10px] text-zinc-400 font-black uppercase tracking-widest ml-1">monthly</span></span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
