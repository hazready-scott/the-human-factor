'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, FileText, LogOut, Presentation, UserCircle, Calendar } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const links = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/contacts', label: 'Contacts', icon: Users },
  { href: '/admin/presentations', label: 'Presentations', icon: Presentation },
  { href: '/admin/articles', label: 'Articles', icon: FileText },
  { href: '/admin/associates', label: 'Associates', icon: UserCircle },
  { href: '/admin/events', label: 'Events', icon: Calendar },
]

export default function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()

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
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-white/10 text-cyan-400 border-r-2 border-cyan-400'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={18} />
              {link.label}
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
