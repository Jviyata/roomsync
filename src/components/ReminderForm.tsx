import { useState } from 'react'
import type { FormEvent } from 'react'
import Modal from './Modal'
import ConfirmDialog from './ConfirmDialog'
import { useApp } from '../context/AppContext'
import { useToast } from '../context/ToastContext'
import type { Priority, Reminder } from '../types'
import { todayISO } from '../utils/date'

interface ReminderFormProps {
  initialReminder?: Reminder
  onClose: () => void
}

const TEMPLATES = [
  'Take the trash out',
  'Clean the kitchen',
  'Bills are due',
  'Turn off the lights',
  'Quiet hours reminder',
  'Clean the bathroom',
]

const PRIORITIES: Priority[] = ['low', 'medium', 'high']

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-300'
const labelClass = 'mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500'

export default function ReminderForm({ initialReminder, onClose }: ReminderFormProps) {
  const { addReminder, updateReminder, deleteReminder } = useApp()
  const { showToast } = useToast()
  const isEdit = Boolean(initialReminder)

  const [text, setText] = useState(initialReminder?.text ?? '')
  const [priority, setPriority] = useState<Priority>(initialReminder?.priority ?? 'medium')
  const [template, setTemplate] = useState('')
  const [error, setError] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!text.trim()) {
      setError('Reminder message is required.')
      return
    }
    setError('')

    try {
      if (isEdit && initialReminder) {
        updateReminder({ ...initialReminder, text: text.trim(), priority })
        showToast('Reminder updated')
      } else {
        addReminder({
          text: text.trim(),
          priority,
          completed: false,
          sender: 'Viyata',
          createdAt: todayISO(),
        })
        showToast('Reminder added')
      }
      onClose()
    } catch {
      setError('Something went wrong saving this reminder. Please try again.')
    }
  }

  return (
    <Modal title={isEdit ? 'Edit Reminder' : 'Add Reminder'} onClose={onClose} maxWidth="max-w-md">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {!isEdit && (
          <div>
            <label className={labelClass} htmlFor="reminder-template">
              Use Template <span className="normal-case text-slate-400">(optional)</span>
            </label>
            <select
              id="reminder-template"
              value={template}
              onChange={(e) => {
                setTemplate(e.target.value)
                if (e.target.value) setText(e.target.value)
              }}
              className={inputClass}
            >
              <option value="">Choose a template…</option>
              {TEMPLATES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className={labelClass} htmlFor="reminder-text">
            Reminder Message
          </label>
          <textarea
            id="reminder-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder="e.g. Take the bins out"
            className={inputClass}
          />
          {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
        </div>

        <div>
          <label className={labelClass}>Priority</label>
          <div className="flex gap-2">
            {PRIORITIES.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold capitalize transition ${
                  priority === p
                    ? p === 'high'
                      ? 'bg-rose-600 text-white'
                      : p === 'medium'
                        ? 'bg-amber-500 text-white'
                        : 'bg-emerald-600 text-white'
                    : 'bg-surface-100 text-slate-500 hover:bg-surface-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 pt-1">
          {isEdit ? (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="rounded-full px-4 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50 active:scale-95"
            >
              Delete
            </button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full bg-brand-700 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-800 active:scale-95"
            >
              {isEdit ? 'Update Reminder' : 'Add Reminder'}
            </button>
          </div>
        </div>
      </form>

      {confirmDelete && initialReminder && (
        <ConfirmDialog
          title="Delete this reminder?"
          message="This reminder will be removed for everyone in the household."
          onCancel={() => setConfirmDelete(false)}
          onConfirm={() => {
            deleteReminder(initialReminder.id)
            showToast('Reminder deleted')
            setConfirmDelete(false)
            onClose()
          }}
        />
      )}
    </Modal>
  )
}
