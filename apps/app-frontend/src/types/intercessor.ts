export interface IntercessorAvailability {
  dayOfWeek: number;
  start: string;
  end: string;
  timezone: string;
}

export interface Intercessor {
  _id: string;
  displayName: string;
  bio: string;
  tags: string[];
  online: boolean;
  availability: IntercessorAvailability[];
}

export interface IntercessorResponse {
  items: Intercessor[];
}