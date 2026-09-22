import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { useToast } from '../context/ToastContext'
import { MinusIcon, PlusIcon, ThermometerIcon } from './Icons'

const MIN_TEMP = 60
const MAX_TEMP = 85

export default function TemperatureControl() {
  const { state, setTemperature } = useApp()
  const { showToast } = useToast()
  const [pulse, setPulse] = useState(0)
  const temp = state.homeStatus.temperature

  const change = (delta: number) => {
    const next = Math.min(MAX_TEMP, Math.max(MIN_TEMP, temp + delta))
    if (next === temp) return
    setTemperature(next)
    setPulse((p) => p + 1)
    showToast(`Temperature set to ${next}°F`)
  }

  return (
    <div className="flex min-w-0 flex-col gap-2 rounded-2xl bg-surface-100 px-3.5 py-3 ring-1 ring-slate-100/80 transition hover:ring-slate-200 sm:px-4">
      <div className="flex items-center gap-1.5 text-slate-400">
        <ThermometerIcon className="h-4 w-4" />
        <span className="text-xs font-medium">Temperature</span>
      </div>
      <div className="flex items-center justify-between gap-1">
        <button
          type="button"
          onClick={() => change(-1)}
          disabled={temp <= MIN_TEMP}
          aria-label="Decrease temperature"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 hover:text-brand-700 active:scale-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <MinusIcon className="h-3.5 w-3.5" />
        </button>
        <span key={pulse} className="animate-pop text-2xl font-bold tabular-nums text-slate-900">
          {temp}°
        </span>
        <button
          type="button"
          onClick={() => change(1)}
          disabled={temp >= MAX_TEMP}
          aria-label="Increase temperature"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 hover:text-brand-700 active:scale-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <PlusIcon className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
