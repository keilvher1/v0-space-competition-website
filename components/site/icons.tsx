// 제2회 핸드오프와 같은 선 굵기의 화살표 아이콘
type IconProps = { className?: string }

const strokeProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const

export function ArrowRight({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...strokeProps}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

export function ArrowUpRight({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...strokeProps}>
      <path d="M6 18 18 6M6 6h12v12" />
    </svg>
  )
}

export function ArrowDown({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...strokeProps}>
      <path d="M12 4v16M6 14l6 6 6-6" />
    </svg>
  )
}

export function Sparkle({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M12 2c.6 4.6 2.4 6.9 7 7.6v.8c-4.6.7-6.4 3-7 7.6h-.8c-.6-4.6-2.4-6.9-7-7.6v-.8c4.6-.7 6.4-3 7-7.6h.8Z" />
    </svg>
  )
}
