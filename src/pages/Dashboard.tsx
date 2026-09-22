import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import HouseholdCard from '../components/HouseholdCard'
import SupportingMessageCard from '../components/SupportingMessageCard'
import SharedSpacesCard from '../components/SharedSpacesCard'
import UpNextCard from '../components/UpNextCard'
import ImportantReminderCard from '../components/ImportantReminderCard'
import ScheduleTimeline from '../components/ScheduleTimeline'
import RecentGuestsCard from '../components/RecentGuestsCard'
import LoadingState from '../components/LoadingState'
import { formatFullToday, greeting } from '../utils/date'
import {
  getEventsForDate,
  getIncompleteReminders,
  getTodayGuests,
  getUpcomingGuests,
  getUpNextEvent,
} from '../utils/selectors'
import { todayISO } from '../utils/date'

type Tab = 'Today' | 'Guests' | 'Reminders' | 'Spaces'
const TABS: Tab[] = ['Today', 'Guests', 'Reminders', 'Spaces']

export default function Dashboard() {
  const { state } = useApp()
  const location = useLocation()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>('Today')

  const topRef = useRef<HTMLDivElement>(null)
  const remindersRef = useRef<HTMLDivElement>(null)
  const guestsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 500)
    return () => window.clearTimeout(t)
  }, [])

  useEffect(() => {
    if (location.hash === '#spaces') {
      window.setTimeout(() => {
        document.getElementById('spaces')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        setActiveTab('Spaces')
      }, 60)
    }
  }, [location.hash])

  const handleTab = (tab: Tab) => {
    setActiveTab(tab)
    if (tab === 'Today') topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    if (tab === 'Reminders') remindersRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    if (tab === 'Guests') guestsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    if (tab === 'Spaces') document.getElementById('spaces')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const today = todayISO()
  const todaysEvents = getEventsForDate(state.events, today).slice(0, 4)
  const upNext = getUpNextEvent(state.events)
  const incompleteReminders = getIncompleteReminders(state.reminders)
  const todayGuests = getTodayGuests(state.guests)
  const upcomingGuests = getUpcomingGuests(state.guests)

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <div className="h-10 w-64 animate-pulse rounded-full bg-slate-200/60" />
          <LoadingState rows={2} />
        </div>
        <LoadingState rows={3} />
      </div>
    )
  }

  return (
    <div ref={topRef} className="scroll-mt-24">
      <div className="animate-fade-up">
        <h1 className="text-3xl font-extrabold leading-[1.05] tracking-tight text-slate-900 sm:text-4xl lg:text-[2.75rem]">
          {greeting()}, Viyata
          <br className="hidden sm:block" /> Welcome home
        </h1>
        <p className="mt-2 text-sm font-medium text-slate-400">{formatFullToday()}</p>

        <div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto pb-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => handleTab(tab)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeTab === tab
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-surface-100 text-slate-500 hover:bg-surface-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
        <div className="min-w-0 animate-fade-up">
          <HouseholdCard />
          <SupportingMessageCard />
          <div className="mt-4">
            <SharedSpacesCard />
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-4 animate-fade-up">
          <UpNextCard event={upNext} />
          <div ref={remindersRef} className="scroll-mt-24">
            <ImportantReminderCard
              reminder={incompleteReminders[0] ?? null}
              moreCount={Math.max(0, incompleteReminders.length - 1)}
            />
          </div>
          <ScheduleTimeline events={todaysEvents} nextEventId={upNext?.id} />
          <div ref={guestsRef} className="scroll-mt-24">
            <RecentGuestsCard todayGuests={todayGuests} upcomingGuests={upcomingGuests} />
          </div>
        </div>
      </div>
    </div>
  )
}
