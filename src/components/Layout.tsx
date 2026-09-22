import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import MobileNav from './MobileNav'
import TopBar from './TopBar'
import SettingsModal from './SettingsModal'
import HelpModal from './HelpModal'
import { useToast } from '../context/ToastContext'

export default function Layout() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const { showToast } = useToast()

  const handleInvite = async () => {
    const link = 'https://viyata.app/invite/apt-4b-92k1'
    try {
      await navigator.clipboard.writeText(link)
      showToast('Invite link copied to clipboard')
    } catch {
      showToast('Invite link: ' + link)
    }
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenHelp={() => setHelpOpen(true)}
        onInvite={handleInvite}
      />
      <div className="min-w-0 flex-1 px-4 pb-24 pt-4 sm:px-5 md:px-6 md:pb-8 lg:px-8 lg:py-6">
        <header className="mb-5 md:mb-7">
          <TopBar />
        </header>
        <main>
          <Outlet />
        </main>
      </div>
      <MobileNav />
      {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}
      {helpOpen && <HelpModal onClose={() => setHelpOpen(false)} />}
    </div>
  )
}
