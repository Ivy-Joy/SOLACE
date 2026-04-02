// apps/app-frontend/src/lib/classesMock.ts
import { nanoid } from "nanoid";
import type { ClassOverview, ClassDetailModel, Lesson } from "@/src/types/solaceclasses";

const now = Date.now();

// Updated CLASSES to include the 'focus' array
export const CLASSES: ClassOverview[] = [
  {
    key: "vuka",
    label: "VUKA",
    age: "12 years",
    image: "/images/Vuka.png",
    summary: "Foundations for pre-teen faith and everyday discipleship.",
    focus: ["Faith Foundations", "Scripture", "Community"]
  },
  {
    key: "ropes",
    label: "ROPEs",
    age: "13 years",
    image: "/images/Ropes.png",
    summary: "Mentorship-focused formation and spiritual habits.",
    focus: ["Spiritual Rhythms", "Mentorship", "Habits"]
  },
  {
    key: "teens",
    label: "TEENS",
    age: "14–17 years",
    image: "/images/Teens.png",
    summary: "Teen discipleship: identity, worship, and leadership.",
    focus: ["Identity", "Worship", "Leadership"]
  },
  {
    key: "mph",
    label: "MPH",
    age: "18–25 years",
    image: "/images/MPH.png",
    summary: "Marketplace discipleship: vocation and calling.",
    focus: ["Vocation", "Ethics", "Marketplace"]
  },
  {
    key: "young",
    label: "YOUNG ADULTS",
    age: "25–35 years",
    image: "/images/YoungAdults.png",
    summary: "Strategic leadership, service and formation.",
    focus: ["Strategy", "Mission", "Theology"]
  }
];

function addDays(base: number, days: number) {
  return new Date(base + days * 24 * 3600 * 1000).toISOString();
}

const makeSession = (offsetDays: number, theme: string, scripture: string, summary: string, questions: string[]) => ({
  id: nanoid(8),
  date: addDays(now, offsetDays),
  theme,
  scripture,
  summary,
  questions
});

const DETAILS: Record<string, ClassDetailModel> = {
  vuka: {
    ...CLASSES[0],
    description: "VUKA (pre-teen ministry) provides warm, scripture-focused Sundays tailored to 11–13 year olds...",
    enrolled: 12,
    capacity: 20,
    mentors: [
      { id: "m-joy", name: "Pastor Joy Wedah", role: "Children's Lead", photo: "/images/mentors/joy.jpg" }
    ],
    monthlySeries: [
      {
        month: "January 2026",
        sessions: [makeSession(4, "Who Is God?", "Genesis 1:1", "Intro...", ["Why is creation important?"])]
      }
    ],
    schedule: [
      { date: addDays(now, 4), lessons: [{ id: "l1", title: "Creation Story", durationMinutes: 45 }] }
    ]
  },
  // Repeat similar patterns for ropes, teens, mph, young...
};

const delay = (ms = 200) => new Promise((res) => setTimeout(res, ms));

export async function fetchClassOverviews(): Promise<ClassOverview[]> {
  await delay();
  return JSON.parse(JSON.stringify(CLASSES));
}

export async function fetchClassDetail(key: string): Promise<ClassDetailModel> {
  await delay();
  const d = DETAILS[key] || DETAILS['vuka']; // Fallback for demo
  return JSON.parse(JSON.stringify(d));
}

// FIX: Added missing exported member
export async function registerForClass(data: { name: string; email: string; classKey: string }) {
  await delay(800);
  console.log("Registration received:", data);
  return { success: true };
}