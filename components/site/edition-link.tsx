import type React from "react"
import Link from "next/link"
import { editionHref } from "@/lib/cms/links"
import type { Edition } from "@/lib/cms/types"

/**
 * 회차 페이지 링크. 별도 사이트로 운영하는 회차(예: /2026 정적 사이트)는 Next 라우터가 미리 불러올 수 없어
 * 404 요청만 생기므로 일반 링크로 연다.
 */
export function EditionLink({
  edition,
  hash = "",
  ...props
}: { edition: Edition; hash?: string } & Omit<React.ComponentPropsWithoutRef<"a">, "href">) {
  const href = `${editionHref(edition)}${hash}`
  return edition.pageMode === "external" ? <a href={href} {...props} /> : <Link href={href} {...props} />
}
