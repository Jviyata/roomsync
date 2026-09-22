import { useEffect, useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import GuestCard from '../components/GuestCard'
import GuestForm from '../components/GuestForm'
import EmptyState from '../components/EmptyState'
import LoadingState from '../components/LoadingState'
import { PlusIcon } from '../components/Icons'
import { getPastGuests, getTodayGuests, getUpcomingGuests } from '../utils/selectors'
import type { Guest } from '../types'

type Tab = 'today' | 'upcoming' | 'past'

export default function GuestsPage() {
  const { state } = useApp()
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<Tab>('today')
  const [formState, setFormState] = useState<{ open: boolean; guest?: Guest }>({ open: false })

  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 400)
    return () => window.clearTimeout(t)
  }, [])

  const today = useMemo(() => getTodayGuests(state.guests), [state.guests])
  const upcoming = useMemo(() => getUpcomingGuests(state.guests), [state.guests])
  const past = useMemo(() => getPastGuests(state.guests), [state.guests])

  const list = tab === 'today' ? today : tab === 'upcoming' ? upcoming : past

  const openAdd = () => setFormState({ open: true })
  const openEdit = (guest: Guest) => setFormState({ open: true, guest })
  const closeForm = () => setFormState({ open: false })

  const TABS: { key: Tab; label: string; count: number }[] = [
    { key: 'today', label: 'Today', count: today.length },
    { key: 'upcoming', label: 'Upcoming', count: upcoming.length },
    { key: 'past', label: 'Past', count: past.length },
  ]

  const emptyCopy: Record<Tab, { title: string; message: string }> = {
    today: { title: 'No guests today', message: 'No guests expected today.' },
    upcoming: { title: 'No upcoming guests', message: 'No upcoming visitors.' },
    past: { title: 'No past guests', message: 'No visits logged yet.' },
  }

  return (
    <div className="animate-fade-up">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Guests</h1>
          <p className="mt-1 text-sm text-slate-400">Know who's coming, without the awkward surprise.</p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="flex items-center justify-center gap-1.5 rounded-full bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-800 active:scale-95"
        >
          <PlusIcon className="h-4 w-4" />
          Add Guest
        </button>
      </div>

      <div className="mt-5 flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition ${
              tab === t.key ? 'bg-slate-900 text-white shadow-sm' : 'bg-surface-100 text-slate-500 hover:bg-surface-200'
            }`}
          >
            {t.label}
            <span
              className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-bold ${
                tab === t.key ? 'bg-white/20' : 'bg-white text-slate-500'
              }`}
            >
              {t.count}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <div className="sm:col-span-2 xl:col-span-3">
            <LoadingState rows={3} />
          </div>
        ) : list.length === 0 ? (
          <div className="sm:col-span-2 xl:col-span-3">
            <EmptyState title={emptyCopy[tab].title} message={emptyCopy[tab].message} icon="🧑‍🤝‍🧑" />
          </div>
        ) : (
          list.map((guest) => <GuestCard key={guest.id} guest={guest} onEdit={() => openEdit(guest)} />)
        )}
      </div>

      {formState.open && <GuestForm initialGuest={formState.guest} onClose={closeForm} />}
    </div>
  )
}
