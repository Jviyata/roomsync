import { useNavigate } from 'react-router-dom'
import { ChevronRightIcon, GuestsIcon } from './Icons'
import type { Guest } from '../types'
import { guestStatusLabel } from '../utils/selectors'
import EmptyState from './EmptyState'

interface RecentGuestsCardProps {
  todayGuests: Guest[]
  upcomingGuests: Guest[]
}

function initials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default function RecentGuestsCard({ todayGuests, upcomingGuests }: RecentGuestsCardProps) {
  const navigate = useNavigate()
  const shown = [...todayGuests.slice(0, 2), ...upcomingGuests.slice(0, Math.max(0, 3 - todayGuests.length))].slice(0, 3)
  const extra = todayGuests.length + upcomingGuests.length - shown.length

  return (
    <div className="rounded-3xl bg-white p-5 card-shadow ring-1 ring-slate-100">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-brand-700">
            <GuestsIcon className="h-4 w-4" />
          </span>
          <h3 className="text-sm font-semibold text-slate-800">Recent Guests</h3>
        </div>
        <button
          type="button"
          onClick={() => navigate('/guests')}
          className="text-xs font-medium text-slate-400 transition hover:text-brand-700"
        >
          View all
        </button>
      </div>

      {shown.length === 0 ? (
        <EmptyState title="No guests today" message="No guests expected today." icon="🧑‍🤝‍🧑" />
      ) : (
        <div className="flex flex-col gap-1">
          {shown.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => navigate('/guests')}
              className="flex items-center gap-3 rounded-xl px-2 py-2 text-left transition hover:bg-slate-50"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-200 text-xs font-semibold text-slate-600">
                {initials(g.name)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-slate-800">{g.name}</span>
                <span className="block text-xs text-slate-400">{guestStatusLabel(g)}</span>
              </span>
              <ChevronRightIcon className="h-4 w-4 shrink-0 text-slate-300" />
            </button>
          ))}
          {extra > 0 && (
            <p className="px-2 pt-1 text-xs text-slate-400">+{extra} more guest{extra === 1 ? '' : 's'}</p>
          )}
        </div>
      )}
    </div>
  )
}
