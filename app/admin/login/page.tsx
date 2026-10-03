import Link from "next/link"
import { redirect } from "next/navigation"
import { AuthForm } from "@/components/admin/auth-form"
import { AuthShell } from "@/components/admin/auth-shell"
import { getCurrentAdmin, setupMode } from "@/lib/auth/session"
import { loginAction } from "../actions"

export const metadata = { title: "로그인" }

export default async function LoginPage() {
  if (await getCurrentAdmin()) redirect("/admin")
  const mode = await setupMode()

  return (
    <AuthShell title="관리자 로그인" description="사이트 내용을 편집하려면 관리자 계정으로 로그인하세요.">
      <AuthForm
        submitLabel="로그인"
        action={loginAction}
        fields={[
          { name: "email", label: "이메일", type: "email", autoComplete: "username" },
          { name: "password", label: "비밀번호", type: "password", autoComplete: "current-password" },
        ]}
      />
      {mode && (
        <p className="mt-6 rounded-md border border-line bg-cream px-3 py-2.5 text-sm">
          {mode === "first" ? "아직 관리자가 없습니다." : "설정 토큰이 켜져 있습니다."}{" "}
          <Link href="/admin/setup" className="font-bold underline underline-offset-4">
            {mode === "first" ? "첫 관리자 만들기" : "관리자 만들기·비밀번호 다시 정하기"}
          </Link>
        </p>
      )}
    </AuthShell>
  )
}
