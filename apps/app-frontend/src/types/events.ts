export interface TicketType {
  id: string
  name: string
  price: number
  capacity: number
  sold: number
}

export interface EventLocation {
  name: string
  address?: string
}

export interface EventItem {
  id: string
  slug: string
  title: string
  description: string
  category: string

  startAt: string
  endAt?: string

  location: EventLocation
  image?: string
  featured?: boolean

  capacity?: number

  tickets: TicketType[]

  published?: boolean
}