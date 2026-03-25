import { createClient } from '@/lib/supabase/server'
import AdminNav from '@/components/admin/AdminNav'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Login page — no sidebar
  if (!user) {
    return <>{children}</>
  }

  return (
    <div className="admin-bg">
      <AdminNav />
      <main className="ml-64 p-8 relative z-10">{children}</main>
    </div>
  )
}
