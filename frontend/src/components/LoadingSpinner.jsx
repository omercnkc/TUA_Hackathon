export function LoadingSpinner({ className = '', size = 'md' }) {
  const s = size === 'sm' ? 'h-5 w-5 border-2' : 'h-10 w-10 border-2'
  return (
    <div
      role="status"
      aria-label="Yükleniyor"
      className={`inline-block animate-spin rounded-full border-secondary border-t-transparent ${s} ${className}`}
    />
  )
}
