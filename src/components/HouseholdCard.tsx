import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TemperatureControl from './TemperatureControl'
import DoorLockToggle from './DoorLockToggle'
import { ArrowRightIcon, GuestsIcon, HomeIcon, SpacesIcon } from './Icons'
import { useApp } from '../context/AppContext'
import { getAvailableSpacesCount, getTodayGuests } from '../utils/selectors'

const APARTMENT_IMAGE =
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80'

export default function HouseholdCard() {
  const { state } = useApp()
  const navigate = useNavigate()
  const [imageFailed, setImageFailed] = useState(false)
  const todayGuestCount = getTodayGuests(state.guests).length
  const { available, total } = getAvailableSpacesCount(state.events)

  const scrollToSpaces = () => {
    if (window.location.pathname !== '/') {
      navigate('/#spaces')
      return
    }
    document.getElementById('spaces')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="@container rounded-3xl bg-white p-5 card-shadow ring-1 ring-slate-100 sm:p-6">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-100 text-slate-600">
          <HomeIcon className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-base font-bold text-slate-900 sm:text-lg">Doetri and Viyata's Apartment</h2>
          <p className="text-sm text-slate-400">Shared apartment overview</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 @md:grid-cols-4">
        <TemperatureControl />
        <DoorLockToggle />
        <button
          type="button"
          onClick={() => navigate('/guests')}
          className="flex min-w-0 flex-col gap-2 rounded-2xl bg-surface-100 px-3.5 py-3 text-left ring-1 ring-slate-100/80 transition hover:ring-slate-200 active:scale-[0.98] sm:px-4"
        >
          <div className="flex items-center gap-1.5 text-slate-400">
            <GuestsIcon className="h-4 w-4" />
            <span className="text-xs font-medium">Guests</span>
          </div>
          <span className="text-2xl font-bold tabular-nums text-slate-900">{todayGuestCount}</span>
          <span className="-mt-1.5 text-xs text-slate-400">{todayGuestCount === 1 ? 'Guest' : 'Guests'} today</span>
        </button>
        <button
          type="button"
          onClick={scrollToSpaces}
          className="flex min-w-0 flex-col gap-2 rounded-2xl bg-surface-100 px-3.5 py-3 text-left ring-1 ring-slate-100/80 transition hover:ring-slate-200 active:scale-[0.98] sm:px-4"
        >
          <div className="flex items-center gap-1.5 text-slate-400">
            <SpacesIcon className="h-4 w-4" />
            <span className="text-xs font-medium">Spaces</span>
          </div>
          <span className="text-2xl font-bold tabular-nums text-slate-900">
            {available}/{total}
          </span>
          <span className="-mt-1.5 text-xs text-slate-400">Available</span>
        </button>
      </div>

      <div className="relative mt-5 overflow-hidden rounded-2xl">
        {!imageFailed ? (
          <img
            src={APARTMENT_IMAGE}
            alt="Warm, sunlit living room with a neutral sofa and plants"
            className="h-48 w-full object-cover sm:h-64 lg:h-72"
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex h-48 w-full items-center justify-center bg-gradient-to-br from-surface-100 via-brand-50 to-surface-200 text-slate-300 sm:h-64 lg:h-72">
            <HomeIcon className="h-12 w-12" />
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
        <button
          type="button"
          onClick={scrollToSpaces}
          className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-700 to-brand-800 py-2.5 pl-4 pr-2.5 text-sm font-semibold text-white shadow-lg transition hover:from-brand-800 hover:to-brand-900 active:scale-95"
        >
          Details
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </span>
        </button>
      </div>
    </div>
  )
}
