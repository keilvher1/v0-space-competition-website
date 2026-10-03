import { updateSession } from "@/lib/supabase/middleware"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

// 로그인 세션이 필요한 경로에서만 실행한다. 공개 페이지는 Supabase 인증을 거치지 않는다.
export const config = {
  matcher: ["/admin/:path*", "/auth/:path*", "/my-registrations", "/register"],
}
