export interface Competition {
  id: string
  edition: number
  title: string
  subtitle?: string
  description?: string
  philosophy?: string

  registration_start?: string
  registration_end: string
  preliminary_announcement?: string
  final_date: string
  final_time?: string
  final_location?: string
  final_location_address?: string
  winner_announcement?: string

  registration_link?: string
  submission_format?: string

  prizes?: {
    all_participants?: string
    track_winners?: string
    [key: string]: string | undefined
  }

  poster_url?: string
  video_url?: string

  organizers?: Array<{
    name: string
    logo_url: string
  }>
  sponsors?: Array<{
    name: string
    logo_url: string
  }>

  status: "draft" | "published" | "ongoing" | "completed" | "archived"
  is_current: boolean

  created_at: string
  updated_at: string
}

export interface CompetitionRule {
  id: string
  competition_id: string
  category: string
  title: string
  content: string
  icon?: string
  order_index: number
  created_at: string
}

export interface CompetitionFAQ {
  id: string
  competition_id: string
  question: string
  answer: string
  order_index: number
  created_at: string
}

export interface CompetitionRegistration {
  id: string
  competition_id: string
  user_id: string

  name: string
  email: string
  phone?: string
  age_group: "youth" | "adult"

  failure_title: string
  failure_description: string
  submission_type: "video" | "document"
  submission_url?: string

  status: "pending" | "preliminary_passed" | "final_passed" | "rejected"

  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  email: string
  full_name?: string
  role: "user" | "admin"
  created_at: string
  updated_at: string
}
