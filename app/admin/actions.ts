"use server"

import { del } from "@vercel/blob"
import { revalidatePath, revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import type { SaveResult } from "@/components/admin/form-types"
import { hashPassword, verifyPassword } from "@/lib/auth/password"
import {
  assertAdmin,
  attemptLogin,
  checkSetupToken,
  createSession,
  destroySession,
  revokeOtherSessions,
  setupMode,
} from "@/lib/auth/session"
import { DEFAULT_SETTINGS } from "@/lib/cms/defaults"
import { CMS_TAG, admin as adminQueries } from "@/lib/cms/queries"
import { normalizeEditionData, normalizeHex, normalizeWith, safeHref } from "@/lib/cms/utils"
import { blobConfigured } from "@/lib/blob"
import { query } from "@/lib/db"

// ── 공통 ────────────────────────────────────────────────

type Input = Record<string, unknown>

const str = (v: unknown, max = 5000) => (typeof v === "string" ? v.trim().slice(0, max) : "")
const bool = (v: unknown) => v === true || v === "true" || v === "on"
const int = (v: unknown) => {
  const n = Number(v)
  return Number.isFinite(n) ? Math.trunc(n) : NaN
}
const isoOrNull = (v: unknown) => {
  const s = str(v, 64)
  return s && Number.isFinite(Date.parse(s)) ? s : null
}
const safeLink = (v: unknown) => safeHref(str(v, 2000)) ?? ""

/** 내용 안의 주소 칸(url, …Url, ogImage)을 모두 안전한 주소만 남긴다. javascript: 같은 값은 비운다. */
function cleanUrls<T>(value: T): T {
  if (Array.isArray(value)) return value.map(cleanUrls) as T
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, v]) => [key, typeof v === "string" && /^(url|.+Url|ogImage)$/.test(key) ? safeLink(v) : cleanUrls(v)]),
    ) as T
  }
  return value
}

function refreshSite() {
  revalidateTag(CMS_TAG)
  revalidatePath("/", "layout")
}

async function run(fn: () => Promise<SaveResult>): Promise<SaveResult> {
  try {
    await assertAdmin()
    return await fn()
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    if (/duplicate key/.test(message)) return { ok: false, error: "이미 같은 값(회차 번호·주소 등)을 쓰는 항목이 있습니다." }
    return { ok: false, error: message }
  }
}

// ── 로그인 ──────────────────────────────────────────────

export async function loginAction(input: Input) {
  const result = await attemptLogin(str(input.email, 200), String(input.password ?? ""))
  if (!result.ok) return result
  redirect("/admin")
}

export async function setupAction(input: Input) {
  const mode = await setupMode()
  if (!mode) return { ok: false as const, error: "관리자 만들기를 할 수 없는 상태입니다." }
  if (mode === "token" && !checkSetupToken(String(input.token ?? ""))) return { ok: false as const, error: "설정 토큰이 맞지 않습니다." }
  const email = str(input.email, 200).toLowerCase()
  const password = String(input.password ?? "")
  if (!/^\S+@\S+\.\S+$/.test(email)) return { ok: false as const, error: "이메일을 확인해주세요." }
  if (password.length < 10) return { ok: false as const, error: "비밀번호는 10자 이상으로 정해주세요." }
  // 토큰 모드에서 이미 있는 이메일이면 비밀번호를 다시 정하고 잠금을 푼다
  const rows = await query<{ id: string }>(
    `insert into cms_admins (email, name, password_hash, last_login_at) values ($1, $2, $3, now())
     on conflict (email) do update set password_hash = excluded.password_hash, failed_attempts = 0, locked_until = null,
       last_login_at = now(),
       name = case when excluded.name = '' then cms_admins.name else excluded.name end
     returning id`,
    [email, str(input.name, 100), await hashPassword(password)],
  )
  await query(`delete from cms_sessions where admin_id = $1`, [rows[0].id]) // 비밀번호를 다시 정했으면 기존 로그인은 모두 끊는다
  await createSession(rows[0].id)
  redirect("/admin")
}

export async function logoutAction() {
  await destroySession()
  redirect("/admin/login")
}

// ── 사이트 설정 ─────────────────────────────────────────

export async function saveSettings(value: Input): Promise<SaveResult> {
  return run(async () => {
    const settings = cleanUrls(normalizeWith(DEFAULT_SETTINGS, value))
    settings.contact.email = str(settings.contact.email, 200)
    await query(
      `insert into cms_settings (key, value, updated_at) values ('site', $1, now())
       on conflict (key) do update set value = excluded.value, updated_at = now()`,
      [JSON.stringify(settings)],
    )
    refreshSite()
    return { ok: true }
  })
}

// ── 회차 ────────────────────────────────────────────────

const RESERVED_SLUGS = new Set(["admin", "api", "faq", "announcements", "images", "2026", "competitions"])

export async function saveEdition(id: string | null, value: Input): Promise<SaveResult> {
  return run(async () => {
    const number = int(value.number)
    const year = int(value.year)
    const slug = str(value.slug, 40).toLowerCase() || String(year)
    const pageMode = value.pageMode === "external" ? "external" : "cms"
    const externalUrl = safeLink(value.externalUrl)
    if (!(number > 0)) return { ok: false, error: "회차 번호를 1 이상의 숫자로 입력해주세요." }
    if (!(year > 2000 && year < 2200)) return { ok: false, error: "연도를 확인해주세요." }
    if (!/^[a-z0-9-]+$/.test(slug)) return { ok: false, error: "주소는 영문 소문자·숫자·하이픈(-)만 쓸 수 있습니다." }
    if (pageMode === "cms" && RESERVED_SLUGS.has(slug)) {
      return { ok: false, error: `'/${slug}'는 이미 다른 페이지가 쓰는 주소입니다. 다른 주소를 정해주세요.` }
    }
    if (pageMode === "external" && !externalUrl) return { ok: false, error: "외부 페이지 주소를 입력해주세요." }

    const data = cleanUrls(normalizeEditionData(value.data))
    data.accentColors = data.accentColors.map((c) => normalizeHex(c, "#fcedce"))
    data.awards = data.awards.map((a) => ({ ...a, color: normalizeHex(a.color, "#fcedce") }))
    const params = [number, year, slug, bool(value.published), pageMode, externalUrl, normalizeHex(str(value.keyColor, 20)), JSON.stringify(data)]

    if (id) {
      await query(
        `update cms_editions set number=$1, year=$2, slug=$3, published=$4, page_mode=$5, external_url=$6,
           key_color=$7, data=$8, updated_at=now() where id=$9`,
        [...params, id],
      )
      refreshSite()
      return { ok: true }
    }
    const rows = await query<{ id: string }>(
      `insert into cms_editions (number, year, slug, published, page_mode, external_url, key_color, data)
       values ($1,$2,$3,$4,$5,$6,$7,$8) returning id`,
      params,
    )
    refreshSite()
    return { ok: true, id: rows[0].id, message: "새 회차를 만들었습니다." }
  })
}

export async function deleteEdition(id: string): Promise<SaveResult> {
  return run(async () => {
    await query(`delete from cms_editions where id = $1`, [id])
    refreshSite()
    return { ok: true }
  })
}

// ── 공지사항 ────────────────────────────────────────────

export async function saveAnnouncement(id: string | null, value: Input): Promise<SaveResult> {
  return run(async () => {
    const title = str(value.title, 200)
    if (!title) return { ok: false, error: "제목을 입력해주세요." }
    const published = bool(value.published)
    const publishedAt = isoOrNull(value.publishedAt) ?? (published ? new Date().toISOString() : null)
    const params = [title, str(value.excerpt, 300), str(value.body, 50_000), bool(value.featured), published, publishedAt]
    if (id) {
      await query(
        `update cms_announcements set title=$1, excerpt=$2, body=$3, featured=$4, published=$5, published_at=$6, updated_at=now()
         where id=$7`,
        [...params, id],
      )
      refreshSite()
      return { ok: true }
    }
    const rows = await query<{ id: string }>(
      `insert into cms_announcements (title, excerpt, body, featured, published, published_at)
       values ($1,$2,$3,$4,$5,$6) returning id`,
      params,
    )
    refreshSite()
    return { ok: true, id: rows[0].id, message: "공지를 만들었습니다." }
  })
}

export async function deleteAnnouncement(id: string): Promise<SaveResult> {
  return run(async () => {
    await query(`delete from cms_announcements where id = $1`, [id])
    refreshSite()
    return { ok: true }
  })
}

// ── FAQ ─────────────────────────────────────────────────

export async function saveFaq(id: string | null, value: Input): Promise<SaveResult> {
  return run(async () => {
    const question = str(value.question, 300)
    const answer = str(value.answer, 5000)
    if (!question || !answer) return { ok: false, error: "질문과 답변을 모두 입력해주세요." }
    const edition = int(value.editionNumber)
    const params = [question, answer, edition > 0 ? edition : null, int(value.sort) || 0, bool(value.published)]
    if (id) {
      await query(
        `update cms_faqs set question=$1, answer=$2, edition_number=$3, sort=$4, published=$5, updated_at=now() where id=$6`,
        [...params, id],
      )
      refreshSite()
      return { ok: true }
    }
    const rows = await query<{ id: string }>(
      `insert into cms_faqs (question, answer, edition_number, sort, published) values ($1,$2,$3,$4,$5) returning id`,
      params,
    )
    refreshSite()
    return { ok: true, id: rows[0].id, message: "FAQ를 추가했습니다." }
  })
}

export async function deleteFaq(id: string): Promise<SaveResult> {
  return run(async () => {
    await query(`delete from cms_faqs where id = $1`, [id])
    refreshSite()
    return { ok: true }
  })
}

// ── 파트너 ──────────────────────────────────────────────

export async function savePartner(id: string | null, value: Input): Promise<SaveResult> {
  return run(async () => {
    const name = str(value.name, 100)
    if (!name) return { ok: false, error: "이름을 입력해주세요." }
    const editions = (Array.isArray(value.editions) ? value.editions : []).map(int).filter((n) => n > 0)
    const params = [name, safeLink(value.logoUrl), safeLink(value.linkUrl), bool(value.temporary), editions, int(value.sort) || 0, bool(value.published)]
    if (id) {
      await query(
        `update cms_partners set name=$1, logo_url=$2, link_url=$3, temporary=$4, editions=$5, sort=$6, published=$7, updated_at=now()
         where id=$8`,
        [...params, id],
      )
      refreshSite()
      return { ok: true }
    }
    const rows = await query<{ id: string }>(
      `insert into cms_partners (name, logo_url, link_url, temporary, editions, sort, published)
       values ($1,$2,$3,$4,$5,$6,$7) returning id`,
      params,
    )
    refreshSite()
    return { ok: true, id: rows[0].id, message: "파트너를 추가했습니다." }
  })
}

export async function deletePartner(id: string): Promise<SaveResult> {
  return run(async () => {
    await query(`delete from cms_partners where id = $1`, [id])
    refreshSite()
    return { ok: true }
  })
}

// ── 이미지 라이브러리 ───────────────────────────────────

export async function listMediaForPicker() {
  await assertAdmin()
  return adminQueries.media()
}

export async function deleteMedia(id: string): Promise<SaveResult> {
  return run(async () => {
    const rows = await query<{ url: string }>(`delete from cms_media where id = $1 returning url`, [id])
    if (rows[0] && blobConfigured()) await del(rows[0].url).catch(() => {})
    return { ok: true }
  })
}

// ── 관리자 계정 ─────────────────────────────────────────

export async function createAdmin(value: Input): Promise<SaveResult> {
  return run(async () => {
    const email = str(value.email, 200).toLowerCase()
    const password = String(value.password ?? "")
    if (!/^\S+@\S+\.\S+$/.test(email)) return { ok: false, error: "이메일을 확인해주세요." }
    if (password.length < 10) return { ok: false, error: "비밀번호는 10자 이상으로 정해주세요." }
    await query(`insert into cms_admins (email, name, password_hash) values ($1,$2,$3)`, [
      email,
      str(value.name, 100),
      await hashPassword(password),
    ])
    revalidatePath("/admin/users")
    return { ok: true, message: "관리자를 추가했습니다. 정한 비밀번호를 본인에게 따로 전달해주세요." }
  })
}

export async function deleteAdmin(id: string): Promise<SaveResult> {
  return run(async () => {
    const me = await assertAdmin()
    if (me.id === id) return { ok: false, error: "지금 로그인한 계정은 삭제할 수 없습니다." }
    await query(`delete from cms_admins where id = $1`, [id])
    revalidatePath("/admin/users")
    return { ok: true }
  })
}

export async function changePassword(value: Input): Promise<SaveResult> {
  return run(async () => {
    const me = await assertAdmin()
    const next = String(value.next ?? "")
    if (next.length < 10) return { ok: false, error: "새 비밀번호는 10자 이상으로 정해주세요." }
    const rows = await query<{ password_hash: string }>(`select password_hash from cms_admins where id = $1`, [me.id])
    if (!rows[0] || !(await verifyPassword(String(value.current ?? ""), rows[0].password_hash))) {
      return { ok: false, error: "현재 비밀번호가 맞지 않습니다." }
    }
    await query(`update cms_admins set password_hash = $1 where id = $2`, [await hashPassword(next), me.id])
    await revokeOtherSessions(me.id)
    return { ok: true, message: "비밀번호를 바꿨습니다. 다른 기기의 로그인은 끊었습니다." }
  })
}
