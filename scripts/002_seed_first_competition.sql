-- 제1회 우주 최고 실패 대회 데이터 삽입
-- ON CONFLICT 대신 먼저 기존 데이터 삭제 후 INSERT
DELETE FROM competitions WHERE edition = 1;

INSERT INTO competitions (
  edition,
  title,
  slug,
  description,
  long_description,
  philosophy,
  purpose,
  video_url,
  poster_image,
  cover_image,
  location,
  start_date,
  end_date,
  registration_deadline,
  max_participants,
  prize_pool,
  category,
  status
) VALUES (
  1,
  '우주 최고 실패 대회',
  'space-failure-1',
  '실패, 결과가 아닌 질문으로 바꾸다',
  '제1회 우주 최고 실패 대회는 "단순히 실패를 극복하고 결국 희망과 웃음으로 마무리하는 자리"가 아닙니다. 포항 지역 최초의 실패 독려 프로젝트로서, 실패를 개인의 낙인으로 치부하지 않고 사회가 함께 격려하고 축하하는 축제의 장을 마련하고자 합니다.',
  '실패는 개인의 몫처럼 보이지만, 사실은 사회가 함께 책임져야 할 감정입니다. 만약 실패를 공유할 수 있는 언어와 공간이 없다면 실패는 그저 실패로 끝날 수밖에 없습니다. 하지만 실패를 나누고 교류하는 과정에서 실패를 조금씩 익숙하게 받아들이고, 이로써 실패는 실패 이후로 나아가게 됩니다.',
  '실패의 가치를 재발견하고, 실패를 두려워하지 않는 문화를 만들어갑니다.',
  'https://player.vimeo.com/video/1047498081?h=9e3e3b5e5b',
  '/images/poster.jpg',
  '/images/poster.jpg',
  '환동해지역혁신원 파랑뜰 2층 드림홀 (경상북도 포항시 북구 장성로 109)',
  '2025-10-01 00:00:00+09',
  '2025-11-08 13:00:00+09',
  '2025-10-27 23:59:59+09',
  100,
  '트랙별 수상자: 실패 도서 출간 저자 기회 제공 및 트로피 수여, 전원: 「우주 최고 실패」 디지털 뱃지 수여',
  '실패 공유',
  'published'
);
