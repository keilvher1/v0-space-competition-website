import type { Edition } from "./types"
import { safeHref } from "./utils"

/** 회차 페이지 주소: 외부 사이트로 운영하는 회차(예: /2026 정적 사이트)는 그 주소, 아니면 /연도 */
export function editionHref(edition: Edition) {
  return (edition.pageMode === "external" && safeHref(edition.externalUrl)) || `/${edition.slug}`
}
