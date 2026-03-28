export function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark'
  return (
    <button
      type="button"
      onClick={onToggle}
      className="text-primary hover:scale-105 transition-transform duration-200 rounded-lg p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/60"
      aria-label={isDark ? 'Açık temaya geç' : 'Koyu temaya geç'}
    >
      <span className="material-symbols-outlined" aria-hidden>
        {isDark ? 'dark_mode' : 'light_mode'}
      </span>
    </button>
  )
}
