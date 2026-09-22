import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { useToast } from '../context/ToastContext'
import { LockIcon, UnlockIcon } from './Icons'

export default function DoorLockToggle() {
  const { state, toggleDoor } = useApp()
  const { showToast } = useToast()
  const [pulse, setPulse] = useState(0)
  const locked = state.homeStatus.doorLocked

  const handleToggle = () => {
    toggleDoor()
    setPulse((p) => p + 1)
    showToast(locked ? 'Front door unlocked' : 'Front door locked', locked ? 'error' : 'success')
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-pressed={locked}
      aria-label={locked ? 'Front door locked — tap to unlock' : 'Front door unlocked — tap to lock'}
      className={`flex min-w-0 flex-col gap-2 rounded-2xl px-3.5 py-3 text-left ring-1 transition active:scale-[0.98] sm:px-4 ${
        locked
          ? 'bg-surface-100 ring-slate-100/80 hover:ring-slate-200'
          : 'bg-amber-50 ring-amber-200 hover:ring-amber-300'
      }`}
    >
      <div className={`flex items-center gap-1.5 ${locked ? 'text-slate-400' : 'text-amber-600'}`}>
        {locked ? <LockIcon className="h-4 w-4" /> : <UnlockIcon className="h-4 w-4" />}
        <span className="text-xs font-medium">Door</span>
      </div>
      <span
        key={pulse}
        className={`animate-pop text-lg font-bold ${locked ? 'text-slate-900' : 'text-amber-700'}`}
      >
        {locked ? 'Locked' : 'Unlocked'}
      </span>
    </button>
  )
}
