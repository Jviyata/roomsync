import { SHARED_SPACES } from '../types'
import { getSpaceStatus } from '../utils/selectors'
import { useApp } from '../context/AppContext'
import { SpacesIcon } from './Icons'

export default function SharedSpacesCard() {
  const { state } = useApp()

  return (
    <div id="spaces" className="@container scroll-mt-24 rounded-3xl bg-white p-5 card-shadow ring-1 ring-slate-100">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-brand-700">
          <SpacesIcon className="h-4 w-4" />
        </span>
        <h3 className="text-sm font-semibold text-slate-800">Available Shared Spaces</h3>
      </div>
      <div className="grid grid-cols-2 gap-3 @md:grid-cols-4">
        {SHARED_SPACES.map((space) => {
          const status = getSpaceStatus(state.events, space)
          const available = status === 'Available'
          return (
            <div
              key={space}
              className="flex flex-col gap-2 rounded-2xl bg-surface-100 px-3.5 py-3 ring-1 ring-slate-100/80"
            >
              <p className="text-sm font-semibold text-slate-800">{space}</p>
              <span
                className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                  available ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${available ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                {status}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
