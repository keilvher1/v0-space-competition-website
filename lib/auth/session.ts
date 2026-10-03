import { createHash, randomBytes, timingSafeEqual } from "node:crypto"
import { cookies } from "next/headers"
import { cache } from "react"
import { redirect } from "next/navigation"
import { query } from "@/lib/db"
import { hashPassword, verifyPassword } from "./password"

export const SESSION_COOKIE = "wf_admin"
const SESSION_DAYS = 14
const MAX_ATTEMPTS = 5
const LOCK_MINUTES = 10

export interface AdminUser {
  id: string
  email: string
  name: string
}

const sha256 = (value: string) => createHash("sha256").update(value).digest("hex")

export async function createSession(adminId: string) {
  const token = randomBytes(32).toString("base64url")
  await query(
    `insert into cms_sessions (token_hash, admin_id, expires_at) values ($1, $2, now() + interval '${SESSION_DAYS} days')`,
    [sha256(token), adminId],
  )
  const jar = await cookies()
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  })
}

/** 요청 하나 안에서는 세션 조회를 한 번만 한다(레이아웃·페이지·데이터 조회가 각각 확인함) */
export const getCurrentAdmin = cache(async (): Promise<AdminUser | null> => {
  const jar = await cookies()
  const token = jar.get(SESSION_COOKIE)?.value
  if (!token) return null
  const rows = await query<{ id: string; email: string; name: string }>(
    `select a.id, a.email, a.name from cms_sessions s join cms_admins a on a.id = s.admin_id
     where s.token_hash = $1 and s.expires_at > now()`,
    [sha256(token)],
  )
  return rows[0] ?? null
})

/** 서버 컴포넌트용: 로그인하지 않았으면 로그인 화면으로 보낸다 */
export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getCurrentAdmin()
  if (!admin) redirect("/admin/login")
  return admin
}

/** 서버 액션용: 로그인하지 않았으면 예외 */
export async function assertAdmin(): Promise<AdminUser> {
  const admin = await getCurrentAdmin()
  if (!admin) throw new Error("로그인이 필요합니다. 다시 로그인해주세요.")
  return admin
}

export async function destroySession() {
  const jar = await cookies()
  const token = jar.get(SESSION_COOKIE)?.value
  if (token) await query(`delete from cms_sessions where token_hash = $1`, [sha256(token)])
  jar.delete(SESSION_COOKIE)
}

export type LoginResult = { ok: true } | { ok: false; error: string }

export async function attemptLogin(email: string, password: string): Promise<LoginResult> {
  const rows = await query<{ id: string; password_hash: string; locked: boolean }>(
    `select id, password_hash, coalesce(locked_until > now(), false) as locked from cms_admins where lower(email) = lower($1)`,
    [email.trim()],
  )
  const user = rows[0]
  // 계정이 있는지, 잠겼는지 드러나지 않도록 실패 문구는 하나로 통일한다
  const generic = {
    ok: false as const,
    error: `이메일 또는 비밀번호가 올바르지 않습니다. ${MAX_ATTEMPTS}번 틀리면 ${LOCK_MINUTES}분 동안 로그인할 수 없습니다.`,
  }
  if (!user) {
    await hashPassword(password) // 존재하지 않는 계정도 응답 시간을 비슷하게 맞춘다
    return generic
  }
  const valid = await verifyPassword(password, user.password_hash)
  if (user.locked) return generic
  if (!valid) {
    // 동시에 여러 번 틀려도 잠금이 풀리지 않도록 한 번의 UPDATE로 계산한다(행 잠금으로 순서대로 적용됨)
    await query(
      `update cms_admins set
         failed_attempts = case
           when locked_until > now() then failed_attempts
           when locked_until is not null then 1
           else failed_attempts + 1 end,
         locked_until = case
           when locked_until > now() then locked_until
           when (case when locked_until is not null then 1 else failed_attempts + 1 end) >= ${MAX_ATTEMPTS}
             then now() + interval '${LOCK_MINUTES} minutes'
           else null end
       where id = $1`,
      [user.id],
    )
    return generic
  }
  // 비밀번호가 맞아도 그 사이 다른 시도로 잠겼다면 들여보내지 않는다
  const unlocked = await query(
    `update cms_admins set failed_attempts = 0, locked_until = null, last_login_at = now()
     where id = $1 and (locked_until is null or locked_until <= now()) returning id`,
    [user.id],
  )
  if (!unlocked[0]) return generic
  await query(`delete from cms_sessions where expires_at < now()`)
  await createSession(user.id)
  return { ok: true }
}

/** 비밀번호를 바꾼 뒤 다른 기기의 로그인을 끊는다(지금 쓰는 세션은 유지) */
export async function revokeOtherSessions(adminId: string) {
  const token = (await cookies()).get(SESSION_COOKIE)?.value ?? ""
  await query(`delete from cms_sessions where admin_id = $1 and token_hash <> $2`, [adminId, sha256(token)])
}

export async function adminCount() {
  const rows = await query<{ n: string }>(`select count(*) as n from cms_admins`)
  return Number(rows[0].n)
}

/**
 * 관리자 만들기 화면(/admin/setup)을 쓸 수 있는 경우
 * - first: 관리자가 한 명도 없고 운영 배포가 아닐 때(Vercel 로그인으로 보호된 프리뷰·로컬)
 * - token: ADMIN_SETUP_TOKEN 환경변수가 있을 때(비상용). 환경과 관계없이 토큰을 아는 사람만
 *   관리자를 만들거나 기존 계정의 비밀번호를 다시 정할 수 있다. 쓰고 나면 환경변수를 지운다.
 */
export async function setupMode(): Promise<"first" | "token" | null> {
  if (setupToken()) return "token"
  if (process.env.VERCEL_ENV !== "production" && (await adminCount()) === 0) return "first"
  return null
}

function setupToken() {
  const token = process.env.ADMIN_SETUP_TOKEN?.trim() ?? ""
  return token.length >= 16 ? token : null
}

export function checkSetupToken(input: string) {
  const expected = setupToken()
  if (!expected) return false
  return timingSafeEqual(createHash("sha256").update(input.trim()).digest(), createHash("sha256").update(expected).digest())
}
