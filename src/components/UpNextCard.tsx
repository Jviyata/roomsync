import { useNavigate } from 'react-router-dom'
import { ArrowRightIcon, CalendarIcon } from './Icons'
import { formatTime } from '../utils/date'
import type { HouseholdEvent } from '../types'
import EmptyState from './EmptyState'

interface UpNextCardProps {
  event: HouseholdEvent | null
}

export default function UpNextCard({ event }: UpNextCardProps) {
  const navigate = useNavigate()

  return (
    <div className="rounded-3xl bg-white p-5 card-shadow ring-1 ring-slate-100">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-brand-700">
            <CalendarIcon className="h-4 w-4" />
          </span>
          <h3 className="text-sm font-semibold text-slate-800">Up Next</h3>
        </div>
        <button
          type="button"
          onClick={() => navigate('/calendar')}
          className="text-xs font-medium text-slate-400 transition hover:text-brand-700"
        >
          View all
        </button>
      </div>

      {event ? (
        <button
          type="button"
          onClick={() => navigate('/calendar')}
          className="flex w-full items-center justify-between rounded-2xl bg-surface-100 px-4 py-3.5 text-left transition hover:bg-surface-200 active:scale-[0.99]"
        >
          <div>
            <p className="text-sm font-semibold text-slate-900">{event.title}</p>
            <p className="mt-0.5 text-xs text-slate-500">
              {event.allDay ? 'All day' : formatTime(event.startTime)} · {event.space}
            </p>
          </div>
          <ArrowRightIcon className="h-4 w-4 shrink-0 text-slate-400" />
        </button>
      ) : (
        <EmptyState title="No events" message="Nothing planned yet." icon="📅" />
      )}
    </div>
  )
}
