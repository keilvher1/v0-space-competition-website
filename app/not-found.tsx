import Link from "next/link"
import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"
import { ArrowRight } from "@/components/site/icons"

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="starfield on-dark border-b-2 border-ink bg-ink text-cream">
        <div className="site-container py-24 md:py-32">
          <p className="eyebrow text-cream/70">404 · Lost in space</p>
          <h1 className="mt-6 text-[clamp(3rem,9vw,7.5rem)] leading-[1.05] font-black tracking-[-0.045em]">
            이 페이지는
            <br />
            <span className="lettering-shadow">실패</span>했어요.
          </h1>
          <p className="mt-8 max-w-[34ch] text-xl leading-relaxed font-semibold">
            주소가 바뀌었거나 사라진 페이지입니다. 그래도 괜찮아요, 처음부터 다시 둘러보세요.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/" className="btn btn-coral">
              처음으로 <ArrowRight />
            </Link>
            <Link href="/#archive" className="btn btn-ink">
              역대 대회 보기 <ArrowRight />
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
