import type { Guest, HouseholdEvent, Priority, Reminder, Space } from '../types'
import { SHARED_SPACES } from '../types'
import { addDaysISO, formatTime, nowMinutes, timeToMinutes, todayISO } from './date'

export function getEventsForDate(events: HouseholdEvent[], dateISO: string): HouseholdEvent[] {
  return events
    .filter((e) => e.date === dateISO)
    .sort((a, b) => {
      if (a.allDay && !b.allDay) return -1
      if (!a.allDay && b.allDay) return 1
      return timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
    })
}

export function getUpNextEvent(events: HouseholdEvent[]): HouseholdEvent | null {
  const today = todayISO()
  const todays = getEventsForDate(events, today)
  if (todays.length === 0) return null
  const nm = nowMinutes()
  const upcoming = todays.find((e) => !e.allDay && timeToMinutes(e.startTime) >= nm)
  return upcoming ?? todays[0]
}

const PRIORITY_WEIGHT: Record<Priority, number> = { high: 0, medium: 1, low: 2 }

export function sortReminders(reminders: Reminder[]): Reminder[] {
  return [...reminders].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1
    if (a.priority !== b.priority) return PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority]
    return b.createdAt.localeCompare(a.createdAt)
  })
}

export function getIncompleteReminders(reminders: Reminder[]): Reminder[] {
  return sortReminders(reminders.filter((r) => !r.completed))
}

export function getSpaceStatus(
  events: HouseholdEvent[],
  space: Space,
): 'Available' | 'In Use' {
  const today = todayISO()
  const nm = nowMinutes()
  const todays = getEventsForDate(events, today).filter((e) => e.space === space && !e.allDay)
  const inUse = todays.some((e) => {
    const start = timeToMinutes(e.startTime)
    const end = e.endTime ? timeToMinutes(e.endTime) : start + 60
    return nm >= start && nm < end
  })
  return inUse ? 'In Use' : 'Available'
}

export function getAvailableSpacesCount(events: HouseholdEvent[]): { available: number; total: number } {
  const total = SHARED_SPACES.length
  const available = SHARED_SPACES.filter((s) => getSpaceStatus(events, s) === 'Available').length
  return { available, total }
}

export function getGuestsForDate(guests: Guest[], dateISO: string): Guest[] {
  return guests
    .filter((g) => g.visitDate === dateISO)
    .sort((a, b) => timeToMinutes(a.arrivalTime) - timeToMinutes(b.arrivalTime))
}

export function getTodayGuests(guests: Guest[]): Guest[] {
  return getGuestsForDate(guests, todayISO())
}

export function getUpcomingGuests(guests: Guest[]): Guest[] {
  const today = todayISO()
  return guests
    .filter((g) => g.visitDate > today)
    .sort((a, b) => (a.visitDate === b.visitDate ? timeToMinutes(a.arrivalTime) - timeToMinutes(b.arrivalTime) : a.visitDate.localeCompare(b.visitDate)))
}

export function getPastGuests(guests: Guest[]): Guest[] {
  const today = todayISO()
  return guests
    .filter((g) => g.visitDate < today)
    .sort((a, b) => (a.visitDate === b.visitDate ? 0 : b.visitDate.localeCompare(a.visitDate)))
}

export function relativeDayLabel(dateISO: string): string {
  const today = todayISO()
  if (dateISO === today) return 'Today'
  if (dateISO === addDaysISO(today, 1)) return 'Tomorrow'
  if (dateISO === addDaysISO(today, -1)) return 'Yesterday'
  return dateISO
}

export function guestStatusLabel(guest: Guest): string {
  const today = todayISO()
  if (guest.visitDate === today) {
    const nm = nowMinutes()
    const arr = timeToMinutes(guest.arrivalTime)
    const dep = guest.departureTime ? timeToMinutes(guest.departureTime) : null
    if (nm < arr) return `Arriving today · ${formatTime(guest.arrivalTime)}`
    if (dep !== null && nm >= dep) return `Departed today`
    return `Here now · until ${guest.departureTime ? formatTime(guest.departureTime) : 'late'}`
  }
  if (guest.visitDate === addDaysISO(today, 1)) return `Arriving tomorrow`
  if (guest.visitDate > today) return `Arriving ${relativeDayLabel(guest.visitDate)}`
  return `Visited ${relativeDayLabel(guest.visitDate)}`
}
