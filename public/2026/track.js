// 방문 통계(메인 사이트 CMS의 '방문 통계'에 모인다). 쿠키를 쓰지 않는다.
(() => {
  const send = (hit) => {
    try {
      const body = JSON.stringify(hit)
      if (navigator.sendBeacon && navigator.sendBeacon('/api/collect', new Blob([body], { type: 'application/json' }))) return
      fetch('/api/collect', { method: 'POST', body, keepalive: true, headers: { 'content-type': 'application/json' } }).catch(() => {})
    } catch (e) {}
  }
  // 메인 사이트에서 넘어온 경우는 사이트 안 이동이라 유입 경로로 세지 않는다
  let internal = false
  try { internal = new URL(document.referrer).host === location.host } catch (e) {}
  send({
    kind: 'view',
    path: location.pathname,
    entry: !internal,
    ref: internal ? '' : document.referrer,
    src: internal ? '' : new URLSearchParams(location.search).get('utm_source') || '',
  })
  // 신청 버튼(참가·참관)과 외부 링크 클릭
  document.addEventListener('click', (e) => {
    const a = e.target instanceof Element ? e.target.closest('a[href]') : null
    if (!a) return
    let url
    try { url = new URL(a.href, location.href) } catch (err) { return }
    if (url.origin === location.origin) return
    const form = /forms\.gle|docs\.google\.com\/forms/.test(url.href)
    const role = a.closest('[data-registration]')
    send({
      kind: 'event',
      name: form ? 'apply' : 'outbound',
      label: form && role ? role.getAttribute('data-registration') : url.hostname.replace(/^www\./, ''),
      path: location.pathname,
    })
  }, { capture: true })
})()
