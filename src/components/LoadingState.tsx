interface LoadingStateProps {
  rows?: number
  variant?: 'card' | 'line'
}

export default function LoadingState({ rows = 3, variant = 'card' }: LoadingStateProps) {
  if (variant === 'line') {
    return (
      <div className="space-y-3" aria-busy="true" aria-label="Loading">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-4 animate-pulse rounded-full bg-slate-200/70" style={{ width: `${85 - i * 12}%` }} />
        ))}
      </div>
    )
  }
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-20 animate-pulse rounded-2xl bg-slate-200/60" />
      ))}
    </div>
  )
}
