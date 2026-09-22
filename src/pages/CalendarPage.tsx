import { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'
import CalendarToolbar from '../components/CalendarToolbar'
import type { CalendarView } from '../components/CalendarToolbar'
import CalendarMonthView from '../components/CalendarMonthView'
import CalendarWeekView from '../components/CalendarWeekView'
import CalendarDayView from '../components/CalendarDayView'
import EventForm from '../components/EventForm'
import LoadingState from '../components/LoadingState'
import { addDays, addMonths, formatMonthYear, formatWeekRange, getWeekDays } from '../utils/calendar'
import { todayISO } from '../utils/date'
import type { HouseholdEvent } from '../types'

export default function CalendarPage() {
  const { state } = useApp()
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<CalendarView>('month')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [formState, setFormState] = useState<{ open: boolean; event?: HouseholdEvent; date?: string }>({
    open: false,
  })

  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 400)
    return () => window.clearTimeout(t)
  }, [])

  const handlePrev = () => {
    if (view === 'month') setCurrentDate((d) => addMonths(d, -1))
    else if (view === 'week') setCurrentDate((d) => addDays(d, -7))
    else setCurrentDate((d) => addDays(d, -1))
  }
  const handleNext = () => {
    if (view === 'month') setCurrentDate((d) => addMonths(d, 1))
    else if (view === 'week') setCurrentDate((d) => addDays(d, 7))
    else setCurrentDate((d) => addDays(d, 1))
  }
  const handleToday = () => setCurrentDate(new Date())

  const label =
    view === 'month'
      ? formatMonthYear(currentDate)
      : view === 'week'
        ? formatWeekRange(getWeekDays(currentDate))
        : currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  const openAdd = (dateISO?: string) => setFormState({ open: true, date: dateISO ?? todayISO(currentDate) })
  const openEdit = (event: HouseholdEvent) => setFormState({ open: true, event })
  const closeForm = () => setFormState({ open: false })

  return (
    <div className="animate-fade-up">
      <CalendarToolbar
        label={label}
        view={view}
        onViewChange={setView}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
        onAddEvent={() => openAdd()}
      />

      <div className="mt-5">
        {loading ? (
          <LoadingState rows={4} />
        ) : view === 'month' ? (
          <CalendarMonthView
            monthDate={currentDate}
            events={state.events}
            onDayClick={openAdd}
            onEventClick={openEdit}
          />
        ) : view === 'week' ? (
          <CalendarWeekView
            weekDate={currentDate}
            events={state.events}
            onDayClick={openAdd}
            onEventClick={openEdit}
          />
        ) : (
          <CalendarDayView
            dayDate={currentDate}
            events={state.events}
            onAddEvent={openAdd}
            onEventClick={openEdit}
          />
        )}
      </div>

      {formState.open && (
        <EventForm initialEvent={formState.event} initialDate={formState.date} onClose={closeForm} />
      )}
    </div>
  )
}
