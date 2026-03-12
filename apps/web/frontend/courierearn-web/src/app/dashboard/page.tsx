'use client'

import { useEffect, useState } from 'react'
import type { User } from "@supabase/supabase-js"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

function greeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [summary, setSummary] = useState({
    todayCommission: 0,
    todayPickupTotal: 0,
    todayDeliveryTotal: 0,
    todayCashCollect: 0,
    todayNotCashCollect: 0,
    todayEc: 0,
    todayHouses: 0,
    todayParcels: 0,
    mtdEarnings: 0,
    mtdEc: 0,
  })
  const [tickerText, setTickerText] = useState("Loading...")

  useEffect(() => {
    const fetchData = async () => {
      const supabase = getSupabaseBrowserClient()
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        setUser(session.user)
        
        // Fetch summary and ticker from API routes
        try {
          const [summaryRes, tickerRes] = await Promise.all([
            fetch('/api/dashboard/summary'),
            fetch('/api/dashboard/ticker')
          ])
          
          if (summaryRes.ok) {
            const summaryData = await summaryRes.json()
            setSummary(summaryData)
          }
          
          if (tickerRes.ok) {
            const tickerData = await tickerRes.json()
            setTickerText(tickerData.text)
          }
        } catch (error) {
          console.error("Error fetching dashboard data:", error)
          setTickerText("Error loading data")
        }
      } else {
        setTickerText("No data for yesterday")
      }
      setLoading(false)
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen p-6 flex items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-xl font-semibold animate-pulse text-zinc-500">Loading Dashboard...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black p-4 md:p-8">
      <style>{`
        @keyframes tickerMove {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            {greeting()}, {user ? user.email?.split('@')[0] ?? "Courier" : "Guest"}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">{"Here's what's happening today."}</p>
        </header>

        <div className="overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 mb-8 shadow-sm">
          <div
            style={{ animation: "tickerMove 15s linear infinite", whiteSpace: "nowrap" }}
            className="px-6 py-3 text-sm font-medium text-zinc-600 dark:text-zinc-400"
          >
            {tickerText}
          </div>
        </div>

        <div className="space-y-6">
          {/* Today's Commission - Full Width */}
          <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">{"Today's Commission"}</div>
            <div className="text-4xl font-black text-black dark:text-white">MMK {summary.todayCommission.toLocaleString()}</div>
          </div>
          
          {/* Today's Delivery and Today's Pickup - Side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">{"Today's Delivery"}</div>
              <div className="text-4xl font-black text-black dark:text-white">{summary.todayCashCollect} ({summary.todayNotCashCollect})</div>
              <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-1">Cash (Not Cash)</div>
            </div>
            
            <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">{"Today's Pickup"}</div>
              <div className="text-4xl font-black text-black dark:text-white">{summary.todayHouses} ({summary.todayParcels})</div>
              <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-1">Houses (Parcels)</div>
            </div>
          </div>

          {/* MTD Earnings and Month to Date EC - Side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 rounded-3xl bg-black dark:bg-white text-center shadow-lg shadow-black/10 transition-transform hover:scale-[1.02]">
              <div className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">MTD Earnings</div>
              <div className="text-4xl font-black text-white dark:text-black">MMK {summary.mtdEarnings.toLocaleString()}</div>
              <div className="text-xs font-medium text-zinc-300 dark:text-zinc-600 mt-1">MMK</div>
            </div>

            <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Month to Date EC</div>
              <div className="text-4xl font-black text-black dark:text-white">{summary.mtdEc}</div>
              <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-1">pcs</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
