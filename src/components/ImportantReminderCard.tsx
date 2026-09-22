import { useNavigate } from 'react-router-dom'
import { ChevronRightIcon, TrashIcon } from './Icons'
import type { Reminder } from '../types'
import EmptyState from './EmptyState'

interface ImportantReminderCardProps {
  reminder: Reminder | null
  moreCount: number
}

const PRIORITY_LABEL: Record<Reminder['priority'], string> = {
  high: 'High Priority',
  medium: 'Medium Priority',
  low: 'Low Priority',
}

export default function ImportantReminderCard({ reminder, moreCount }: ImportantReminderCardProps) {
  const navigate = useNavigate()

  if (!reminder) {
    return (
      <div className="rounded-3xl bg-white p-5 card-shadow ring-1 ring-slate-100">
        <EmptyState title="No reminders" message="You're all caught up." icon="🎉" />
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => navigate('/reminders')}
      className="flex w-full items-center gap-3 rounded-3xl bg-white p-4 text-left card-shadow ring-1 ring-slate-100 transition hover:ring-brand-100 active:scale-[0.99]"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
        <TrashIcon className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-slate-900">{reminder.text}</span>
        <span className="mt-0.5 block text-xs text-slate-400">
          {PRIORITY_LABEL[reminder.priority]}
          {moreCount > 0 && ` · +${moreCount} more reminder${moreCount === 1 ? '' : 's'}`}
        </span>
      </span>
      <ChevronRightIcon className="h-4 w-4 shrink-0 text-slate-300" />
    </button>
  )
}
