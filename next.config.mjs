// 제2회 핸드오프(public/2026)에 함께 전달된 정적 호스팅용 보안 헤더 (hosting-examples/vercel.json.example)
// connect-src만 'self'로 넓혔다: 방문 통계(/2026/track.js → /api/collect)
const EDITION_2026_HEADERS = [
  {
    key: 'Content-Security-Policy',
    value:
      "default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; media-src 'none'; connect-src 'self'; frame-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
  },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'no-referrer' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Cache-Control', value: 'no-cache, must-revalidate' },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
  // 회차별 사이트: /2026은 전달받은 정적 사이트를 그대로 서비스한다
  async rewrites() {
    return [{ source: '/2026', destination: '/2026/index.html' }]
  },
  // 예전 대회 상세 주소. space-failure-2에는 그동안 제1회 데이터가 잘못 표시되고 있었다
  async redirects() {
    return [
      { source: '/competitions/space-failure-1', destination: '/2025', permanent: true },
      { source: '/competitions/first-competition', destination: '/2025', permanent: true },
      { source: '/competitions/space-failure-2', destination: '/2026', permanent: true },
      // Supabase 회원·신청 기능을 CMS로 대체하면서 없어진 주소
      { source: '/auth/:path*', destination: '/admin/login', permanent: false },
      { source: '/register', destination: '/', permanent: false },
      { source: '/my-registrations', destination: '/', permanent: false },
      { source: '/admin/registrations', destination: '/admin', permanent: false },
      { source: '/admin/faq', destination: '/admin/faqs', permanent: false },
      { source: '/admin/faq/:path*', destination: '/admin/faqs/:path*', permanent: false },
    ]
  },
  async headers() {
    return [
      { source: '/2026', headers: EDITION_2026_HEADERS },
      { source: '/2026/:path*', headers: EDITION_2026_HEADERS },
      { source: '/admin/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
    ]
  },
}

export default nextConfig
