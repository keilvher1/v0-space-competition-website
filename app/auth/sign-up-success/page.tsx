import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Rocket, Mail } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-background space-pattern flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <Rocket className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-glow">제1회 우주 최고 실패 대회</span>
          </Link>
        </div>

        <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">회원가입 완료!</CardTitle>
            <CardDescription>이메일을 확인해주세요</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-6">
              가입하신 이메일로 인증 링크를 발송했습니다. 이메일을 확인하여 계정을 활성화해주세요.
            </p>
            <Button asChild className="neon-glow">
              <Link href="/auth/login">로그인 페이지로</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
