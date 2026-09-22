import { createContext, useCallback, useContext, useRef, useState } from 'react'
import type { ReactNode } from 'react'

export type ToastKind = 'success' | 'error'

export interface Toast {
  id: string
  message: string
  kind: ToastKind
}

interface ToastContextValue {
  toasts: Toast[]
  showToast: (message: string, kind?: ToastKind) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const counter = useRef(0)

  const showToast = useCallback((message: string, kind: ToastKind = 'success') => {
    const id = `toast_${counter.current++}`
    setToasts((prev) => [...prev, { id, message, kind }])
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, showToast }}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex flex-col gap-2 sm:bottom-6 sm:right-6">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`toast-enter pointer-events-auto flex items-center gap-2 rounded-xl px-4 py-3 shadow-lg ring-1 backdrop-blur-sm ${
              t.kind === 'success'
                ? 'bg-emerald-50 text-emerald-800 ring-emerald-200'
                : 'bg-rose-50 text-rose-800 ring-rose-200'
            }`}
          >
            <span className="text-base leading-none">{t.kind === 'success' ? '✓' : '⚠'}</span>
            <span className="text-sm font-medium">{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
