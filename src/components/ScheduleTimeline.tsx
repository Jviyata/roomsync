import { useNavigate } from 'react-router-dom'
import { CalendarIcon } from './Icons'
import { formatTime } from '../utils/date'
import type { HouseholdEvent } from '../types'
import EmptyState from './EmptyState'

interface ScheduleTimelineProps {
  events: HouseholdEvent[]
  nextEventId?: string | null
  title?: string
  onViewAll?: () => void
}

export default function ScheduleTimeline({
  events,
  nextEventId,
  title = "Today's Schedule",
  onViewAll,
}: ScheduleTimelineProps) {
  const navigate = useNavigate()
  const handleViewAll = onViewAll ?? (() => navigate('/calendar'))

  return (
    <div className="rounded-3xl bg-white p-5 card-shadow ring-1 ring-slate-100">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-brand-700">
            <CalendarIcon className="h-4 w-4" />
          </span>
          <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
        </div>
        <button
          type="button"
          onClick={handleViewAll}
          className="text-xs font-medium text-slate-400 transition hover:text-brand-700"
        >
          View all
        </button>
      </div>

      {events.length === 0 ? (
        <EmptyState title="No events" message="Nothing planned yet." icon="📅" />
      ) : (
        <ol className="relative">
          {events.map((event, idx) => {
            const isNext = event.id === nextEventId
            const isLast = idx === events.length - 1
            return (
              <li key={event.id} className="relative flex gap-3 pb-5 last:pb-0">
                {!isLast && (
                  <span className="absolute left-[5px] top-4 h-full w-px bg-slate-200" aria-hidden />
                )}
                <span
                  className={`relative mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                    isNext ? 'bg-brand-600 ring-4 ring-brand-100' : 'bg-slate-300'
                  }`}
                  aria-hidden
                />
                <button
                  type="button"
                  onClick={() => navigate('/calendar')}
                  className="-mt-1 flex-1 rounded-xl px-2 py-1 text-left transition hover:bg-slate-50"
                >
                  <p className="text-xs font-medium text-slate-400">
                    {event.allDay ? 'All day' : formatTime(event.startTime)}
                  </p>
                  <p className="text-sm font-semibold text-slate-800">{event.title}</p>
                  {event.space && <p className="text-xs text-slate-400">{event.space}</p>}
                </button>
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}
