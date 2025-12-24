-- 기존 competitions 테이블이 이미 존재하므로, 필요한 경우에만 edition에 UNIQUE 제약 조건 추가
-- 중복된 edition을 가진 레코드 중 가장 최근 것만 남기고 삭제
DELETE FROM competitions
WHERE id IN (
  SELECT id FROM (
    SELECT id, 
           ROW_NUMBER() OVER (PARTITION BY edition ORDER BY created_at DESC) as rn
    FROM competitions
  ) t
  WHERE rn > 1
);

DO $$ 
BEGIN
  -- edition 컬럼에 UNIQUE 제약 조건이 없으면 추가
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'competitions_edition_key'
  ) THEN
    ALTER TABLE competitions ADD CONSTRAINT competitions_edition_key UNIQUE (edition);
  END IF;
END $$;

-- 대회 규칙 테이블 (competitions와 연결하여 각 회차별 규칙 저장 가능)
CREATE TABLE IF NOT EXISTS competition_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_id UUID REFERENCES competitions(id) ON DELETE CASCADE,
  category TEXT NOT NULL, -- "참가 방법", "평가 기준", "유의 사항" 등
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  icon TEXT, -- icon name
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 대회 FAQ 테이블 (기존 FAQ와 별도로 각 대회별 FAQ)
CREATE TABLE IF NOT EXISTS competition_faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_id UUID REFERENCES competitions(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 정책
ALTER TABLE competition_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE competition_faqs ENABLE ROW LEVEL SECURITY;

-- competition_rules 정책
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'competition_rules' 
    AND policyname = 'Anyone can view competition rules'
  ) THEN
    CREATE POLICY "Anyone can view competition rules"
      ON competition_rules FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM competitions
          WHERE competitions.id = competition_rules.competition_id
          AND competitions.status IN ('published', 'ongoing', 'completed')
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'competition_rules' 
    AND policyname = 'Admins can manage competition rules'
  ) THEN
    CREATE POLICY "Admins can manage competition rules"
      ON competition_rules FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = 'admin'
        )
      );
  END IF;
END $$;

-- competition_faqs 정책
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'competition_faqs' 
    AND policyname = 'Anyone can view competition FAQs'
  ) THEN
    CREATE POLICY "Anyone can view competition FAQs"
      ON competition_faqs FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM competitions
          WHERE competitions.id = competition_faqs.competition_id
          AND competitions.status IN ('published', 'ongoing', 'completed')
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'competition_faqs' 
    AND policyname = 'Admins can manage competition FAQs'
  ) THEN
    CREATE POLICY "Admins can manage competition FAQs"
      ON competition_faqs FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = 'admin'
        )
      );
  END IF;
END $$;

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_competition_rules_competition_id ON competition_rules(competition_id);
CREATE INDEX IF NOT EXISTS idx_competition_faqs_competition_id ON competition_faqs(competition_id);
