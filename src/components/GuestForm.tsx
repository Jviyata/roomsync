import { useState } from 'react'
import type { FormEvent } from 'react'
import Modal from './Modal'
import ConfirmDialog from './ConfirmDialog'
import TagInput from './TagInput'
import { useApp } from '../context/AppContext'
import { useToast } from '../context/ToastContext'
import { RELATIONSHIPS } from '../types'
import type { Guest, Relationship } from '../types'
import { todayISO } from '../utils/date'

interface GuestFormProps {
  initialGuest?: Guest
  initialDate?: string
  onClose: () => void
}

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-300'
const labelClass = 'mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500'

export default function GuestForm({ initialGuest, initialDate, onClose }: GuestFormProps) {
  const { addGuest, updateGuest, deleteGuest } = useApp()
  const { showToast } = useToast()
  const isEdit = Boolean(initialGuest)

  const [name, setName] = useState(initialGuest?.name ?? '')
  const [relationship, setRelationship] = useState<Relationship>(initialGuest?.relationship ?? 'Friend')
  const [visitDate, setVisitDate] = useState(initialGuest?.visitDate ?? initialDate ?? todayISO())
  const [firstTime, setFirstTime] = useState(initialGuest?.firstTime ?? false)
  const [arrivalTime, setArrivalTime] = useState(initialGuest?.arrivalTime ?? '')
  const [departureTime, setDepartureTime] = useState(initialGuest?.departureTime ?? '')
  const [tags, setTags] = useState<string[]>(initialGuest?.tags ?? [])
  const [notes, setNotes] = useState(initialGuest?.notes ?? '')

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [formError, setFormError] = useState('')

  const validate = (): boolean => {
    const next: Record<string, string> = {}
    if (!name.trim()) next.name = 'Guest name is required.'
    if (!visitDate) next.visitDate = 'Visit date is required.'
    if (!arrivalTime) next.arrivalTime = 'Arrival time is required.'
    if (arrivalTime && departureTime && departureTime <= arrivalTime) {
      next.departureTime = 'Departure must be after arrival.'
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
        name: name.trim(),
        relationship,
        visitDate,
        firstTime,
        arrivalTime,
        departureTime,
        tags,
        notes: notes.trim(),
      }
      if (isEdit && initialGuest) {
        updateGuest({ ...initialGuest, ...payload })
        showToast('Guest updated')
      } else {
        addGuest(payload)
        showToast('Guest added')
      }
      onClose()
    } catch {
      setFormError('Something went wrong saving this guest. Please try again.')
    }
  }

  return (
    <Modal title={isEdit ? 'Edit Guest' : 'Add Guest'} onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label className={labelClass} htmlFor="guest-name">
            Name
          </label>
          <input
            id="guest-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Jeremiah Fisher"
            className={inputClass}
          />
          {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass} htmlFor="guest-relationship">
              Relationship
            </label>
            <select
              id="guest-relationship"
              value={relationship}
              onChange={(e) => setRelationship(e.target.value as Relationship)}
              className={inputClass}
            >
              {RELATIONSHIPS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="guest-date">
              Visit Date
            </label>
            <input
              id="guest-date"
              type="date"
              value={visitDate}
              onChange={(e) => setVisitDate(e.target.value)}
              className={inputClass}
            />
            {errors.visitDate && <p className="mt-1 text-xs text-rose-600">{errors.visitDate}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass} htmlFor="guest-arrival">
              Arrival Time
            </label>
            <input
              id="guest-arrival"
              type="time"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
              className={inputClass}
            />
            {errors.arrivalTime && <p className="mt-1 text-xs text-rose-600">{errors.arrivalTime}</p>}
          </div>
          <div>
            <label className={labelClass} htmlFor="guest-departure">
              Departure Time <span className="normal-case text-slate-400">(optional)</span>
            </label>
            <input
              id="guest-departure"
              type="time"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
              className={inputClass}
            />
            {errors.departureTime && <p className="mt-1 text-xs text-rose-600">{errors.departureTime}</p>}
          </div>
        </div>

        <label className="flex items-center gap-2.5 text-sm font-medium text-slate-600">
          <button
            type="button"
            role="switch"
            aria-checked={firstTime}
            onClick={() => setFirstTime((v) => !v)}
            className={`relative h-6 w-11 shrink-0 rounded-full transition ${firstTime ? 'bg-brand-600' : 'bg-slate-200'}`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${firstTime ? 'left-[22px]' : 'left-0.5'}`}
            />
          </button>
          First-Time Visitor
        </label>

        <div>
          <label className={labelClass}>Tags</label>
          <TagInput value={tags} onChange={setTags} placeholder="e.g. Dinner Guest" />
        </div>

        <div>
          <label className={labelClass} htmlFor="guest-notes">
            Notes <span className="normal-case text-slate-400">(optional)</span>
          </label>
          <textarea
            id="guest-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Dinner plans, allergies, parking notes…"
            className={inputClass}
          />
        </div>

        {formError && <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{formError}</p>}

        <div className="flex items-center justify-between gap-2 pt-1">
          {isEdit ? (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="rounded-full px-4 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50 active:scale-95"
            >
              Delete Guest
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
              {isEdit ? 'Update Guest' : 'Add Guest'}
            </button>
          </div>
        </div>
      </form>

      {confirmDelete && initialGuest && (
        <ConfirmDialog
          title="Delete this guest?"
          message={`"${initialGuest.name}" will be removed from the visitor log.`}
          onCancel={() => setConfirmDelete(false)}
          onConfirm={() => {
            deleteGuest(initialGuest.id)
            showToast('Guest deleted')
            setConfirmDelete(false)
            onClose()
          }}
        />
      )}
    </Modal>
  )
}
