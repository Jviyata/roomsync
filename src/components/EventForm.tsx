import { useState } from 'react'
import type { FormEvent } from 'react'
import Modal from './Modal'
import ConfirmDialog from './ConfirmDialog'
import TagInput from './TagInput'
import { useApp } from '../context/AppContext'
import { useToast } from '../context/ToastContext'
import { SPACES } from '../types'
import type { HouseholdEvent, Space } from '../types'

interface EventFormProps {
  initialEvent?: HouseholdEvent
  initialDate?: string
  onClose: () => void
}

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-300'
const labelClass = 'mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500'

export default function EventForm({ initialEvent, initialDate, onClose }: EventFormProps) {
  const { addEvent, updateEvent, deleteEvent } = useApp()
  const { showToast } = useToast()
  const isEdit = Boolean(initialEvent)

  const [title, setTitle] = useState(initialEvent?.title ?? '')
  const [space, setSpace] = useState<Space>(initialEvent?.space ?? 'Kitchen')
  const [date, setDate] = useState(initialEvent?.date ?? initialDate ?? '')
  const [allDay, setAllDay] = useState(initialEvent?.allDay ?? false)
  const [startTime, setStartTime] = useState(initialEvent?.startTime ?? '')
  const [endTime, setEndTime] = useState(initialEvent?.endTime ?? '')
  const [attendees, setAttendees] = useState<string[]>(initialEvent?.attendees ?? [])
  const [description, setDescription] = useState(initialEvent?.description ?? '')

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [formError, setFormError] = useState('')

  const validate = (): boolean => {
    const next: Record<string, string> = {}
    if (!title.trim()) next.title = 'Title is required.'
    if (!date) next.date = 'Date is required.'
    if (!allDay && !startTime) next.startTime = 'Start time is required unless the event is all day.'
    if (!allDay && startTime && endTime && endTime <= startTime) {
      next.endTime = 'End time must be after the start time.'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setFormError('')
    if (!validate()) return

    try {
      const payload = {
        title: title.trim(),
        space,
        date,
        allDay,
        startTime: allDay ? '' : startTime,
        endTime: allDay ? '' : endTime,
        attendees,
        description: description.trim(),
      }
      if (isEdit && initialEvent) {
        updateEvent({ ...initialEvent, ...payload })
        showToast('Event updated')
      } else {
        addEvent(payload)
        showToast('Event created')
      }
      onClose()
    } catch {
      setFormError('Something went wrong saving this event. Please try again.')
    }
  }

  return (
    <Modal title={isEdit ? 'Edit Event' : 'Add Event'} onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label className={labelClass} htmlFor="event-title">
            Title
          </label>
          <input
            id="event-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Dinner Preparation"
            className={inputClass}
          />
          {errors.title && <p className="mt-1 text-xs text-rose-600">{errors.title}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass} htmlFor="event-space">
              Space
            </label>
            <select
              id="event-space"
              value={space}
              onChange={(e) => setSpace(e.target.value as Space)}
              className={inputClass}
            >
              {SPACES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="event-date">
              Date
            </label>
            <input
              id="event-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputClass}
            />
            {errors.date && <p className="mt-1 text-xs text-rose-600">{errors.date}</p>}
          </div>
        </div>

        <label className="flex items-center gap-2.5 text-sm font-medium text-slate-600">
          <button
            type="button"
            role="switch"
            aria-checked={allDay}
            onClick={() => setAllDay((v) => !v)}
            className={`relative h-6 w-11 shrink-0 rounded-full transition ${allDay ? 'bg-brand-600' : 'bg-slate-200'}`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${allDay ? 'left-[22px]' : 'left-0.5'}`}
            />
          </button>
          All Day
        </label>

        {!allDay && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass} htmlFor="event-start">
                Start Time
              </label>
              <input
                id="event-start"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className={inputClass}
              />
              {errors.startTime && <p className="mt-1 text-xs text-rose-600">{errors.startTime}</p>}
            </div>
            <div>
              <label className={labelClass} htmlFor="event-end">
                End Time <span className="normal-case text-slate-400">(optional)</span>
              </label>
              <input
                id="event-end"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className={inputClass}
              />
              {errors.endTime && <p className="mt-1 text-xs text-rose-600">{errors.endTime}</p>}
            </div>
          </div>
        )}

        <div>
          <label className={labelClass}>Attendees</label>
          <TagInput value={attendees} onChange={setAttendees} placeholder="Add a name and press Enter" />
        </div>

        <div>
          <label className={labelClass} htmlFor="event-description">
            Description <span className="normal-case text-slate-400">(optional)</span>
          </label>
          <textarea
            id="event-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Any extra details worth sharing…"
            className={inputClass}
          />
        </div>

        {formError && (
          <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{formError}</p>
        )}

        <div className="flex items-center justify-between gap-2 pt-1">
          {isEdit ? (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="rounded-full px-4 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50 active:scale-95"
            >
              Delete Event
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
              {isEdit ? 'Update Event' : 'Save Event'}
            </button>
          </div>
        </div>
      </form>

      {confirmDelete && initialEvent && (
        <ConfirmDialog
          title="Delete this event?"
          message={`"${initialEvent.title}" will be removed from the calendar. This can't be undone.`}
          onCancel={() => setConfirmDelete(false)}
          onConfirm={() => {
            deleteEvent(initialEvent.id)
            showToast('Event deleted')
            setConfirmDelete(false)
            onClose()
          }}
        />
      )}
    </Modal>
  )
}
