-- 제1회 대회를 제2회로 변경
UPDATE competitions
SET 
  edition = 2,
  title = '제2회 우주 최고 실패 대회',
  slug = 'space-failure-2'
WHERE slug = 'space-failure-1' OR edition = 1;
