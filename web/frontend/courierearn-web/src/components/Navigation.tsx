'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

export default function Navigation() {
  const pathname = usePathname()
  const supabase = getSupabaseBrowserClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: '📊' },
    { label: 'Delivery', href: '/delivery', icon: '🚚' },
    { label: 'Pickup', href: '/pickup', icon: '📦' },
    { label: 'KPI', href: '/kpi', icon: '🏆' },
    { label: 'Profile', href: '/profile', icon: '👤' },
  ]

  return (
    <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 dark:bg-black/80 dark:border-zinc-800">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-bold text-xl tracking-tight hover:opacity-80 transition-opacity">
            CourierEarn
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${pathname === item.href
                  ? 'bg-zinc-100 text-black dark:bg-zinc-800 dark:text-white'
                  : 'text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-900'
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm font-medium px-3 py-2 rounded-md text-zinc-600 hover:text-red-600 hover:bg-red-50 dark:text-zinc-400 dark:hover:text-red-400 dark:hover:bg-red-900/20 transition-all"
        >
          Logout
        </button>
      </div>
      {/* Mobile Nav (Bottom) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t dark:bg-black dark:border-zinc-800 px-6 py-3 flex items-center justify-between z-50">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 transition-all ${pathname === item.href
              ? 'text-black dark:text-white scale-110'
              : 'text-zinc-400'
              }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
