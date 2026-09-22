export type Space =
  | 'Kitchen'
  | 'Living Room'
  | 'Bathroom'
  | 'Laundry Room'
  | 'Balcony'
  | 'Study Room'
  | 'Other'

export const SPACES: Space[] = [
  'Kitchen',
  'Living Room',
  'Bathroom',
  'Laundry Room',
  'Balcony',
  'Study Room',
  'Other',
]

export const SHARED_SPACES: Space[] = ['Kitchen', 'Living Room', 'Bathroom', 'Laundry Room']

export interface HouseholdEvent {
  id: string
  title: string
  space: Space
  date: string // YYYY-MM-DD
  allDay: boolean
  startTime: string // HH:MM, 24h
  endTime: string // HH:MM, optional -> ''
  attendees: string[]
  description: string
}

export type Priority = 'low' | 'medium' | 'high'

export interface Reminder {
  id: string
  text: string
  priority: Priority
  completed: boolean
  sender: string
  createdAt: string // ISO date
}

export type Relationship =
  | 'Friend'
  | 'Family'
  | "Roommate's Guest"
  | 'Classmate'
  | 'Coworker'
  | 'Study Group'
  | 'Other'

export const RELATIONSHIPS: Relationship[] = [
  'Friend',
  'Family',
  "Roommate's Guest",
  'Classmate',
  'Coworker',
  'Study Group',
  'Other',
]

export interface Guest {
  id: string
  name: string
  relationship: Relationship
  visitDate: string // YYYY-MM-DD
  firstTime: boolean
  arrivalTime: string // HH:MM
  departureTime: string // HH:MM, optional
  tags: string[]
  notes: string
}

export interface HomeStatus {
  temperature: number
  doorLocked: boolean
}

export interface AppState {
  events: HouseholdEvent[]
  reminders: Reminder[]
  guests: Guest[]
  homeStatus: HomeStatus
}
