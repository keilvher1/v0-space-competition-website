"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import type { SaveResult } from "./form-types"

// 두 번 눌러 확인하는 삭제 버튼(브라우저 확인창 없이 모바일에서도 동작)
export function DeleteButton({
  action,
  redirectTo,
  label = "삭제",
}: {
  action: () => Promise<SaveResult>
  redirectTo?: string
  label?: string
}) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="rounded-md border border-red-300 bg-white px-3 py-2 text-sm font-bold text-red-700 hover:bg-red-50"
      >
        {label}
      </button>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-bold text-red-700">정말 삭제할까요? 되돌릴 수 없습니다.</span>
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            const result = await action()
            if (!result.ok) {
              setError(result.error)
              return
            }
            if (redirectTo) router.replace(redirectTo)
            router.refresh()
          })
        }
        className="rounded-md border border-red-700 bg-red-700 px-3 py-2 text-sm font-bold text-white disabled:opacity-60"
      >
        {pending ? "삭제 중…" : "삭제"}
      </button>
      <button type="button" onClick={() => setConfirming(false)} className="rounded-md border border-line bg-white px-3 py-2 text-sm font-bold">
        취소
      </button>
      {error && <span className="text-sm text-red-700">{error}</span>}
    </div>
  )
}
