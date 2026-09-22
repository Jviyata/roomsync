import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from './Icons'

export type CalendarView = 'month' | 'week' | 'day'

interface CalendarToolbarProps {
  label: string
  view: CalendarView
  onViewChange: (view: CalendarView) => void
  onPrev: () => void
  onNext: () => void
  onToday: () => void
  onAddEvent: () => void
}

const VIEWS: CalendarView[] = ['month', 'week', 'day']

export default function CalendarToolbar({
  label,
  view,
  onViewChange,
  onPrev,
  onNext,
  onToday,
  onAddEvent,
}: CalendarToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 rounded-full bg-white p-1 shadow-sm ring-1 ring-slate-200">
          <button
            type="button"
            onClick={onPrev}
            aria-label="Previous"
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 active:scale-90"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onToday}
            className="rounded-full px-3 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
          >
            Today
          </button>
          <button
            type="button"
            onClick={onNext}
            aria-label="Next"
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 active:scale-90"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
        <h2 className="text-lg font-bold text-slate-900 sm:text-xl">{label}</h2>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex rounded-full bg-surface-100 p-1">
          {VIEWS.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => onViewChange(v)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize transition ${
                view === v ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={onAddEvent}
          className="flex items-center gap-1.5 rounded-full bg-brand-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-800 active:scale-95"
        >
          <PlusIcon className="h-4 w-4" />
          Add Event
        </button>
      </div>
    </div>
  )
}
