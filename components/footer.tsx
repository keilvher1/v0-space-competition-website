import { Mail, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-muted/20 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4 text-primary">우주 최고 실패 대회</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              실패를 결과가 아닌 질문으로 바꾸는 축제의 장
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 text-secondary">주최/주관</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>포항시</p>
              <p>환동해지역혁신원</p>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 text-primary">문의</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>contact@example.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>경상북도 포항시 북구 장성로 109</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 우주 최고 실패 대회. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
