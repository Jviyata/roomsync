import { NavLink, useLocation } from 'react-router-dom'
import { PRIMARY_NAV, SPACES_NAV } from '../config/nav'
import { HelpIcon, SettingsIcon } from './Icons'
import { useApp } from '../context/AppContext'
import { getIncompleteReminders, getTodayGuests } from '../utils/selectors'

interface SidebarProps {
  onOpenSettings: () => void
  onOpenHelp: () => void
  onInvite: () => void
}

export default function Sidebar({ onOpenSettings, onOpenHelp, onInvite }: SidebarProps) {
  const { state } = useApp()
  const location = useLocation()
  const reminderCount = getIncompleteReminders(state.reminders).length
  const guestCount = getTodayGuests(state.guests).length
  const isSpacesActive = location.pathname === '/' && location.hash === '#spaces'

  return (
    <aside className="sticky top-0 hidden h-screen shrink-0 py-4 pl-4 md:flex lg:py-6 lg:pl-6">
      <div className="flex w-[76px] flex-col overflow-y-auto rounded-3xl bg-white/80 p-3 card-shadow ring-1 ring-slate-100 backdrop-blur-sm lg:w-64 lg:p-5">
        <div className="mb-6 flex items-center justify-center px-1 lg:justify-start lg:px-1">
          <span className="hidden text-xl font-extrabold tracking-tight text-slate-900 lg:block">Viyata</span>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-700 text-sm font-bold text-white lg:hidden">
            V
          </span>
        </div>

        <nav className="flex flex-col gap-1" aria-label="Primary">
          {PRIMARY_NAV.map((item) => {
            const badge =
              item.label === 'Reminders' ? reminderCount : item.label === 'Guests' ? guestCount : 0
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `group relative flex items-center justify-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors lg:justify-start ${
                    isActive
                      ? 'bg-brand-50 text-brand-800'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      className={`h-5 w-5 shrink-0 ${isActive ? 'text-brand-700' : 'text-slate-400 group-hover:text-slate-600'}`}
                    />
                    <span className="hidden lg:block">{item.label}</span>
                    {badge > 0 && (
                      <span
                        className={`ml-auto hidden h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold lg:flex ${
                          isActive ? 'bg-brand-700 text-white' : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {badge}
                      </span>
                    )}
                    {badge > 0 && (
                      <span className="absolute right-2 top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-600 px-1 text-[9px] font-bold text-white lg:hidden">
                        {badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            )
          })}
          <NavLink
            to={SPACES_NAV.path}
            className={`group relative flex items-center justify-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors lg:justify-start ${
              isSpacesActive ? 'bg-brand-50 text-brand-800' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <SPACES_NAV.icon
              className={`h-5 w-5 shrink-0 ${isSpacesActive ? 'text-brand-700' : 'text-slate-400 group-hover:text-slate-600'}`}
            />
            <span className="hidden lg:block">{SPACES_NAV.label}</span>
          </NavLink>
        </nav>

        <div className="my-4 border-t border-slate-100" />

        <nav className="flex flex-col gap-1" aria-label="Secondary">
          <button
            type="button"
            onClick={onOpenSettings}
            className="flex items-center justify-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-800 lg:justify-start"
          >
            <SettingsIcon className="h-5 w-5 shrink-0 text-slate-400" />
            <span className="hidden lg:block">Settings</span>
          </button>
          <button
            type="button"
            onClick={onOpenHelp}
            className="flex items-center justify-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-800 lg:justify-start"
          >
            <HelpIcon className="h-5 w-5 shrink-0 text-slate-400" />
            <span className="hidden lg:block">Help</span>
          </button>
        </nav>

        <div className="mt-auto hidden pt-6 lg:block">
          <div className="rounded-2xl bg-gradient-to-br from-brand-50 via-brand-100 to-rose-100 p-4 ring-1 ring-brand-100">
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-white/70 text-brand-700 shadow-sm">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-5 w-5">
                <path d="M3 10.5 12 3l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-slate-800">A calmer home together</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Tools for a more connected living experience.
            </p>
            <button
              type="button"
              onClick={onInvite}
              className="mt-3 w-full rounded-full bg-brand-800 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-brand-900 active:scale-95"
            >
              Invite a roommate
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}
