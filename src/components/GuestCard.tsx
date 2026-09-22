import { useState } from 'react'
import type { Guest } from '../types'
import { useApp } from '../context/AppContext'
import { useToast } from '../context/ToastContext'
import ConfirmDialog from './ConfirmDialog'
import { ChevronDownIcon, EditIcon, TrashIcon } from './Icons'
import { formatFriendlyDate, formatTime } from '../utils/date'

interface GuestCardProps {
  guest: Guest
  onEdit: () => void
}

function initials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default function GuestCard({ guest, onEdit }: GuestCardProps) {
  const { deleteGuest } = useApp()
  const { showToast } = useToast()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [notesOpen, setNotesOpen] = useState(false)

  return (
    <div className="rounded-2xl bg-white p-4 card-shadow ring-1 ring-slate-100 transition hover:ring-brand-100">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-700">
          {initials(guest.name)}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-slate-900">{guest.name}</p>
            {guest.firstTime && (
              <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-700">
                First visit
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-slate-400">
            {guest.relationship} · {formatFriendlyDate(guest.visitDate)}
          </p>
          <p className="mt-1 text-sm text-slate-600">
            {formatTime(guest.arrivalTime)}
            {guest.departureTime ? ` – ${formatTime(guest.departureTime)}` : ''}
          </p>
          {guest.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {guest.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-surface-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={onEdit}
            aria-label="Edit guest"
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 active:scale-90"
          >
            <EditIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            aria-label="Delete guest"
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 active:scale-90"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {guest.notes && (
        <div className="mt-3 border-t border-slate-100 pt-2">
          <button
            type="button"
            onClick={() => setNotesOpen((v) => !v)}
            className="flex items-center gap-1 text-xs font-semibold text-slate-400 transition hover:text-brand-700"
          >
            <ChevronDownIcon className={`h-3.5 w-3.5 transition-transform ${notesOpen ? 'rotate-180' : ''}`} />
            {notesOpen ? 'Hide notes' : 'Show notes'}
          </button>
          {notesOpen && <p className="mt-1.5 text-sm text-slate-500">{guest.notes}</p>}
        </div>
      )}

      {confirmDelete && (
        <ConfirmDialog
          title="Delete this guest?"
          message={`"${guest.name}" will be removed from the visitor log.`}
          onCancel={() => setConfirmDelete(false)}
          onConfirm={() => {
            deleteGuest(guest.id)
            showToast('Guest deleted')
            setConfirmDelete(false)
          }}
        />
      )}
    </div>
  )
}
