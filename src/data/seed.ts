import type { AppState, Guest, HouseholdEvent, Reminder } from '../types'
import { addDaysISO, todayISO } from '../utils/date'

function uid(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`
}

function nextWeekendISO(): string {
  const today = new Date()
  const day = today.getDay() // 0 = Sunday, 6 = Saturday
  const daysUntilSaturday = (6 - day + 7) % 7 || 7
  return addDaysISO(todayISO(), daysUntilSaturday)
}

const today = todayISO()
const tomorrow = addDaysISO(today, 1)
const yesterday = addDaysISO(today, -1)
const weekend = nextWeekendISO()

export function buildSeedEvents(): HouseholdEvent[] {
  const events: Omit<HouseholdEvent, 'id'>[] = [
    {
      title: 'Morning Shower',
      space: 'Bathroom',
      date: today,
      allDay: false,
      startTime: '08:00',
      endTime: '08:20',
      attendees: ['Viyata'],
      description: '',
    },
    {
      title: 'Lunch Prep',
      space: 'Kitchen',
      date: today,
      allDay: false,
      startTime: '12:30',
      endTime: '13:00',
      attendees: ['Viyata', 'Alex'],
      description: '',
    },
    {
      title: 'Dinner Preparation',
      space: 'Kitchen',
      date: today,
      allDay: false,
      startTime: '18:30',
      endTime: '19:15',
      attendees: ['Viyata', 'Alex', 'Sam'],
      description: 'Making pasta, need to grab basil from the balcony planter.',
    },
    {
      title: 'Movie Night',
      space: 'Living Room',
      date: today,
      allDay: false,
      startTime: '20:30',
      endTime: '22:30',
      attendees: ['Viyata', 'Alex', 'Sam'],
      description: 'Picking something on the group vote thread.',
    },
    {
      title: 'Laundry Load',
      space: 'Laundry Room',
      date: tomorrow,
      allDay: false,
      startTime: '09:00',
      endTime: '10:00',
      attendees: ['Alex'],
      description: '',
    },
    {
      title: 'Study Session',
      space: 'Study Room',
      date: tomorrow,
      allDay: false,
      startTime: '16:00',
      endTime: '18:00',
      attendees: ['Sam'],
      description: 'Midterm review with the study group.',
    },
    {
      title: 'Grocery Run',
      space: 'Other',
      date: addDaysISO(today, 2),
      allDay: true,
      startTime: '',
      endTime: '',
      attendees: ['Viyata'],
      description: 'Costco run — add items to the shared list before noon.',
    },
    {
      title: 'Deep Clean Kitchen',
      space: 'Kitchen',
      date: weekend,
      allDay: false,
      startTime: '11:00',
      endTime: '12:30',
      attendees: ['Viyata', 'Alex', 'Sam'],
      description: 'Monthly deep clean rotation.',
    },
    {
      title: 'Balcony Coffee',
      space: 'Balcony',
      date: weekend,
      allDay: false,
      startTime: '09:00',
      endTime: '09:30',
      attendees: ['Viyata'],
      description: '',
    },
    {
      title: 'Roommate Check-in',
      space: 'Living Room',
      date: addDaysISO(today, 4),
      allDay: false,
      startTime: '19:00',
      endTime: '19:30',
      attendees: ['Viyata', 'Alex', 'Sam'],
      description: 'Monthly budget and chores check-in.',
    },
    {
      title: 'Morning Shower',
      space: 'Bathroom',
      date: yesterday,
      allDay: false,
      startTime: '07:45',
      endTime: '08:05',
      attendees: ['Sam'],
      description: '',
    },
    {
      title: 'Game Night',
      space: 'Living Room',
      date: addDaysISO(today, -3),
      allDay: false,
      startTime: '20:00',
      endTime: '22:00',
      attendees: ['Viyata', 'Alex', 'Sam'],
      description: '',
    },
  ]

  return events.map((e) => ({ ...e, id: uid('evt') }))
}

export function buildSeedReminders(): Reminder[] {
  const reminders: Omit<Reminder, 'id'>[] = [
    {
      text: 'Take the bins out',
      priority: 'high',
      completed: false,
      sender: 'Alex',
      createdAt: today,
    },
    {
      text: "Weekly chore turn — it's your week for dishes",
      priority: 'medium',
      completed: false,
      sender: 'Sam',
      createdAt: yesterday,
    },
    {
      text: 'Clean old food from fridge',
      priority: 'low',
      completed: false,
      sender: 'Viyata',
      createdAt: yesterday,
    },
    {
      text: 'Internet bill is due Friday — split three ways',
      priority: 'high',
      completed: false,
      sender: 'Alex',
      createdAt: addDaysISO(today, -2),
    },
    {
      text: 'Quiet hours start at 10pm on weeknights',
      priority: 'medium',
      completed: true,
      sender: 'Sam',
      createdAt: addDaysISO(today, -5),
    },
  ]
  return reminders.map((r) => ({ ...r, id: uid('rem') }))
}

export function buildSeedGuests(): Guest[] {
  const guests: Omit<Guest, 'id'>[] = [
    {
      name: 'Jeremiah Fisher',
      relationship: 'Friend',
      visitDate: today,
      firstTime: false,
      arrivalTime: '14:00',
      departureTime: '18:00',
      tags: ['Friend', 'Dinner Guest'],
      notes: 'Staying for dinner — he\'s allergic to shellfish.',
    },
    {
      name: 'Steven Conklin',
      relationship: 'Coworker',
      visitDate: tomorrow,
      firstTime: true,
      arrivalTime: '17:30',
      departureTime: '19:00',
      tags: ['Coworker'],
      notes: 'First time visiting — buzz apartment 4B.',
    },
    {
      name: 'Conrad Fisher',
      relationship: 'Family',
      visitDate: weekend,
      firstTime: false,
      arrivalTime: '10:00',
      departureTime: '20:00',
      tags: ['Family'],
      notes: 'Visiting for the weekend, will need the couch.',
    },
    {
      name: 'Priya Nair',
      relationship: 'Study Group',
      visitDate: addDaysISO(today, 1),
      firstTime: false,
      arrivalTime: '16:00',
      departureTime: '18:00',
      tags: ['Study Group'],
      notes: '',
    },
    {
      name: 'Marcus Lee',
      relationship: 'Friend',
      visitDate: addDaysISO(today, -4),
      firstTime: false,
      arrivalTime: '18:00',
      departureTime: '23:00',
      tags: ['Friend'],
      notes: 'Parking notes: street parking only after 6pm.',
    },
  ]
  return guests.map((g) => ({ ...g, id: uid('gst') }))
}

export function buildSeedState(): AppState {
  return {
    events: buildSeedEvents(),
    reminders: buildSeedReminders(),
    guests: buildSeedGuests(),
    homeStatus: { temperature: 72, doorLocked: true },
  }
}
