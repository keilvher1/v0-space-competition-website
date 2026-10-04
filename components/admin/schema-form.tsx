"use client"

import type React from "react"
import { useEffect, useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import type { FieldDef, SaveResult } from "./form-types"
import { ImageField } from "./image-field"
import { fromKstInput, toKstInput } from "@/lib/cms/utils"

type Path = (string | number)[]
type Json = unknown

function getAt(obj: Json, path: Path): Json {
  return path.reduce<Json>((acc, key) => (acc == null ? undefined : (acc as Record<string | number, Json>)[key]), obj)
}

function setAt(obj: Json, path: Path, value: Json): Json {
  if (path.length === 0) return value
  const [head, ...rest] = path
  if (Array.isArray(obj)) {
    const copy = [...obj]
    copy[head as number] = setAt(copy[head as number], rest, value)
    return copy
  }
  const base = (obj && typeof obj === "object" ? obj : {}) as Record<string, Json>
  return { ...base, [head]: setAt(base[head as string], rest, value) }
}

/** 목록에 새 항목을 추가할 때 쓰는 빈 값 */
export function emptyValue(fields: FieldDef[]): Record<string, Json> {
  const out: Record<string, Json> = {}
  for (const f of fields) {
    if (f.kind === "group") {
      if (f.name) out[f.name] = emptyValue(f.fields)
      else Object.assign(out, emptyValue(f.fields))
      continue
    }
    switch (f.kind) {
      case "number":
        out[f.name] = 0
        break
      case "switch":
        out[f.name] = false
        break
      case "select":
        out[f.name] = f.options[0]?.value ?? ""
        break
      case "strings":
      case "colors":
      case "checkboxes":
      case "list":
        out[f.name] = []
        break
      default:
        out[f.name] = ""
    }
  }
  return out
}

const FLASH_KEY = "wf-admin-flash"

const inputCls =
  "w-full rounded-md border border-input bg-white px-3 py-2.5 text-[15px] text-ink outline-none transition focus:border-ink focus:ring-2 focus:ring-coral/40"

function Label({ field, htmlFor }: { field: { label: string; help?: string }; htmlFor?: string }) {
  return (
    <div className="mb-1.5">
      <label htmlFor={htmlFor} className="text-sm font-bold text-ink">
        {field.label}
      </label>
      {field.help && <p className="mt-0.5 text-xs leading-relaxed text-ink-soft">{field.help}</p>}
    </div>
  )
}

function SmallButton({ children, onClick, tone = "default", disabled }: {
  children: React.ReactNode
  onClick: () => void
  tone?: "default" | "danger"
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-md border px-2.5 py-1.5 text-xs font-bold transition disabled:opacity-30 ${
        tone === "danger" ? "border-red-300 text-red-700 hover:bg-red-50" : "border-line bg-white text-ink hover:bg-cream"
      }`}
    >
      {children}
    </button>
  )
}

function move<T>(arr: T[], from: number, to: number) {
  const copy = [...arr]
  const [item] = copy.splice(from, 1)
  copy.splice(to, 0, item)
  return copy
}

function Field({ field, value, onChange, path }: { field: FieldDef; value: Json; onChange: (path: Path, v: Json) => void; path: Path }) {
  if (field.kind === "group") {
    const groupPath = field.name ? [...path, field.name] : path
    return (
      <details open={field.open ?? false} className="group rounded-lg border border-line bg-white [&[open]>summary]:border-b">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 border-line px-4 py-3.5 font-extrabold [&::-webkit-details-marker]:hidden">
          <span>
            {field.label}
            {field.help && <span className="mt-0.5 block text-xs font-medium text-ink-soft">{field.help}</span>}
          </span>
          <span aria-hidden="true" className="text-xl transition-transform group-open:rotate-45">
            +
          </span>
        </summary>
        <div className="grid gap-5 p-4">
          {field.fields.map((f, i) => (
            <Field key={("name" in f && f.name) || i} field={f} value={value} onChange={onChange} path={groupPath} />
          ))}
        </div>
      </details>
    )
  }

  const fieldPath = [...path, field.name]
  const current = getAt(value, fieldPath)
  const id = fieldPath.join(".")
  const set = (v: Json) => onChange(fieldPath, v)

  switch (field.kind) {
    case "text":
    case "url":
    case "email":
    case "password":
      return (
        <div>
          <Label field={field} htmlFor={id} />
          <input
            id={id}
            type={field.kind === "text" ? "text" : field.kind}
            className={inputCls}
            value={(current as string) ?? ""}
            placeholder={field.placeholder}
            required={field.required}
            autoComplete={field.kind === "password" ? "new-password" : undefined}
            onChange={(e) => set(e.target.value)}
          />
        </div>
      )
    case "textarea":
      return (
        <div>
          <Label field={field} htmlFor={id} />
          <textarea
            id={id}
            rows={field.rows ?? 4}
            className={`${inputCls} leading-relaxed`}
            value={(current as string) ?? ""}
            placeholder={field.placeholder}
            onChange={(e) => set(e.target.value)}
          />
        </div>
      )
    case "number":
      return (
        <div>
          <Label field={field} htmlFor={id} />
          <input
            id={id}
            type="number"
            inputMode="numeric"
            className={inputCls}
            value={Number.isFinite(current as number) ? (current as number) : ""}
            placeholder={field.placeholder}
            onChange={(e) => set(e.target.value === "" ? 0 : Number(e.target.value))}
          />
        </div>
      )
    case "color":
      return (
        <div>
          <Label field={field} htmlFor={id} />
          <div className="flex items-center gap-3">
            <input
              type="color"
              aria-label={`${field.label} 선택`}
              className="h-11 w-14 shrink-0 cursor-pointer rounded-md border border-input bg-white p-1"
              value={/^#[0-9a-f]{6}$/i.test(String(current)) ? String(current) : "#2bb6e3"}
              onChange={(e) => set(e.target.value)}
            />
            <input id={id} className={inputCls} value={(current as string) ?? ""} placeholder="#2bb6e3" onChange={(e) => set(e.target.value)} />
          </div>
        </div>
      )
    case "image":
      return (
        <div>
          <Label field={field} htmlFor={id} />
          <ImageField id={id} value={(current as string) ?? ""} onChange={set} />
        </div>
      )
    case "datetime":
      return (
        <div>
          <Label field={{ ...field, help: field.help ?? "한국 시간 기준" }} htmlFor={id} />
          <input
            id={id}
            type="datetime-local"
            className={inputCls}
            value={toKstInput((current as string) ?? "")}
            onChange={(e) => set(fromKstInput(e.target.value))}
          />
        </div>
      )
    case "switch":
      return (
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            className="mt-0.5 size-5 shrink-0 accent-[var(--coral)]"
            checked={Boolean(current)}
            onChange={(e) => set(e.target.checked)}
          />
          <span>
            <span className="text-sm font-bold">{field.label}</span>
            {field.help && <span className="mt-0.5 block text-xs text-ink-soft">{field.help}</span>}
          </span>
        </label>
      )
    case "select":
      return (
        <div>
          <Label field={field} htmlFor={id} />
          <select id={id} className={inputCls} value={String(current ?? "")} onChange={(e) => set(e.target.value)}>
            {field.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      )
    case "checkboxes": {
      const selected = (Array.isArray(current) ? current : []) as (string | number)[]
      return (
        <fieldset>
          <Label field={field} />
          <div className="flex flex-wrap gap-2">
            {field.options.map((o) => {
              const v = field.numeric ? Number(o.value) : o.value
              const on = selected.includes(v)
              return (
                <label
                  key={o.value}
                  className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm font-bold ${on ? "border-ink bg-ink text-cream" : "border-line bg-white"}`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={on}
                    onChange={() => set(on ? selected.filter((s) => s !== v) : [...selected, v])}
                  />
                  {o.label}
                </label>
              )
            })}
          </div>
        </fieldset>
      )
    }
    case "strings":
    case "colors": {
      const items = (Array.isArray(current) ? current : []) as string[]
      return (
        <div>
          <Label field={field} />
          <div className="grid gap-2">
            {items.map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                {field.kind === "colors" && (
                  <input
                    type="color"
                    aria-label={`${field.label} ${i + 1}`}
                    className="h-11 w-14 shrink-0 cursor-pointer rounded-md border border-input bg-white p-1"
                    value={/^#[0-9a-f]{6}$/i.test(item) ? item : "#fcedce"}
                    onChange={(e) => set(items.map((x, j) => (j === i ? e.target.value : x)))}
                  />
                )}
                {field.kind === "strings" && field.multiline ? (
                  <textarea
                    rows={3}
                    className={inputCls}
                    value={item}
                    onChange={(e) => set(items.map((x, j) => (j === i ? e.target.value : x)))}
                  />
                ) : (
                  <input
                    className={inputCls}
                    value={item}
                    placeholder={field.kind === "strings" ? field.placeholder : "#fcedce"}
                    onChange={(e) => set(items.map((x, j) => (j === i ? e.target.value : x)))}
                  />
                )}
                <div className="flex shrink-0 flex-col gap-1 sm:flex-row">
                  <SmallButton onClick={() => set(move(items, i, i - 1))} disabled={i === 0}>
                    ↑
                  </SmallButton>
                  <SmallButton tone="danger" onClick={() => set(items.filter((_, j) => j !== i))}>
                    삭제
                  </SmallButton>
                </div>
              </div>
            ))}
            <div>
              <SmallButton onClick={() => set([...items, field.kind === "colors" ? "#fcedce" : ""])}>
                + {field.kind === "strings" ? field.addLabel ?? "항목 추가" : "색 추가"}
              </SmallButton>
            </div>
          </div>
        </div>
      )
    }
    case "list": {
      const items = (Array.isArray(current) ? current : []) as Record<string, Json>[]
      return (
        <div>
          <Label field={field} />
          <div className="grid gap-3">
            {items.map((item, i) => {
              const summary = field.summaryField ? String(item?.[field.summaryField] ?? "") : ""
              return (
                <details key={i} className="group rounded-lg border border-line bg-paper">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3.5 py-3 [&::-webkit-details-marker]:hidden">
                    <span className="min-w-0 truncate text-sm font-bold">
                      <span className="mr-2 font-display text-ink-soft">{String(i + 1).padStart(2, "0")}</span>
                      {summary || field.itemLabel}
                    </span>
                    <span className="flex shrink-0 gap-1" onClick={(e) => e.preventDefault()}>
                      <SmallButton onClick={() => set(move(items, i, i - 1))} disabled={i === 0}>
                        ↑
                      </SmallButton>
                      <SmallButton onClick={() => set(move(items, i, i + 1))} disabled={i === items.length - 1}>
                        ↓
                      </SmallButton>
                      <SmallButton tone="danger" onClick={() => set(items.filter((_, j) => j !== i))}>
                        삭제
                      </SmallButton>
                    </span>
                  </summary>
                  <div className="grid gap-4 border-t border-line p-3.5">
                    {field.fields.map((f, k) => (
                      <Field key={("name" in f && f.name) || k} field={f} value={value} onChange={onChange} path={[...fieldPath, i]} />
                    ))}
                  </div>
                </details>
              )
            })}
            <div>
              <SmallButton onClick={() => set([...items, emptyValue(field.fields)])}>+ {field.itemLabel} 추가</SmallButton>
            </div>
          </div>
        </div>
      )
    }
  }
}

export function SchemaForm({
  fields,
  initial,
  action,
  redirectBase,
  submitLabel = "저장",
}: {
  fields: FieldDef[]
  initial: Record<string, Json>
  action: (value: Record<string, Json>) => Promise<SaveResult>
  /** 새로 만들기 화면: 저장 후 `${redirectBase}/${id}`로 이동 */
  redirectBase?: string
  submitLabel?: string
}) {
  const router = useRouter()
  const [value, setValue] = useState<Record<string, Json>>(initial)
  const [saved, setSaved] = useState(() => JSON.stringify(initial))
  const [status, setStatus] = useState<{ tone: "ok" | "error"; text: string } | null>(null)
  const [pending, startTransition] = useTransition()
  const dirty = useMemo(() => JSON.stringify(value) !== saved, [value, saved])

  // 새로 만든 뒤 편집 화면으로 넘어오면 저장 완료 문구를 이어서 보여준다
  useEffect(() => {
    try {
      const flash = sessionStorage.getItem(FLASH_KEY)
      if (flash) {
        sessionStorage.removeItem(FLASH_KEY)
        setStatus({ tone: "ok", text: flash })
      }
    } catch {}
  }, [])

  useEffect(() => {
    if (!dirty) return
    const warn = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener("beforeunload", warn)
    return () => window.removeEventListener("beforeunload", warn)
  }, [dirty])

  const onChange = (path: Path, v: Json) => setValue((prev) => setAt(prev, path, v) as Record<string, Json>)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setStatus(null)
    startTransition(async () => {
      try {
        const result = await action(value)
        if (!result.ok) {
          setStatus({ tone: "error", text: result.error })
          return
        }
        const text = result.message ?? "저장했습니다. 사이트에 바로 반영됩니다."
        setSaved(JSON.stringify(value))
        setStatus({ tone: "ok", text })
        if (redirectBase && result.id) {
          try {
            sessionStorage.setItem(FLASH_KEY, text)
          } catch {}
          router.replace(`${redirectBase}/${result.id}`)
        }
        router.refresh()
      } catch (error) {
        setStatus({ tone: "error", text: error instanceof Error ? error.message : "저장하지 못했습니다." })
      }
    })
  }

  return (
    <form onSubmit={submit} className="grid gap-4 pb-28">
      {fields.map((f, i) => (
        <Field key={("name" in f && f.name) || i} field={f} value={value} onChange={onChange} path={[]} />
      ))}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 px-4 py-3 backdrop-blur md:left-64">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3">
          <p
            role="status"
            className={`text-sm font-semibold ${status?.tone === "error" ? "text-red-700" : status ? "text-emerald-700" : "text-ink-soft"}`}
          >
            {status?.text ?? (dirty ? "저장하지 않은 변경 사항이 있습니다." : "변경 사항 없음")}
          </p>
          <button
            type="submit"
            disabled={pending}
            className="btn btn-coral min-h-11 px-5 py-2 text-[15px] disabled:cursor-wait disabled:opacity-60"
          >
            {pending ? "저장 중…" : submitLabel}
          </button>
        </div>
      </div>
    </form>
  )
}
