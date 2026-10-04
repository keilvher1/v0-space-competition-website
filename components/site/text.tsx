import { Fragment } from "react"

const URL_RE = /(https?:\/\/[^\s<]+[^\s<.,;:!?)\]'"’”])/g

/** 텍스트 속 http(s) 주소를 링크로 바꾼다. HTML은 해석하지 않는다. */
function Linkify({ text }: { text: string }) {
  const parts = text.split(URL_RE)
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="break-all underline underline-offset-4">
            {part}
          </a>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  )
}

/** 관리자 입력의 줄바꿈(\n)을 <br />로 보여준다 */
export function Multiline({ text, linkify = false }: { text: string; linkify?: boolean }) {
  const lines = text.split("\n")
  return (
    <>
      {lines.map((line, i) => (
        <Fragment key={i}>
          {linkify ? <Linkify text={line} /> : line}
          {i < lines.length - 1 && <br />}
        </Fragment>
      ))}
    </>
  )
}

/** text 안의 highlight 부분(처음 한 곳)만 className으로 감싼다 */
export function WithHighlight({ text, highlight, className }: { text: string; highlight: string; className: string }) {
  const at = highlight ? text.indexOf(highlight) : -1
  if (at < 0) return <>{text}</>
  return (
    <>
      {text.slice(0, at)}
      <span className={className}>{highlight}</span>
      {text.slice(at + highlight.length)}
    </>
  )
}

/** 빈 줄로 나눈 문단 */
export function Paragraphs({ text, className, linkify = false }: { text: string; className?: string; linkify?: boolean }) {
  return (
    <>
      {text
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean)
        .map((p, i) => (
          <p key={i} className={className}>
            <Multiline text={p} linkify={linkify} />
          </p>
        ))}
    </>
  )
}
