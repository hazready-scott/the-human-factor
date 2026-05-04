'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { LayoutDashboard, Users, FileText, LogOut, Presentation, UserCircle, Calendar, ClipboardCheck, Settings } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const links = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/contacts', label: 'Contacts', icon: Users, badge: 'contacts' as const },
  { href: '/admin/assessments', label: 'Assessments', icon: ClipboardCheck },
  { href: '/admin/presentations', label: 'Presentations', icon: Presentation },
  { href: '/admin/articles', label: 'Articles', icon: FileText },
  { href: '/admin/associates', label: 'Associates', icon: UserCircle },
  { href: '/admin/events', label: 'Events', icon: Calendar },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [newContactCount, setNewContactCount] = useState(0)

  useEffect(() => {
    const fetchNewCount = async () => {
      try {
        const res = await fetch('/api/admin/stats')
        if (res.ok) {
          const data = await res.json()
          setNewContactCount(data.contacts?.byStatus?.new || 0)
        }
      } catch { /* silent */ }
    }
    fetchNewCount()
    const interval = setInterval(fetchNewCount, 60000)
    return () => clearInterval(interval)
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-64 text-white flex flex-col z-40" style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(16px)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="p-6 border-b border-white/10">
        <h1 className="text-lg font-bold">The Human Factor</h1>
        <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">Admin Portal</p>
      </div>

      <nav className="flex-1 py-4">
        {links.map((link) => {
          const isActive = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href))
          const Icon = link.icon
          const badgeCount = link.badge === 'contacts' ? newContactCount : 0
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-white/10 text-[#c9944a] border-r-2 border-[#c9944a]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={18} />
              {link.label}
              {badgeCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {badgeCount > 9 ? '9+' : badgeCount}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-2 py-2 text-sm text-slate-500 hover:text-white transition-colors w-full"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
