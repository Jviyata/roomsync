import { useState } from 'react'
import type { Reminder } from '../types'
import { useApp } from '../context/AppContext'
import { useToast } from '../context/ToastContext'
import ConfirmDialog from './ConfirmDialog'
import { CheckIcon, EditIcon, TrashIcon } from './Icons'
import { formatShortDate } from '../utils/date'

interface ReminderCardProps {
  reminder: Reminder
  onEdit: () => void
}

const PRIORITY_STYLE: Record<Reminder['priority'], string> = {
  high: 'bg-rose-50 text-rose-700',
  medium: 'bg-amber-50 text-amber-700',
  low: 'bg-emerald-50 text-emerald-700',
}

export default function ReminderCard({ reminder, onEdit }: ReminderCardProps) {
  const { toggleReminder, deleteReminder } = useApp()
  const { showToast } = useToast()
  const [confirmDelete, setConfirmDelete] = useState(false)

  const handleToggle = () => {
    toggleReminder(reminder.id)
    showToast(reminder.completed ? 'Marked as active' : 'Reminder completed')
  }

  return (
    <div
      className={`flex items-start gap-3 rounded-2xl bg-white p-4 card-shadow ring-1 transition ${
        reminder.completed ? 'ring-slate-100 opacity-70' : 'ring-slate-100 hover:ring-brand-100'
      }`}
    >
      <button
        type="button"
        onClick={handleToggle}
        aria-pressed={reminder.completed}
        aria-label={reminder.completed ? 'Mark active again' : 'Mark complete'}
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition active:scale-90 ${
          reminder.completed
            ? 'border-brand-600 bg-brand-600 text-white'
            : 'border-slate-300 text-transparent hover:border-brand-400'
        }`}
      >
        <CheckIcon className="h-3.5 w-3.5" />
      </button>

      <div className="min-w-0 flex-1">
        <p className={`text-sm font-medium text-slate-800 ${reminder.completed ? 'line-through text-slate-400' : ''}`}>
          {reminder.text}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ${PRIORITY_STYLE[reminder.priority]}`}>
            {reminder.priority} priority
          </span>
          <span className="text-[11px] text-slate-400">
            {reminder.sender} · {formatShortDate(reminder.createdAt)}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={onEdit}
          aria-label="Edit reminder"
          className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 active:scale-90"
        >
          <EditIcon className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => setConfirmDelete(true)}
          aria-label="Delete reminder"
          className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 active:scale-90"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>

      {confirmDelete && (
        <ConfirmDialog
          title="Delete this reminder?"
          message="This reminder will be removed for everyone in the household."
          onCancel={() => setConfirmDelete(false)}
          onConfirm={() => {
            deleteReminder(reminder.id)
            showToast('Reminder deleted')
            setConfirmDelete(false)
          }}
        />
      )}
    </div>
  )
}
