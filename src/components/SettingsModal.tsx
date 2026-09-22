import { useState } from 'react'
import Modal from './Modal'
import ConfirmDialog from './ConfirmDialog'
import { useToast } from '../context/ToastContext'

interface SettingsModalProps {
  onClose: () => void
}

export default function SettingsModal({ onClose }: SettingsModalProps) {
  const { showToast } = useToast()
  const [confirmReset, setConfirmReset] = useState(false)
  const [unit, setUnit] = useState<'F' | 'C'>('F')

  return (
    <Modal title="Settings" onClose={onClose}>
      <div className="space-y-5">
        <div>
          <p className="text-sm font-semibold text-slate-700">Household</p>
          <p className="mt-1 text-sm text-slate-400">Doetri and Viyata's Apartment</p>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-700">Temperature unit</p>
          <div className="mt-2 inline-flex rounded-full bg-slate-100 p-1">
            {(['F', 'C'] as const).map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => {
                  setUnit(u)
                  showToast(`Temperature unit set to °${u}`)
                }}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  unit === u ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                °{u}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-700">Demo data</p>
          <p className="mt-1 text-sm text-slate-400">
            Reset the household back to its original sample schedule, reminders, and guests.
          </p>
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="mt-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200 active:scale-95"
          >
            Reset demo data
          </button>
        </div>
      </div>

      {confirmReset && (
        <ConfirmDialog
          title="Reset demo data?"
          message="This restores the original sample schedule, reminders, guests, and home status. Anything you've added or changed will be lost."
          confirmLabel="Reset"
          onCancel={() => setConfirmReset(false)}
          onConfirm={() => {
            localStorage.removeItem('roomsync-state-v1')
            setConfirmReset(false)
            showToast('Demo data reset')
            window.setTimeout(() => window.location.reload(), 400)
          }}
        />
      )}
    </Modal>
  )
}
