import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { BellIcon, ChevronDownIcon, SearchIcon } from './Icons'
import { formatTime } from '../utils/date'
import { getIncompleteReminders, getTodayGuests } from '../utils/selectors'

type SearchResult = {
  id: string
  label: string
  sublabel: string
  path: string
}

const ROOMMATES = ['Viyata', 'Doetri', 'Alex', 'Sam']

export default function TopBar() {
  const { state } = useApp()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [avatarOpen, setAvatarOpen] = useState(false)
  const [householdOpen, setHouseholdOpen] = useState(false)

  const searchRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)
  const avatarRef = useRef<HTMLDivElement>(null)
  const householdRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const t = e.target as Node
      if (searchRef.current && !searchRef.current.contains(t)) setSearchOpen(false)
      if (notifRef.current && !notifRef.current.contains(t)) setNotifOpen(false)
      if (avatarRef.current && !avatarRef.current.contains(t)) setAvatarOpen(false)
      if (householdRef.current && !householdRef.current.contains(t)) setHouseholdOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const results = useMemo<SearchResult[]>(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    const out: SearchResult[] = []
    for (const e of state.events) {
      if (e.title.toLowerCase().includes(q) || e.space.toLowerCase().includes(q)) {
        out.push({ id: e.id, label: e.title, sublabel: `${e.date} · ${e.space}`, path: '/calendar' })
      }
    }
    for (const r of state.reminders) {
      if (r.text.toLowerCase().includes(q)) {
        out.push({ id: r.id, label: r.text, sublabel: `Reminder · ${r.priority} priority`, path: '/reminders' })
      }
    }
    for (const g of state.guests) {
      if (g.name.toLowerCase().includes(q)) {
        out.push({ id: g.id, label: g.name, sublabel: `Guest · ${g.visitDate}`, path: '/guests' })
      }
    }
    return out.slice(0, 8)
  }, [query, state])

  const incompleteReminders = getIncompleteReminders(state.reminders)
  const todayGuests = getTodayGuests(state.guests)
  const hasNotifications = incompleteReminders.length > 0 || todayGuests.length > 0

  return (
    <div className="flex flex-wrap items-center gap-3 sm:flex-nowrap">
      <div className="relative" ref={householdRef}>
        <button
          type="button"
          onClick={() => setHouseholdOpen((v) => !v)}
          className="flex items-center gap-1.5 rounded-full px-2 py-1.5 text-lg font-semibold text-slate-800 transition hover:bg-white/70 sm:text-xl"
        >
          Viyata's Apt
          <ChevronDownIcon className="h-4 w-4 text-slate-400" />
        </button>
        {householdOpen && (
          <div className="modal-enter absolute left-0 z-30 mt-2 w-56 rounded-2xl bg-white p-2 card-shadow-lg ring-1 ring-slate-100">
            <p className="px-2 pb-1 pt-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Household
            </p>
            {ROOMMATES.map((name) => (
              <div key={name} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-600">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-[11px] font-semibold text-brand-700">
                  {name[0]}
                </span>
                {name}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="order-last w-full sm:order-none sm:ml-auto sm:w-auto sm:flex-1 sm:max-w-sm" ref={searchRef}>
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSearchOpen(true)
            }}
            onFocus={() => setSearchOpen(true)}
            placeholder="Search anything…"
            aria-label="Search"
            className="w-full rounded-full bg-white/80 py-2.5 pl-10 pr-4 text-sm text-slate-700 shadow-sm ring-1 ring-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-300"
          />
          {searchOpen && query.trim() && (
            <div className="modal-enter absolute left-0 right-0 z-30 mt-2 max-h-72 overflow-y-auto rounded-2xl bg-white p-2 card-shadow-lg ring-1 ring-slate-100">
              {results.length === 0 ? (
                <p className="px-3 py-3 text-sm text-slate-400">No results for “{query}”</p>
              ) : (
                results.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => {
                      navigate(r.path)
                      setSearchOpen(false)
                      setQuery('')
                    }}
                    className="flex w-full flex-col items-start rounded-xl px-3 py-2 text-left transition hover:bg-slate-50"
                  >
                    <span className="text-sm font-medium text-slate-800">{r.label}</span>
                    <span className="text-xs text-slate-400">{r.sublabel}</span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2 sm:ml-0">
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotifOpen((v) => !v)}
            aria-label="Notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-white active:scale-95"
          >
            <BellIcon className="h-5 w-5" />
            {hasNotifications && (
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand-600 ring-2 ring-white" />
            )}
          </button>
          {notifOpen && (
            <div className="modal-enter absolute right-0 z-30 mt-2 w-72 rounded-2xl bg-white p-2 card-shadow-lg ring-1 ring-slate-100">
              <p className="px-2 pb-1 pt-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Notifications
              </p>
              {!hasNotifications && <p className="px-2 py-3 text-sm text-slate-400">You're all caught up.</p>}
              {incompleteReminders.slice(0, 3).map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    navigate('/reminders')
                    setNotifOpen(false)
                  }}
                  className="flex w-full items-start gap-2 rounded-xl px-2 py-2 text-left transition hover:bg-slate-50"
                >
                  <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-brand-500" />
                  <span className="text-sm text-slate-700">
                    {r.text}
                    <span className="block text-xs capitalize text-slate-400">{r.priority} priority</span>
                  </span>
                </button>
              ))}
              {todayGuests.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => {
                    navigate('/guests')
                    setNotifOpen(false)
                  }}
                  className="flex w-full items-start gap-2 rounded-xl px-2 py-2 text-left transition hover:bg-slate-50"
                >
                  <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-slate-400" />
                  <span className="text-sm text-slate-700">
                    {g.name} arriving today
                    <span className="block text-xs text-slate-400">at {formatTime(g.arrivalTime)}</span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative" ref={avatarRef}>
          <button
            type="button"
            onClick={() => setAvatarOpen((v) => !v)}
            className="flex items-center gap-1 rounded-full py-0.5 pl-0.5 pr-1.5 transition hover:bg-white/70"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-800 ring-1 ring-white">
              V
            </span>
            <ChevronDownIcon className="hidden h-4 w-4 text-slate-400 sm:block" />
          </button>
          {avatarOpen && (
            <div className="modal-enter absolute right-0 z-30 mt-2 w-44 rounded-2xl bg-white p-1.5 card-shadow-lg ring-1 ring-slate-100">
              <div className="px-2.5 py-2">
                <p className="text-sm font-semibold text-slate-800">Viyata</p>
                <p className="text-xs text-slate-400">viyataruta@gmail.com</p>
              </div>
              <div className="my-1 border-t border-slate-100" />
              <button
                type="button"
                onClick={() => {
                  setAvatarOpen(false)
                  navigate('/')
                }}
                className="w-full rounded-lg px-2.5 py-1.5 text-left text-sm text-slate-600 transition hover:bg-slate-50"
              >
                Go home
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
