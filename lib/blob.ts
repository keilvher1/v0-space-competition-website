/** Vercel Blob 저장소가 프로젝트에 연결되어 있는지. 읽기·쓰기 토큰 방식과 OIDC(BLOB_STORE_ID) 방식 모두 지원한다. */
export function blobConfigured() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID)
}
