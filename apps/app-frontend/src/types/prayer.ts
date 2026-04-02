//apps/app-frontend/src/types/prayer.ts
export type PrayerLanguage = "en" | "sw"

export interface PublicPrayer {
  _id: string
  title?: string
  excerpt: string
  prayersCount: number
  answered: boolean
  createdAt: string
  language: PrayerLanguage
  anonymous: boolean; 
  name?: string;        //(optional, used if not anonymous)
}

export interface PrayerSubmission {
  title?: string
  text: string
  name?: string
  phone?: string
  consentToContact: boolean
  anonymous: boolean
  language: PrayerLanguage
}

export interface PrayerListResponse {
  items: PublicPrayer[]
}

export interface AdminPrayer {
  _id: string
  title?: string
  excerpt: string
  hidden: boolean
}