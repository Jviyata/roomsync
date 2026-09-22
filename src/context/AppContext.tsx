import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react'
import type { ReactNode } from 'react'
import type { AppState, Guest, HouseholdEvent, Reminder } from '../types'
import { buildSeedState } from '../data/seed'

const STORAGE_KEY = 'roomsync-state-v1'

function uid(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`
}

function loadInitialState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as AppState
      if (parsed && Array.isArray(parsed.events) && Array.isArray(parsed.reminders) && Array.isArray(parsed.guests)) {
        return parsed
      }
    }
  } catch {
    // fall through to seed data
  }
  return buildSeedState()
}

type Action =
  | { type: 'ADD_EVENT'; payload: HouseholdEvent }
  | { type: 'UPDATE_EVENT'; payload: HouseholdEvent }
  | { type: 'DELETE_EVENT'; payload: { id: string } }
  | { type: 'ADD_REMINDER'; payload: Reminder }
  | { type: 'UPDATE_REMINDER'; payload: Reminder }
  | { type: 'DELETE_REMINDER'; payload: { id: string } }
  | { type: 'TOGGLE_REMINDER'; payload: { id: string } }
  | { type: 'ADD_GUEST'; payload: Guest }
  | { type: 'UPDATE_GUEST'; payload: Guest }
  | { type: 'DELETE_GUEST'; payload: { id: string } }
  | { type: 'SET_TEMPERATURE'; payload: { temperature: number } }
  | { type: 'TOGGLE_DOOR' }
  | { type: 'RESET_DEMO' }

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADD_EVENT':
      return { ...state, events: [...state.events, action.payload] }
    case 'UPDATE_EVENT':
      return {
        ...state,
        events: state.events.map((e) => (e.id === action.payload.id ? action.payload : e)),
      }
    case 'DELETE_EVENT':
      return { ...state, events: state.events.filter((e) => e.id !== action.payload.id) }
    case 'ADD_REMINDER':
      return { ...state, reminders: [action.payload, ...state.reminders] }
    case 'UPDATE_REMINDER':
      return {
        ...state,
        reminders: state.reminders.map((r) => (r.id === action.payload.id ? action.payload : r)),
      }
    case 'DELETE_REMINDER':
      return { ...state, reminders: state.reminders.filter((r) => r.id !== action.payload.id) }
    case 'TOGGLE_REMINDER':
      return {
        ...state,
        reminders: state.reminders.map((r) =>
          r.id === action.payload.id ? { ...r, completed: !r.completed } : r,
        ),
      }
    case 'ADD_GUEST':
      return { ...state, guests: [...state.guests, action.payload] }
    case 'UPDATE_GUEST':
      return {
        ...state,
        guests: state.guests.map((g) => (g.id === action.payload.id ? action.payload : g)),
      }
    case 'DELETE_GUEST':
      return { ...state, guests: state.guests.filter((g) => g.id !== action.payload.id) }
    case 'SET_TEMPERATURE':
      return { ...state, homeStatus: { ...state.homeStatus, temperature: action.payload.temperature } }
    case 'TOGGLE_DOOR':
      return { ...state, homeStatus: { ...state.homeStatus, doorLocked: !state.homeStatus.doorLocked } }
    case 'RESET_DEMO':
      return buildSeedState()
    default:
      return state
  }
}

interface AppContextValue {
  state: AppState
  addEvent: (event: Omit<HouseholdEvent, 'id'>) => void
  updateEvent: (event: HouseholdEvent) => void
  deleteEvent: (id: string) => void
  addReminder: (reminder: Omit<Reminder, 'id'>) => void
  updateReminder: (reminder: Reminder) => void
  deleteReminder: (id: string) => void
  toggleReminder: (id: string) => void
  addGuest: (guest: Omit<Guest, 'id'>) => void
  updateGuest: (guest: Guest) => void
  deleteGuest: (id: string) => void
  setTemperature: (temperature: number) => void
  toggleDoor: () => void
}

const AppContext = createContext<AppContextValue | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitialState)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // storage unavailable — session state still works in-memory
    }
  }, [state])

  const addEvent = useCallback((event: Omit<HouseholdEvent, 'id'>) => {
    dispatch({ type: 'ADD_EVENT', payload: { ...event, id: uid('evt') } })
  }, [])
  const updateEvent = useCallback((event: HouseholdEvent) => {
    dispatch({ type: 'UPDATE_EVENT', payload: event })
  }, [])
  const deleteEvent = useCallback((id: string) => {
    dispatch({ type: 'DELETE_EVENT', payload: { id } })
  }, [])

  const addReminder = useCallback((reminder: Omit<Reminder, 'id'>) => {
    dispatch({ type: 'ADD_REMINDER', payload: { ...reminder, id: uid('rem') } })
  }, [])
  const updateReminder = useCallback((reminder: Reminder) => {
    dispatch({ type: 'UPDATE_REMINDER', payload: reminder })
  }, [])
  const deleteReminder = useCallback((id: string) => {
    dispatch({ type: 'DELETE_REMINDER', payload: { id } })
  }, [])
  const toggleReminder = useCallback((id: string) => {
    dispatch({ type: 'TOGGLE_REMINDER', payload: { id } })
  }, [])

  const addGuest = useCallback((guest: Omit<Guest, 'id'>) => {
    dispatch({ type: 'ADD_GUEST', payload: { ...guest, id: uid('gst') } })
  }, [])
  const updateGuest = useCallback((guest: Guest) => {
    dispatch({ type: 'UPDATE_GUEST', payload: guest })
  }, [])
  const deleteGuest = useCallback((id: string) => {
    dispatch({ type: 'DELETE_GUEST', payload: { id } })
  }, [])

  const setTemperature = useCallback((temperature: number) => {
    dispatch({ type: 'SET_TEMPERATURE', payload: { temperature } })
  }, [])
  const toggleDoor = useCallback(() => {
    dispatch({ type: 'TOGGLE_DOOR' })
  }, [])

  const value = useMemo<AppContextValue>(
    () => ({
      state,
      addEvent,
      updateEvent,
      deleteEvent,
      addReminder,
      updateReminder,
      deleteReminder,
      toggleReminder,
      addGuest,
      updateGuest,
      deleteGuest,
      setTemperature,
      toggleDoor,
    }),
    [
      state,
      addEvent,
      updateEvent,
      deleteEvent,
      addReminder,
      updateReminder,
      deleteReminder,
      toggleReminder,
      addGuest,
      updateGuest,
      deleteGuest,
      setTemperature,
      toggleDoor,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
