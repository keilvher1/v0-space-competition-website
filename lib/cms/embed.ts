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
