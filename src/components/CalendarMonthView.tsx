import { WEEKDAY_LABELS, dateToISO, getMonthGrid, isSameMonth, isToday } from '../utils/calendar'
import { formatTime } from '../utils/date'
import type { HouseholdEvent } from '../types'

interface CalendarMonthViewProps {
  monthDate: Date
  events: HouseholdEvent[]
  onDayClick: (dateISO: string) => void
  onEventClick: (event: HouseholdEvent) => void
}

const MAX_VISIBLE = 3

export default function CalendarMonthView({ monthDate, events, onDayClick, onEventClick }: CalendarMonthViewProps) {
  const days = getMonthGrid(monthDate)
  const eventsByDate = new Map<string, HouseholdEvent[]>()
  for (const e of events) {
    const list = eventsByDate.get(e.date) ?? []
    list.push(e)
    eventsByDate.set(e.date, list)
  }
  for (const list of eventsByDate.values()) {
    list.sort((a, b) => (a.allDay === b.allDay ? a.startTime.localeCompare(b.startTime) : a.allDay ? -1 : 1))
  }

  return (
    <div className="overflow-hidden rounded-3xl bg-white card-shadow ring-1 ring-slate-100">
      <div className="grid grid-cols-7 border-b border-slate-100 bg-surface-50">
        {WEEKDAY_LABELS.map((d) => (
          <div key={d} className="px-2 py-2.5 text-center text-xs font-semibold text-slate-400">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const iso = dateToISO(day)
          const dayEvents = eventsByDate.get(iso) ?? []
          const inMonth = isSameMonth(day, monthDate)
          const today = isToday(day)
          const visible = dayEvents.slice(0, MAX_VISIBLE)
          const overflow = dayEvents.length - visible.length

          return (
            <button
              key={iso}
              type="button"
              onClick={() => onDayClick(iso)}
              className={`group flex min-h-[92px] flex-col items-stretch gap-1 border-b border-r border-slate-100 p-1.5 text-left transition hover:bg-brand-50/40 sm:min-h-[112px] sm:p-2 ${
                inMonth ? 'bg-white' : 'bg-slate-50/50'
              }`}
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                  today
                    ? 'bg-brand-700 text-white'
                    : inMonth
                      ? 'text-slate-700'
                      : 'text-slate-300'
                }`}
              >
                {day.getDate()}
              </span>
              <div className="flex flex-1 flex-col gap-1">
                {visible.map((event) => (
                  <span
                    role="button"
                    tabIndex={0}
                    key={event.id}
                    onClick={(e) => {
                      e.stopPropagation()
                      onEventClick(event)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.stopPropagation()
                        onEventClick(event)
                      }
                    }}
                    className="truncate rounded-md bg-brand-50 px-1.5 py-0.5 text-[10.5px] font-medium text-brand-800 transition hover:bg-brand-100 sm:text-xs"
                    title={`${event.title} — ${event.allDay ? 'All day' : formatTime(event.startTime)}`}
                  >
                    {!event.allDay && <span className="text-brand-500">{formatTime(event.startTime)} </span>}
                    {event.title}
                  </span>
                ))}
                {overflow > 0 && (
                  <span className="px-1.5 text-[10.5px] font-medium text-slate-400 sm:text-xs">+{overflow} more</span>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
