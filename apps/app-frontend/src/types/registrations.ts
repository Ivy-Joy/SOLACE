export type RegistrationStatus =
  | "registered"
  | "confirmed"
  | "waitlisted"
  | "cancelled"

export interface EventRegistration {
  id: string
  eventId: string

  name: string
  email?: string
  phone?: string

  ticketTypeId?: string

  status: RegistrationStatus
  qr?: string

  createdAt: string
  checkedInAt?: string
}