// 동영상 업로드·재생 공통 규칙(서버·브라우저 함께 씀)

export const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"] as const
export const VIDEO_MAX_BYTES = 500 * 1024 * 1024

/** 업로드한 동영상 파일 주소인지(Vimeo·YouTube 같은 외부 플레이어가 아닌지) */
export function isDirectVideo(url: string | null | undefined) {
  if (!url) return false
  try {
    const u = new URL(url, "https://www.woojufail.org")
    return u.hostname.endsWith(".blob.vercel-storage.com") || /\.(mp4|webm|mov|m4v)$/i.test(u.pathname)
  } catch {
    return false
  }
}
