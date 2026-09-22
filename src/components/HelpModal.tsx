import Modal from './Modal'
import { CalendarIcon, GuestsIcon, ReminderIcon, ThermometerIcon } from './Icons'

interface HelpModalProps {
  onClose: () => void
}

const TIPS = [
  {
    icon: ThermometerIcon,
    title: 'Home status',
    body: 'Use the − / + on the temperature card and tap the door card to toggle it locked or unlocked. Changes apply immediately for everyone at home.',
  },
  {
    icon: CalendarIcon,
    title: 'Calendar',
    body: 'Click any date to add an event, or click an existing event to edit it. Switch between Month, Week, and Day from the toolbar.',
  },
  {
    icon: ReminderIcon,
    title: 'Reminders',
    body: 'Filter by status or priority, check items off as you finish them, and use a template to add common chores quickly.',
  },
  {
    icon: GuestsIcon,
    title: 'Guests',
    body: 'Log visitors under Today, Upcoming, or Past. Add notes like parking info or dietary needs so everyone is in the loop.',
  },
]

export default function HelpModal({ onClose }: HelpModalProps) {
  return (
    <Modal title="Help & tips" onClose={onClose}>
      <div className="space-y-4">
        {TIPS.map((tip) => (
          <div key={tip.title} className="flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
              <tip.icon className="h-[18px] w-[18px]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">{tip.title}</p>
              <p className="mt-0.5 text-sm text-slate-500">{tip.body}</p>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  )
}
