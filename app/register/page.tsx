"use client"

import type React from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Rocket, ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import type { User } from "@supabase/supabase-js"

export default function RegisterPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    teamName: "",
    track: "",
    notes: "",
  })
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login?redirect=/register")
        return
      }
      setUser(user)

      const { data: existingReg } = await supabase.from("registrations").select("id").eq("user_id", user.id).single()

      if (existingReg) {
        router.push("/my-registrations")
      }
    }
    getUser()
  }, [supabase, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsLoading(true)
    setError(null)

    try {
      const { data: competition } = await supabase.from("competitions").select("id").eq("status", "open").single()

      if (!competition) {
        throw new Error("현재 참가 가능한 대회가 없습니다.")
      }

      const { error: insertError } = await supabase.from("registrations").insert({
        user_id: user.id,
        competition_id: competition.id,
        team_name: formData.teamName,
        notes: formData.notes,
        status: "pending",
        team_members: { track: formData.track },
      })

      if (insertError) throw insertError

      setIsSubmitted(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "신청 중 오류가 발생했습니다")
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background space-pattern flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background space-pattern flex items-center justify-center p-6">
        <Card className="w-full max-w-md bg-card/50 backdrop-blur-sm border-primary/20">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <CardTitle className="text-2xl">참가 신청 완료!</CardTitle>
            <CardDescription>참가 신청이 성공적으로 완료되었습니다</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-6">
              신청 내역은 &apos;내 참가 신청&apos; 페이지에서 확인할 수 있습니다.
            </p>
            <div className="flex flex-col gap-2">
              <Button asChild className="neon-glow">
                <Link href="/my-registrations">내 참가 신청 확인</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">홈으로 돌아가기</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background space-pattern">
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Rocket className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-glow">우주 최고 실패 대회</span>
            </Link>
            <Button variant="ghost" asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                돌아가기
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 text-glow">참가 신청</h1>
            <p className="text-muted-foreground">당신의 실패 스토리를 우주에 알려주세요!</p>
          </div>

          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle>신청 정보 입력</CardTitle>
              <CardDescription>아래 정보를 입력해주세요</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">이메일</Label>
                  <Input id="email" type="email" value={user.email || ""} disabled className="bg-muted/50" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">이름</Label>
                  <Input
                    id="name"
                    type="text"
                    value={user.user_metadata?.full_name || ""}
                    disabled
                    className="bg-muted/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="teamName">실패 스토리 제목</Label>
                  <Input
                    id="teamName"
                    type="text"
                    placeholder="예: 나의 첫 사업 실패기"
                    required
                    value={formData.teamName}
                    onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="track">참가 트랙</Label>
                  <Select
                    value={formData.track}
                    onValueChange={(value) => setFormData({ ...formData, track: value })}
                    required
                  >
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="트랙을 선택해주세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="youth">청소년 트랙 (만 18세까지)</SelectItem>
                      <SelectItem value="general">일반 트랙 (만 19세부터)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">실패 스토리 요약</Label>
                  <Textarea
                    id="notes"
                    placeholder="간단히 실패 경험을 요약해주세요 (선택사항)"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="bg-background/50 min-h-[120px]"
                  />
                </div>

                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-sm text-red-500">{error}</p>
                  </div>
                )}

                <Button type="submit" className="w-full neon-glow" disabled={isLoading}>
                  {isLoading ? "신청 중..." : "참가 신청하기"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
