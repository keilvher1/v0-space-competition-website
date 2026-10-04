import type React from "react"
import { IntroControls } from "./intro-controls"

const WORD = "우주최고실패대회"
const FAIL_INDEX = new Set([4, 5]) // '실', '패'

// 세션에서 이미 봤다면 HTML 파싱 단계에서 바로 숨긴다(깜빡임 방지).
// sessionStorage를 쓸 수 없는 환경에서도 숨긴다.
const SEEN_SCRIPT = `(function(){try{var k='wf-intro-seen';if(sessionStorage.getItem(k)){document.documentElement.classList.add('wf-no-intro')}else{sessionStorage.setItem(k,'1')}}catch(e){document.documentElement.classList.add('wf-no-intro')}})()`

// 첫 방문 인트로. 애니메이션과 사라짐은 CSS만으로 동작하고(JS가 없어도 2.3초 뒤 걷힌다),
// 건너뛰기·ESC 처리와 끝난 뒤 정리만 클라이언트 컴포넌트가 맡는다.
// 모든 움직임은 transform·opacity라 GPU에서 돌아간다(첫 진입 때 메인 스레드가 바빠도 끊기지 않게).
export function IntroSplash({ tagline, keyColor }: { tagline: string; keyColor: string }) {
  const style = { "--intro-key": keyColor } as React.CSSProperties
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: SEEN_SCRIPT }} />
      <div className="wf-intro" style={style} aria-hidden="true">
        <div className="wf-intro-stars" />
        <div className="wf-intro-stage">
          {/* 움직이는 부분을 HTML 층으로 나눠 GPU(합성)에서만 움직이게 한다. 로딩 중 메인 스레드가 바빠도 끊기지 않는다 */}
          <div className="wf-intro-planet">
            <span className="wf-p-orbit">
              <svg viewBox="0 0 240 240">
                <circle cx="120" cy="22" r="10" fill="var(--coral)" stroke="var(--cream)" strokeWidth="3" />
              </svg>
            </span>
            <span className="wf-p-globe">
              <svg viewBox="0 0 240 240">
                <circle cx="120" cy="120" r="64" fill="var(--intro-key)" stroke="var(--cream)" strokeWidth="4" />
              </svg>
            </span>
            <span className="wf-p-ring">
              <svg viewBox="0 0 240 240">
                <ellipse cx="120" cy="120" rx="104" ry="28" fill="none" stroke="var(--cream)" strokeWidth="4" transform="rotate(-16 120 120)" />
              </svg>
            </span>
            <span className="wf-p-star">
              <svg viewBox="0 0 240 240">
                <path
                  d="m120 84 8.6 22 23.4 2.2-17.8 15 5.6 22.4-19.8-12.2-19.8 12.2 5.6-22.4-17.8-15 23.4-2.2Z"
                  fill="var(--cream)"
                  stroke="var(--ink)"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
          <p className="wf-intro-word">
            {[...WORD].map((ch, i) => (
              <span
                key={i}
                className={FAIL_INDEX.has(i) ? "wf-intro-fail" : undefined}
                style={{ "--i": i } as React.CSSProperties}
              >
                {/* 떠오르기와 흔들림을 다른 요소에 나눠야 둘 다 GPU 합성으로 돈다 */}
                {FAIL_INDEX.has(i) ? <span className="wf-intro-wobble">{ch}</span> : ch}
              </span>
            ))}
          </p>
          <p className="wf-intro-tagline">{tagline}</p>
          <div className="wf-intro-bar">
            <span />
          </div>
        </div>
        <IntroControls />
      </div>
    </>
  )
}
