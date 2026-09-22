import { CalendarIcon, GuestsIcon, HomeIcon, ReminderIcon, SpacesIcon } from '../components/Icons'
import type { ComponentType, SVGProps } from 'react'

export interface NavItem {
  label: string
  path: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
}

export const PRIMARY_NAV: NavItem[] = [
  { label: 'Home', path: '/', icon: HomeIcon },
  { label: 'Calendar', path: '/calendar', icon: CalendarIcon },
  { label: 'Reminders', path: '/reminders', icon: ReminderIcon },
  { label: 'Guests', path: '/guests', icon: GuestsIcon },
]

export const SPACES_NAV: NavItem = { label: 'Spaces', path: '/#spaces', icon: SpacesIcon }
