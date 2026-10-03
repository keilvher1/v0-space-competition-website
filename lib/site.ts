// 공지사항 노출 여부. Supabase의 announcements 테이블에는 v0가 만든 영어 샘플 글만 있어서
// 실제 공지를 올리기 전까지 메뉴와 페이지를 숨긴다. 관리자 화면(/admin/announcements)은 그대로 동작한다.
export const ANNOUNCEMENTS_ENABLED = false
