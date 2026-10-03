import { NextResponse, type NextRequest } from "next/server"

// 관리자 화면 진입 전 세션 쿠키가 있는지만 빠르게 본다.
// 실제 권한 확인은 서버 컴포넌트·액션에서 DB 세션으로 한다(lib/auth/session.ts).
const PUBLIC_ADMIN_PATHS = ["/admin/login", "/admin/setup"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (PUBLIC_ADMIN_PATHS.some((p) => pathname.startsWith(p))) return NextResponse.next()
  if (!request.cookies.has("wf_admin")) {
    if (pathname.startsWith("/api/")) return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 })
    const url = request.nextUrl.clone()
    url.pathname = "/admin/login"
    url.search = ""
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
}
