import type React from "react"
import { cn } from "@/lib/utils"

// 같은 묶음을 두 번 이어 붙여 끊김 없이 흐르게 한다. 두 번째 묶음은 보조기기에서 숨긴다.
export function Marquee({
  children,
  className,
  duration = "40s",
  label,
}: {
  children: React.ReactNode
  className?: string
  duration?: string
  /** 의미 있는 내용(로고 등)이면 지역 이름을 준다. 없으면 장식으로 보고 전체를 숨긴다 */
  label?: string
}) {
  const style = { "--marquee-duration": duration } as React.CSSProperties
  return (
    <div
      className={cn("marquee", className)}
      style={style}
      {...(label ? { role: "region", "aria-label": label } : { "aria-hidden": true })}
    >
      <div className="marquee-track">
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  )
}
