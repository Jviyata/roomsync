import { useEffect, useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import ReminderCard from '../components/ReminderCard'
import ReminderForm from '../components/ReminderForm'
import EmptyState from '../components/EmptyState'
import LoadingState from '../components/LoadingState'
import { PlusIcon } from '../components/Icons'
import { sortReminders } from '../utils/selectors'
import type { Reminder } from '../types'

type Filter = 'all' | 'active' | 'completed' | 'high' | 'medium' | 'low'

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
  { key: 'high', label: 'High Priority' },
  { key: 'medium', label: 'Medium Priority' },
  { key: 'low', label: 'Low Priority' },
]

export default function RemindersPage() {
  const { state } = useApp()
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Filter>('all')
  const [formState, setFormState] = useState<{ open: boolean; reminder?: Reminder }>({ open: false })

  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 400)
    return () => window.clearTimeout(t)
  }, [])

  const sorted = useMemo(() => sortReminders(state.reminders), [state.reminders])
  const filtered = useMemo(() => {
    switch (filter) {
      case 'active':
        return sorted.filter((r) => !r.completed)
      case 'completed':
        return sorted.filter((r) => r.completed)
      case 'high':
      case 'medium':
      case 'low':
        return sorted.filter((r) => r.priority === filter)
      default:
        return sorted
    }
  }, [sorted, filter])

  const openAdd = () => setFormState({ open: true })
  const openEdit = (reminder: Reminder) => setFormState({ open: true, reminder })
  const closeForm = () => setFormState({ open: false })

  return (
    <div className="animate-fade-up">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Reminders</h1>
          <p className="mt-1 text-sm text-slate-400">Chores, bills, and notices for the household.</p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="flex items-center justify-center gap-1.5 rounded-full bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-800 active:scale-95"
        >
          <PlusIcon className="h-4 w-4" />
          Add Reminder
        </button>
      </div>

      <div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition sm:text-sm ${
              filter === f.key ? 'bg-slate-900 text-white shadow-sm' : 'bg-surface-100 text-slate-500 hover:bg-surface-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-2.5">
        {loading ? (
          <LoadingState rows={4} />
        ) : filtered.length === 0 ? (
          <EmptyState
            title={filter === 'all' ? 'No reminders' : 'Nothing here'}
            message={filter === 'all' ? "You're all caught up." : 'Try a different filter.'}
            icon="🎉"
          />
        ) : (
          filtered.map((reminder) => (
            <ReminderCard key={reminder.id} reminder={reminder} onEdit={() => openEdit(reminder)} />
          ))
        )}
      </div>

      {formState.open && <ReminderForm initialReminder={formState.reminder} onClose={closeForm} />}
    </div>
  )
}
