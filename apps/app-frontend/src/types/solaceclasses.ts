// apps/app-frontend/src/types/solaceclasses.ts
export type ClassKey = 'vuka' | 'ropes' | 'teens' | 'mph' | 'young';

export interface Lesson {
  id: string;
  title: string;
  durationMinutes?: number;
}

export interface ClassOverview {
  key: ClassKey;
  label: string;
  age: string;
  image?: string;
  summary?: string;
  focus: string[]; 
}

export interface Mentor {
  id: string;
  name: string;
  role?: string;
  bio?: string;
  photo?: string;
}

export interface SundaySession {
  id: string;
  date: string; 
  theme: string;
  scripture: string; 
  summary: string;
  questions: string[]; 
}

export interface MonthlySeries {
  month: string; 
  sessions: SundaySession[];
}

export interface ClassDetailModel extends ClassOverview {
  description: string;
  mentors: Mentor[];
  monthlySeries: MonthlySeries[];
  enrolled: number;   
  capacity: number;   
  schedule: { date: string; lessons: Lesson[] }[]; 
}