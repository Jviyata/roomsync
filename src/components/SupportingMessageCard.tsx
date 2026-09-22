import { LeafIcon } from './Icons'

export default function SupportingMessageCard() {
  return (
    <div className="mt-4 flex flex-col items-start justify-between gap-3 rounded-3xl bg-white p-5 card-shadow ring-1 ring-slate-100 sm:flex-row sm:items-center">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
          <LeafIcon className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-800">A home that works for you</p>
          <p className="text-sm text-slate-400">Shared spaces. Smoother days. A calmer you.</p>
        </div>
      </div>
      <p className="hidden shrink-0 text-xs font-medium text-slate-300 sm:block">Live better together.</p>
    </div>
  )
}
