import type React from "react"
import { AdminNav } from "@/components/admin/admin-nav"
import { requireAdmin } from "@/lib/auth/session"

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin()
  return (
    <>
      <AdminNav name={admin.name || admin.email} />
      <div className="md:pl-64">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 md:py-10">{children}</div>
      </div>
    </>
  )
}
