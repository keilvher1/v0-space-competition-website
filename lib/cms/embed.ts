/** 관리자가 넣은 영상 주소(Vimeo·YouTube)를 iframe용 주소로 바꾼다. 지원하지 않으면 null */
export function videoEmbedUrl(input: string): string | null {
  let url: URL
  try {
    url = new URL(input.trim())
  } catch {
    return null
  }
  if (url.protocol !== "https:") return null
  const host = url.hostname.replace(/^www\./, "")

  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const id = url.pathname.match(/(\d{6,})/)?.[1]
    if (!id) return null
    const hash = url.searchParams.get("h")
    return `https://player.vimeo.com/video/${id}?${hash ? `h=${hash}&` : ""}title=0&byline=0&portrait=0&badge=0&dnt=1`
  }
  if (host === "youtu.be" || host === "youtube.com" || host === "m.youtube.com") {
    const id =
      host === "youtu.be"
        ? url.pathname.slice(1)
        : url.searchParams.get("v") ?? url.pathname.match(/\/(?:shorts|embed|live)\/([\w-]{6,})/)?.[1]
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : null
  }
  return null
}

/**
 * 영상 썸네일 주소(누르기 전 미리보기용). Vimeo는 공개 oEmbed로 받아 하루 캐시하고, YouTube는 정해진 주소를 쓴다.
 * 받을 수 없으면 null — 그때는 어두운 바탕에 재생 버튼만 보여준다.
 */
export async function videoThumbnail(input: string): Promise<string | null> {
  let url: URL
  try {
    url = new URL(input.trim())
  } catch {
    return null
  }
  const host = url.hostname.replace(/^www\./, "")
  if (host === "youtu.be" || host === "youtube.com" || host === "m.youtube.com") {
    const id =
      host === "youtu.be"
        ? url.pathname.slice(1)
        : url.searchParams.get("v") ?? url.pathname.match(/\/(?:shorts|embed|live)\/([\w-]{6,})/)?.[1]
    return id && /^[\w-]+$/.test(id) ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null
  }
  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const id = url.pathname.match(/(\d{6,})/)?.[1]
    if (!id) return null
    const hash = url.searchParams.get("h")
    const page = `https://vimeo.com/${id}${hash ? `/${hash}` : ""}`
    try {
      const res = await fetch(`https://vimeo.com/api/oembed.json?url=${encodeURIComponent(page)}&width=720`, {
        next: { revalidate: 86400 },
      })
      if (!res.ok) return null
      const data = (await res.json()) as { thumbnail_url?: unknown }
      return typeof data.thumbnail_url === "string" && data.thumbnail_url.startsWith("https://") ? data.thumbnail_url : null
    } catch {
      return null
    }
  }
  return null
}
