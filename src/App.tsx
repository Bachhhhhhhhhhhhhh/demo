import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'
import { Contact } from './components/Contact'
import { Directions } from './components/Directions'
import { EventInfo } from './components/EventInfo'
import { Gate } from './components/Gate'
import { Invitation } from './components/Invitation'
import { MessageForm } from './components/MessageForm'
import { STORAGE_KEY } from './config'
import type { Guest } from './data/guests'
import { nowIsoPlus7, postToSheet } from './lib/sheets'
import { Admin } from './pages/Admin'

type SessionGuest = {
  guest: Guest
  matchType: 'open'
  openedAt: string
}

function readSession(): SessionGuest | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as SessionGuest
  } catch {
    return null
  }
}

function InviteApp() {
  const [session, setSession] = useState<SessionGuest | null>(() => readSession())

  const openInvite = (guest: Guest) => {
    const openedAt = nowIsoPlus7()
    const next: SessionGuest = { guest, matchType: 'open', openedAt }
    setSession(next)
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    void postToSheet({
      action: 'open',
      guest_name: guest.name,
      match_type: 'open',
      referrer: document.referrer || '',
      user_agent: navigator.userAgent,
    })
  }

  const reset = () => {
    setSession(null)
    sessionStorage.removeItem(STORAGE_KEY)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="grain-overlay" aria-hidden />
      <AnimatePresence>
        {!session && <Gate key="gate" onSubmit={openInvite} />}
      </AnimatePresence>
      {session && (
        <main>
          <Invitation guest={session.guest} onSwitch={reset} />
          <EventInfo />
          <Directions />
          <Contact />
          <MessageForm guest={session.guest} openedAt={session.openedAt} />
        </main>
      )}
    </div>
  )
}

export default function App() {
  return (
    <>
      <Toaster
        position="bottom-center"
        toastOptions={{
          className:
            'font-pixel text-lg uppercase border-[3px] border-border shadow-[4px_4px_0_0_#2B2118] rounded-none bg-card text-foreground',
        }}
      />
      <Routes>
        <Route path="/" element={<InviteApp />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </>
  )
}
