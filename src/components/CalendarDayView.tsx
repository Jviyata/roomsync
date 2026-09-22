import { dateToISO, formatDayHeading } from '../utils/calendar'
import { formatTime } from '../utils/date'
import type { HouseholdEvent } from '../types'
import { getEventsForDate } from '../utils/selectors'
import EmptyState from './EmptyState'
import { EditIcon, MapPinIcon, PlusIcon } from './Icons'

interface CalendarDayViewProps {
  dayDate: Date
  events: HouseholdEvent[]
  onAddEvent: (dateISO: string) => void
  onEventClick: (event: HouseholdEvent) => void
}

export default function CalendarDayView({ dayDate, events, onAddEvent, onEventClick }: CalendarDayViewProps) {
  const iso = dateToISO(dayDate)
  const dayEvents = getEventsForDate(events, iso)

  return (
    <div className="rounded-3xl bg-white p-5 card-shadow ring-1 ring-slate-100">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900">{formatDayHeading(dayDate)}</h3>
        <button
          type="button"
          onClick={() => onAddEvent(iso)}
          className="flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 transition hover:bg-brand-100 active:scale-95"
        >
          <PlusIcon className="h-3.5 w-3.5" />
          Add Event
        </button>
      </div>

      {dayEvents.length === 0 ? (
        <EmptyState
          title="No events"
          message="Nothing planned yet."
          icon="📅"
          action={
            <button
              type="button"
              onClick={() => onAddEvent(iso)}
              className="rounded-full bg-brand-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-800 active:scale-95"
            >
              Add an event
            </button>
          }
        />
      ) : (
        <div className="flex flex-col gap-2">
          {dayEvents.map((event) => (
            <button
              key={event.id}
              type="button"
              onClick={() => onEventClick(event)}
              className="flex items-center gap-4 rounded-2xl bg-surface-100 px-4 py-3 text-left transition hover:bg-surface-200"
            >
              <div className="w-20 shrink-0">
                <p className="text-sm font-semibold text-brand-700">
                  {event.allDay ? 'All day' : formatTime(event.startTime)}
                </p>
                {!event.allDay && event.endTime && (
                  <p className="text-[11px] text-slate-400">until {formatTime(event.endTime)}</p>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-800">{event.title}</p>
                <p className="flex items-center gap-1 truncate text-xs text-slate-400">
                  <MapPinIcon className="h-3 w-3 shrink-0" />
                  {event.space}
                  {event.attendees.length > 0 && ` · ${event.attendees.join(', ')}`}
                </p>
              </div>
              <EditIcon className="h-4 w-4 shrink-0 text-slate-300" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
