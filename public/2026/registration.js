const SAFE_USP = new Set(['sf_link', 'sharing', 'dialog', 'header', 'send_form']);

export function safeResponderUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'https:' || url.username || url.password || url.port || url.hash) return null;
    if (url.hostname === 'forms.gle') {
      return /^\/[A-Za-z0-9_-]{6,80}$/.test(url.pathname) && !url.search ? url.href : null;
    }
    if (url.hostname !== 'docs.google.com') return null;
    if (!/^\/forms\/d\/(?:e\/)?[A-Za-z0-9_-]{8,200}\/viewform$/.test(url.pathname)) return null;
    const seen = new Set();
    for (const [key, val] of url.searchParams) {
      if (seen.has(key)) return null;
      seen.add(key);
      if (key === 'usp' && SAFE_USP.has(val)) continue;
      if (key === 'hl' && /^[a-z]{2}(?:-[A-Z]{2})?$/.test(val)) continue;
      return null;
    }
    return url.href;
  } catch {
    return null;
  }
}

export function registrationState(config, deadline, now = Date.now()) {
  const closeAt = Date.parse(deadline);
  if (!Number.isFinite(now) || !Number.isFinite(closeAt)) {
    return { kind: 'unavailable', label: '접수 안내 확인 중', url: null,
      detail: '접수 일정을 확인하고 있습니다. 잠시 후 다시 확인해주세요.' };
  }
  if (now >= closeAt) {
    return { kind: 'closed', label: '접수 마감', url: null,
      detail: '안내된 접수 마감 시간이 지났습니다. 이후 안내는 주최 측 공지를 확인해주세요.' };
  }
  if (config?.status === 'announced') {
    const url = config.announcementLinkConfirmed === true ? safeResponderUrl(config.responderUrl) : null;
    if (!url) return { kind: 'unavailable', label: '신청 안내 확인 중', url: null,
      detail: '공고의 신청 주소를 확인하고 있습니다.' };
    return { kind: 'announced', label: config.actionLabel || '신청서 열기', url,
      detail: '공식 공고에 안내된 Google Forms가 새 창에서 열립니다. 실제 접수 상태와 조건은 신청서·주최 측 안내를 확인해주세요.' };
  }
  if (config?.status !== 'open') {
    return { kind: 'preparing', label: '접수 링크 준비 중', url: null,
      detail: '응답자용 신청 링크와 접수 개시 확인 후 안내합니다.' };
  }
  const url = config.responderLinkVerified === true ? safeResponderUrl(config.responderUrl) : null;
  if (!url) {
    return { kind: 'unavailable', label: '접수 안내 확인 중', url: null,
      detail: '신청 링크를 확인하고 있습니다. 확인 전에는 외부 페이지로 연결하지 않습니다.' };
  }
  if (config.opensAt !== null && config.opensAt !== undefined) {
    const openAt = Date.parse(config.opensAt);
    if (!Number.isFinite(openAt) || openAt >= closeAt) {
      return { kind: 'unavailable', label: '접수 안내 확인 중', url: null,
        detail: '접수 시작 일정을 확인하고 있습니다.' };
    }
    if (now < openAt) {
      return { kind: 'scheduled', label: '접수 시작 전', url: null,
        detail: '안내된 접수 시작 시간에 신청 링크가 열립니다.' };
    }
  }
  return { kind: 'open', label: '참가 신청하기', url,
    detail: 'Google Forms가 새 창에서 열립니다. 모집 안내와 개인정보 고지를 먼저 확인해주세요.' };
}
