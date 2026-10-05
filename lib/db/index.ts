import { Pool, type PoolClient, type QueryResultRow } from "pg"
import { attachDatabasePool } from "@vercel/functions"
import { DEFAULT_EDITIONS, DEFAULT_FAQS, DEFAULT_PARTNERS, DEFAULT_SETTINGS } from "@/lib/cms/defaults"

// Neon(Vercel 연동)의 DATABASE_URL을 쓴다. 로컬 개발에서는 아무 PostgreSQL 주소나 넣으면 된다.
// CMS 테이블은 모두 cms_ 접두사를 써서 기존 테이블(v0가 만든 competitions 등)과 겹치지 않게 한다.

const globalForDb = globalThis as unknown as { wfPool?: Pool; wfSchema?: Promise<void> }

export function hasDatabase() {
  return Boolean(process.env.DATABASE_URL)
}

/** pg는 sslmode=require를 verify-full로 처리하면서 매번 경고를 남긴다. 같은 동작을 명시해 로그에 경고가 쌓이지 않게 한다 */
function connectionString() {
  return process.env.DATABASE_URL?.replace(/([?&]sslmode=)(prefer|require|verify-ca)(?=&|$)/, "$1verify-full")
}

function pool(): Pool {
  if (!globalForDb.wfPool) {
    const p = new Pool({
      connectionString: connectionString(),
      max: 5,
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 10_000,
    })
    attachDatabasePool(p)
    globalForDb.wfPool = p
  }
  return globalForDb.wfPool
}

const SCHEMA = `
create table if not exists cms_admins (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text not null default '',
  password_hash text not null,
  failed_attempts int not null default 0,
  locked_until timestamptz,
  created_at timestamptz not null default now(),
  last_login_at timestamptz
);
create table if not exists cms_sessions (
  token_hash text primary key,
  admin_id uuid not null references cms_admins(id) on delete cascade,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);
create table if not exists cms_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);
create table if not exists cms_editions (
  id uuid primary key default gen_random_uuid(),
  number int not null unique,
  year int not null,
  slug text not null unique,
  published boolean not null default true,
  page_mode text not null default 'cms',
  external_url text not null default '',
  key_color text not null default '#2bb6e3',
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists cms_announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  excerpt text not null default '',
  body text not null default '',
  featured boolean not null default false,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists cms_faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  edition_number int,
  sort int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists cms_partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text not null default '',
  link_url text not null default '',
  temporary boolean not null default false,
  editions int[] not null default '{}',
  sort int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists cms_media (
  id uuid primary key default gen_random_uuid(),
  url text not null unique,
  pathname text not null,
  content_type text not null default '',
  size int not null default 0,
  alt text not null default '',
  created_at timestamptz not null default now()
);
-- 방문 통계(자체 수집). IP는 저장하지 않고, 하루마다 바뀌는 익명 방문자 값만 남긴다.
create table if not exists cms_hits (
  id bigserial primary key,
  ts timestamptz not null default now(),
  kind text not null,
  name text not null default '',
  label text not null default '',
  path text not null default '/',
  referrer text not null default '',
  visitor text not null default '',
  device text not null default '',
  country text not null default ''
);
create index if not exists cms_hits_ts on cms_hits (ts);
`

async function count(client: PoolClient, table: string) {
  const { rows } = await client.query<{ n: string }>(`select count(*) as n from ${table}`)
  return Number(rows[0].n)
}

const SEED_MARKER = "seeded_v1"

/** 처음 한 번만 현재 사이트 내용으로 채운다. 관리자가 FAQ·기관 등을 모두 지워도 다시 생기지 않도록 표시를 남긴다. */
async function seed(client: PoolClient) {
  const done = await client.query(`select 1 from cms_settings where key = $1`, [SEED_MARKER])
  if (done.rowCount) return
  await client.query(`insert into cms_settings (key, value) values ('site', $1) on conflict (key) do nothing`, [
    JSON.stringify(DEFAULT_SETTINGS),
  ])
  if ((await count(client, "cms_editions")) === 0) {
    for (const e of DEFAULT_EDITIONS) {
      await client.query(
        `insert into cms_editions (number, year, slug, published, page_mode, external_url, key_color, data)
         values ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [e.number, e.year, e.slug, e.published, e.pageMode, e.externalUrl, e.keyColor, JSON.stringify(e.data)],
      )
    }
  }
  if ((await count(client, "cms_faqs")) === 0) {
    for (const f of DEFAULT_FAQS) {
      await client.query(
        `insert into cms_faqs (question, answer, edition_number, sort, published) values ($1, $2, $3, $4, $5)`,
        [f.question, f.answer, f.editionNumber, f.sort, f.published],
      )
    }
  }
  if ((await count(client, "cms_partners")) === 0) {
    for (const p of DEFAULT_PARTNERS) {
      await client.query(
        `insert into cms_partners (name, logo_url, link_url, temporary, editions, sort, published)
         values ($1, $2, $3, $4, $5, $6, $7)`,
        [p.name, p.logoUrl, p.linkUrl, p.temporary, p.editions, p.sort, p.published],
      )
    }
  }
  await client.query(`insert into cms_settings (key, value) values ($1, $2)`, [SEED_MARKER, JSON.stringify({ at: new Date().toISOString() })])
}

/** 테이블 생성과 초기 데이터 입력을 프로세스당 한 번만 한다. 빌드 중 동시 실행은 잠금으로 막는다. */
export function ensureSchema(): Promise<void> {
  if (!globalForDb.wfSchema) {
    globalForDb.wfSchema = (async () => {
      const client = await pool().connect()
      try {
        await client.query("begin")
        await client.query("select pg_advisory_xact_lock(7702026)")
        await client.query(SCHEMA)
        await seed(client)
        await client.query("commit")
      } catch (error) {
        await client.query("rollback").catch(() => {})
        throw error
      } finally {
        client.release()
      }
    })().catch((error) => {
      globalForDb.wfSchema = undefined
      throw error
    })
  }
  return globalForDb.wfSchema
}

export async function query<T extends QueryResultRow = QueryResultRow>(text: string, params: unknown[] = []): Promise<T[]> {
  await ensureSchema()
  const { rows } = await pool().query<T>(text, params)
  return rows
}
