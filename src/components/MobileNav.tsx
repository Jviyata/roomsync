import { NavLink } from 'react-router-dom'
import { PRIMARY_NAV } from '../config/nav'
import { useApp } from '../context/AppContext'
import { getIncompleteReminders, getTodayGuests } from '../utils/selectors'

export default function MobileNav() {
  const { state } = useApp()
  const reminderCount = getIncompleteReminders(state.reminders).length
  const guestCount = getTodayGuests(state.guests).length

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 flex items-stretch justify-around border-t border-slate-200/80 bg-white/95 px-1 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
    >
      {PRIMARY_NAV.map((item) => {
        const badge =
          item.label === 'Reminders' ? reminderCount : item.label === 'Guests' ? guestCount : 0
        return (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `relative flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition-colors ${
                isActive ? 'text-brand-700' : 'text-slate-400'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className="relative">
                  <item.icon className="h-5 w-5" />
                  {badge > 0 && (
                    <span className="absolute -right-1.5 -top-1.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-brand-600 px-0.5 text-[8px] font-bold text-white">
                      {badge}
                    </span>
                  )}
                </span>
                {item.label}
                {isActive && <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-brand-600" />}
              </>
            )}
          </NavLink>
        )
      })}
    </nav>
  )
}
