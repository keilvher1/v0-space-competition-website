export const EVENT = Object.freeze({
  name: '제2회 우주최고실패대회',
  startsAt: '2026-11-11T19:00:00+09:00',
  endsAt: '2026-11-11T20:30:00+09:00',
  deadline: '2026-10-31T23:59:00+09:00',
  venue: '러블랑 B1',
});

// Announced navigation is not a claim that the provider currently accepts responses.
// Source: user's official announcement. No form opened, changed or submitted by this site.
export const REGISTRATIONS = Object.freeze({
  participant: Object.freeze({
    status: 'announced', actionLabel: '참가 신청하기',
    responderUrl: 'https://forms.gle/8QCSaguvMiDcKNho7',
    announcementLinkConfirmed: true, responderLinkVerified: false, opensAt: null,
  }),
  observer: Object.freeze({
    status: 'announced', actionLabel: '참관 신청하기',
    responderUrl: 'https://forms.gle/ddS3DjHMKJqyLGKX8',
    announcementLinkConfirmed: true, responderLinkVerified: false, opensAt: null,
  }),
});

// Retained for older pure state tests; not a third application channel.
export const REGISTRATION = REGISTRATIONS.participant;
