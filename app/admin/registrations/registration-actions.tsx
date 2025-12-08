"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface RegistrationActionsProps {
  registrationId: string
  currentStatus: string
}

export function RegistrationActions({ registrationId, currentStatus }: RegistrationActionsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const updateStatus = async (newStatus: string) => {
    setIsLoading(true)
    try {
      const { error } = await supabase.from("registrations").update({ status: newStatus }).eq("id", registrationId)

      if (error) throw error
      router.refresh()
    } catch (error) {
      console.error("Error updating status:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {currentStatus !== "approved" && (
        <Button size="sm" onClick={() => updateStatus("approved")} disabled={isLoading}>
          승인
        </Button>
      )}
      {currentStatus !== "finalist" && currentStatus === "approved" && (
        <Button size="sm" variant="secondary" onClick={() => updateStatus("finalist")} disabled={isLoading}>
          본선 진출
        </Button>
      )}
      {currentStatus !== "rejected" && (
        <Button size="sm" variant="destructive" onClick={() => updateStatus("rejected")} disabled={isLoading}>
          거절
        </Button>
      )}
      {currentStatus !== "pending" && (
        <Button size="sm" variant="outline" onClick={() => updateStatus("pending")} disabled={isLoading}>
          검토중으로 변경
        </Button>
      )}
    </div>
  )
}
