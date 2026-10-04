import Link from "next/link"
import { AuthForm } from "@/components/admin/auth-form"
import { AuthShell } from "@/components/admin/auth-shell"
import { adminCount, setupMode } from "@/lib/auth/session"
import { setupAction } from "../actions"

export const metadata = { title: "관리자 만들기" }

const ACCOUNT_FIELDS = [
  { name: "name", label: "이름", type: "text", autoComplete: "name" },
  { name: "email", label: "이메일", type: "email", autoComplete: "username" },
  { name: "password", label: "비밀번호", type: "password", autoComplete: "new-password", help: "10자 이상" },
]

export default async function SetupPage() {
  const mode = await setupMode()

  if (!mode) {
    const exists = (await adminCount()) > 0
    return (
      <AuthShell
        title="관리자 만들기"
        description={
          exists
            ? "이미 관리자가 있습니다. 새 관리자는 기존 관리자가 [관리자 계정] 메뉴에서 추가할 수 있습니다. 모든 관리자가 비밀번호를 잊었다면 Vercel 환경변수 ADMIN_SETUP_TOKEN을 설정한 뒤 이 화면에서 다시 정할 수 있습니다."
            : "보안을 위해 첫 관리자는 운영 주소가 아닌 Vercel 프리뷰 주소(Vercel 로그인으로 보호됨)에서 만들거나, Vercel 환경변수 ADMIN_SETUP_TOKEN을 설정한 뒤 만들 수 있습니다."
        }
      >
        <Link href="/admin/login" className="btn btn-ink justify-center">
          로그인 화면으로
        </Link>
      </AuthShell>
    )
  }

  if (mode === "token") {
    return (
      <AuthShell
        title="관리자 만들기·비밀번호 다시 정하기"
        description="Vercel 환경변수 ADMIN_SETUP_TOKEN 값을 입력하세요. 이미 있는 이메일을 입력하면 그 계정의 비밀번호를 새로 정하고 잠금을 풉니다. 다 쓰고 나면 환경변수를 꼭 지워주세요."
      >
        <AuthForm
          submitLabel="저장하고 시작하기"
          action={setupAction}
          fields={[{ name: "token", label: "설정 토큰", type: "password", autoComplete: "off" }, ...ACCOUNT_FIELDS]}
        />
      </AuthShell>
    )
  }

  return (
    <AuthShell title="첫 관리자 만들기" description="관리자 계정이 아직 없습니다. 이 계정으로 사이트 내용을 편집하고 다른 관리자를 추가할 수 있습니다.">
      <AuthForm submitLabel="관리자 만들고 시작하기" action={setupAction} fields={ACCOUNT_FIELDS} />
    </AuthShell>
  )
}
