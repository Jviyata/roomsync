import { dateToISO, getWeekDays, isToday } from '../utils/calendar'
import { formatTime } from '../utils/date'
import type { HouseholdEvent } from '../types'
import { getEventsForDate } from '../utils/selectors'

interface CalendarWeekViewProps {
  weekDate: Date
  events: HouseholdEvent[]
  onDayClick: (dateISO: string) => void
  onEventClick: (event: HouseholdEvent) => void
}

export default function CalendarWeekView({ weekDate, events, onDayClick, onEventClick }: CalendarWeekViewProps) {
  const days = getWeekDays(weekDate)

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-7">
      {days.map((day) => {
        const iso = dateToISO(day)
        const dayEvents = getEventsForDate(events, iso)
        const today = isToday(day)
        return (
          <div
            key={iso}
            className={`flex flex-col rounded-2xl bg-white p-3 card-shadow ring-1 ${
              today ? 'ring-brand-200' : 'ring-slate-100'
            }`}
          >
            <div className="mb-2 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  {day.toLocaleDateString('en-US', { weekday: 'short' })}
                </p>
                <p className={`text-lg font-bold ${today ? 'text-brand-700' : 'text-slate-800'}`}>{day.getDate()}</p>
              </div>
              <button
                type="button"
                onClick={() => onDayClick(iso)}
                aria-label="Add event"
                className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition hover:bg-brand-50 hover:text-brand-700"
              >
                +
              </button>
            </div>
            <div className="flex flex-1 flex-col gap-1.5">
              {dayEvents.length === 0 ? (
                <button
                  type="button"
                  onClick={() => onDayClick(iso)}
                  className="rounded-xl border border-dashed border-slate-200 px-2 py-3 text-center text-xs text-slate-300 transition hover:border-brand-200 hover:text-brand-500"
                >
                  Nothing planned
                </button>
              ) : (
                dayEvents.map((event) => (
                  <button
                    key={event.id}
                    type="button"
                    onClick={() => onEventClick(event)}
                    className="rounded-xl bg-surface-100 px-2.5 py-1.5 text-left transition hover:bg-brand-50"
                  >
                    <p className="text-[11px] font-semibold text-brand-600">
                      {event.allDay ? 'All day' : formatTime(event.startTime)}
                    </p>
                    <p className="truncate text-xs font-medium text-slate-700">{event.title}</p>
                    <p className="truncate text-[11px] text-slate-400">{event.space}</p>
                  </button>
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
