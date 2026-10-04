"use client"

import { useState, useTransition } from "react"

type Field = { name: string; label: string; type: string; autoComplete: string; help?: string }

const inputCls =
  "w-full rounded-md border border-input bg-white px-3 py-3 text-base text-ink outline-none transition focus:border-ink focus:ring-2 focus:ring-coral/40"

// 로그인·첫 관리자 만들기 폼. 성공하면 서버 액션이 /admin으로 리다이렉트한다.
export function AuthForm({
  fields,
  submitLabel,
  action,
}: {
  fields: Field[]
  submitLabel: string
  action: (input: Record<string, string>) => Promise<{ ok: false; error: string } | void>
}) {
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  return (
    <form
      className="grid gap-4"
      onSubmit={(e) => {
        e.preventDefault()
        const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>
        setError(null)
        startTransition(async () => {
          const result = await action(data)
          if (result && !result.ok) setError(result.error)
        })
      }}
    >
      {fields.map((f) => (
        <div key={f.name}>
          <label htmlFor={f.name} className="mb-1.5 block text-sm font-bold">
            {f.label}
          </label>
          <input id={f.name} name={f.name} type={f.type} autoComplete={f.autoComplete} required className={inputCls} />
          {f.help && <p className="mt-1 text-xs text-ink-soft">{f.help}</p>}
        </div>
      ))}
      {error && (
        <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
          {error}
        </p>
      )}
      <button type="submit" disabled={pending} className="btn btn-coral mt-2 justify-center disabled:opacity-60">
        {pending ? "확인 중…" : submitLabel}
      </button>
    </form>
  )
}
