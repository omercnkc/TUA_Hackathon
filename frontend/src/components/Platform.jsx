export function Platform({ children, shake }) {
  return (
    <div className="relative flex flex-col items-center">
      {/* Rockets row */}
      <div
        className="relative z-10 flex items-end justify-center gap-8 sm:gap-12 md:gap-16"
        style={{ animation: shake ? 'screen-shake 0.5s ease-in-out' : 'none' }}
      >
        {children}
      </div>

      {/* Platform base */}
      <div
        className="relative mt-2 w-full"
        style={{
          maxWidth: 420,
          animation: 'platform-glow 3s ease-in-out infinite',
        }}
      >
        {/* Top edge — neon line */}
        <div
          className="h-[2px] w-full rounded-full"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(0,207,252,0.8), rgba(187,158,255,0.9), rgba(0,207,252,0.8), transparent)',
            animation: 'neon-border 2s ease-in-out infinite',
            boxShadow: '0 0 12px rgba(0,207,252,0.6)',
          }}
        />

        {/* Platform body */}
        <div
          className="relative overflow-hidden"
          style={{
            height: 56,
            background: 'linear-gradient(180deg, rgba(20,20,40,0.95) 0%, rgba(10,10,25,0.98) 100%)',
            border: '1px solid rgba(0,207,252,0.2)',
            borderTop: 'none',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Horizontal scan lines */}
          {[8, 18, 28, 38, 48].map((y) => (
            <div
              key={y}
              className="absolute w-full"
              style={{
                top: y,
                height: 1,
                background: 'rgba(0,207,252,0.06)',
              }}
            />
          ))}

          {/* Vertical structural pillars */}
          {[20, 35, 50, 65, 80].map((x) => (
            <div
              key={x}
              className="absolute top-0 bottom-0"
              style={{
                left: `${x}%`,
                width: 1,
                background: 'rgba(187,158,255,0.08)',
              }}
            />
          ))}

          {/* Corner indicator lights */}
          {[
            { left: 16, top: 8 },
            { right: 16, top: 8 },
            { left: 16, bottom: 8 },
            { right: 16, bottom: 8 },
          ].map((pos, i) => (
            <div
              key={i}
              className="absolute h-1.5 w-1.5 rounded-full"
              style={{
                ...pos,
                background: i % 2 === 0 ? '#00cffc' : '#bb9eff',
                boxShadow: `0 0 6px ${i % 2 === 0 ? 'rgba(0,207,252,0.8)' : 'rgba(187,158,255,0.8)'}`,
                animation: `countdown-pulse ${0.8 + i * 0.2}s ease-in-out infinite`,
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}

          {/* Center badge */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="flex items-center gap-2 rounded-full px-4 py-1"
              style={{
                background: 'rgba(0,207,252,0.06)',
                border: '1px solid rgba(0,207,252,0.15)',
              }}
            >
              <div
                className="h-1.5 w-1.5 rounded-full bg-cyan-400"
                style={{ animation: 'countdown-pulse 1s ease-in-out infinite' }}
              />
              <span
                className="font-headline text-[10px] font-bold uppercase tracking-[0.3em]"
                style={{ color: 'rgba(0,207,252,0.7)' }}
              >
                COSMOS LAUNCH PAD — DELTA-7
              </span>
              <div
                className="h-1.5 w-1.5 rounded-full bg-violet-400"
                style={{ animation: 'countdown-pulse 1s ease-in-out infinite', animationDelay: '0.5s' }}
              />
            </div>
          </div>
        </div>

        {/* Bottom glow shadow */}
        <div
          className="h-8 w-full"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,207,252,0.08), transparent)',
            filter: 'blur(4px)',
          }}
        />
      </div>
    </div>
  )
}
