import { neon } from '@neondatabase/serverless'

// Neon serverless PostgreSQL client for competition data
const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set')
}

export const sql = neon(DATABASE_URL)

export interface Competition {
  id: number
  slug: string
  edition: number
  title: string
  description: string | null
  status: string
  cover_image: string | null
  video_url: string | null
  location: string | null
  registration_start: string | null
  registration_end: string | null
  preliminary_announcement: string | null
  final_date: string | null
  final_announcement: string | null
  created_at: string
  updated_at: string
}

export interface CompetitionSchedule {
  id: number
  competition_id: number
  date: string
  title: string
  description: string | null
  sort_order: number
}

export interface CompetitionAward {
  id: number
  competition_id: number
  place: string
  prize: string
  icon: string | null
}

export interface CompetitionCategory {
  id: number
  competition_id: number
  name: string
  description: string | null
  icon: string | null
}

export interface CompetitionOrganizer {
  id: number
  competition_id: number
  name: string
  role: string | null
  logo_url: string | null
}

export async function getCompetitionBySlug(slug: string): Promise<Competition | null> {
  try {
    const result = await sql<Competition[]>`
      SELECT * FROM competitions WHERE slug = ${slug}
    `
    console.log("[v0] Query result type:", typeof result, "is array:", Array.isArray(result))
    console.log("[v0] Query result:", result)
    return result && result.length > 0 ? result[0] : null
  } catch (error) {
    console.error("[v0] getCompetitionBySlug error:", error)
    return null
  }
}

export async function getCompetitionSchedule(competitionId: number): Promise<CompetitionSchedule[]> {
  return await sql<CompetitionSchedule[]>`
    SELECT * FROM competition_schedule 
    WHERE competition_id = ${competitionId}
    ORDER BY sort_order ASC
  `
}

export async function getCompetitionAwards(competitionId: number): Promise<CompetitionAward[]> {
  return await sql<CompetitionAward[]>`
    SELECT * FROM competition_awards 
    WHERE competition_id = ${competitionId}
  `
}

export async function getCompetitionCategories(competitionId: number): Promise<CompetitionCategory[]> {
  return await sql<CompetitionCategory[]>`
    SELECT * FROM competition_categories 
    WHERE competition_id = ${competitionId}
  `
}

export async function getCompetitionOrganizers(competitionId: number): Promise<CompetitionOrganizer[]> {
  return await sql<CompetitionOrganizer[]>`
    SELECT * FROM competition_organizers 
    WHERE competition_id = ${competitionId}
  `
}
