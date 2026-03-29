import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'
import { Footer } from '../components/Footer'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { Navbar } from '../components/Navbar'
import { fetchSpaceBases, postPredict } from '../services/api'

const GlobeGL = lazy(() => import('react-globe.gl'))

/* ─── 3D Küre ──────────────────────────────────────────────────── */
function GlobeView({ bases, baseA, baseB, onPointClick }) {
  const containerRef = useRef(null)
  const globeRef = useRef(null)
  const [size, setSize] = useState({ w: 800, h: 480 })

  /* Container boyutunu izle */
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => {
      setSize({ w: e.contentRect.width, h: e.contentRect.height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  /* Otomatik döndürme */
  useEffect(() => {
    if (!globeRef.current) return
    const controls = globeRef.current.controls()
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.45
    controls.enableDamping = true
  }, [])

  /* Seçili üsse odaklan */
  useEffect(() => {
    if (!globeRef.current) return
    const target = baseB ?? baseA
    if (target) {
      globeRef.current.pointOfView(
        { lat: target.lat, lng: target.lng, altitude: 1.6 },
        900,
      )
    }
  }, [baseA, baseB])

  const getColor = useCallback(
    (b) => {
      if (baseA?.id === b.id) return '#bb9eff'
      if (baseB?.id === b.id) return '#00cffc'
      return 'rgba(255,255,255,0.35)'
    },
    [baseA, baseB],
  )

  const getRadius = useCallback(
    (b) => {
      if (baseA?.id === b.id || baseB?.id === b.id) return 0.55
      return 0.28
    },
    [baseA, baseB],
  )

  const getAltitude = useCallback(
    (b) => (baseA?.id === b.id || baseB?.id === b.id ? 0.03 : 0.005),
    [baseA, baseB],
  )

  const labelHtml = useCallback((b) => {
    const isA = baseA?.id === b.id
    const isB = baseB?.id === b.id
    const accent = isA ? '#bb9eff' : isB ? '#00cffc' : '#fff'
    return `<div style="
      color:${accent};font-size:11px;font-weight:600;
      background:rgba(5,5,10,0.80);backdrop-filter:blur(4px);
      padding:3px 8px;border-radius:20px;
      border:1px solid ${accent}44;white-space:nowrap;
    ">${isA ? 'A — ' : isB ? 'B — ' : ''}${b.name}</div>`
  }, [baseA, baseB])

  return (
    <div ref={containerRef} className="h-full w-full">
      <Suspense fallback={
        <div className="flex h-full items-center justify-center">
          <LoadingSpinner />
        </div>
      }>
        <GlobeGL
          ref={globeRef}
          width={size.w}
          height={size.h}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          backgroundColor="rgba(0,0,0,0)"
          atmosphereColor="#7c6dfa"
          atmosphereAltitude={0.18}
          pointsData={bases}
          pointLat="lat"
          pointLng="lng"
          pointColor={getColor}
          pointRadius={getRadius}
          pointAltitude={getAltitude}
          pointLabel={labelHtml}
          onPointClick={(b, ev) => { ev?.stopPropagation?.(); onPointClick(b) }}
          pointsMerge={false}
        />
      </Suspense>
    </div>
  )
}

/* ─── Radar grafiği ────────────────────────────────────────────── */
const RADAR_METRICS = [
  { label: 'Ekvator',   getVal: r => parseFloat(r?.['SAHA_ANALİZİ']?.['Ekvator_Skoru']) || 0,                                        max: 10 },
  { label: 'Başarı %',  getVal: r => parseFloat(String(r?.['SAHA_ANALİZİ']?.['Basari_Yuzdesi']).replace('%','')) || 0,               max: 100 },
  { label: 'Güvenilir', getVal: r => parseFloat(r?.['SAHA_ANALİZİ']?.['Guvenilirlik_Puani']) || 0,                                  max: 10 },
  { label: 'Toplam↑',   getVal: r => Math.min(parseFloat(r?.['SAHA_ANALİZİ']?.['Toplam_Atis']) || 0, 2000),                         max: 2000 },
  { label: 'Rüzgar↓',  getVal: r => { const v = parseFloat(r?.['METEOROLOJİ_VERİSİ']?.['Rüzgar_Hızı']); return isNaN(v) ? 10 : Math.max(0, 20 - v) }, max: 20 },
  { label: 'Max-Q↓',   getVal: r => { const v = parseFloat(r?.['TEKNİK_ANALİZ_RAPORU']?.['Max_Q_Basıncı']); return isNaN(v) ? 15000 : Math.max(0, 35000 - v) }, max: 35000 },
]

function RadarChart({ resultA, resultB }) {
  const cx = 210, cy = 210, R = 155
  const N = RADAR_METRICS.length
  const angles = RADAR_METRICS.map((_, i) => (i * 2 * Math.PI / N) - Math.PI / 2)

  const pt = (angle, val, max) => {
    const r = R * Math.min(1, Math.max(0, val / max))
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)]
  }

  const polyA = RADAR_METRICS.map((m, i) => pt(angles[i], m.getVal(resultA), m.max))
  const polyB = RADAR_METRICS.map((m, i) => pt(angles[i], m.getVal(resultB), m.max))
  const toPath = pts => pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ') + 'Z'

  /* ağ ızgarası */
  const gridPoly = (t) =>
    angles.map(a => `${(cx + R * t * Math.cos(a)).toFixed(1)},${(cy + R * t * Math.sin(a)).toFixed(1)}`).join(' ')

  return (
    <svg viewBox="0 0 420 420" className="mx-auto w-full max-w-lg">
      {/* ızgara */}
      {[0.25, 0.5, 0.75, 1].map(t => (
        <polygon key={t} points={gridPoly(t)} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
      ))}
      {/* eksen çizgileri */}
      {angles.map((a, i) => (
        <line key={i} x1={cx} y1={cy}
          x2={(cx + R * Math.cos(a)).toFixed(1)} y2={(cy + R * Math.sin(a)).toFixed(1)}
          stroke="rgba(255,255,255,0.10)" strokeWidth="1" />
      ))}
      {/* B alanı */}
      <path d={toPath(polyB)} fill="rgba(0,207,252,0.12)" stroke="#00cffc" strokeWidth="2" strokeLinejoin="round" />
      {/* A alanı */}
      <path d={toPath(polyA)} fill="rgba(187,158,255,0.15)" stroke="#bb9eff" strokeWidth="2" strokeLinejoin="round" />
      {/* A noktaları */}
      {polyA.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="4" fill="#bb9eff" />)}
      {/* B noktaları */}
      {polyB.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="4" fill="#00cffc" />)}
      {/* etiketler */}
      {RADAR_METRICS.map((m, i) => {
        const lx = cx + (R + 22) * Math.cos(angles[i])
        const ly = cy + (R + 22) * Math.sin(angles[i])
        return (
          <text key={i} x={lx.toFixed(1)} y={ly.toFixed(1)}
            textAnchor="middle" dominantBaseline="middle"
            fill="rgba(255,255,255,0.55)" fontSize="11" fontFamily="sans-serif">
            {m.label}
          </text>
        )
      })}
    </svg>
  )
}

/* ─── Sonuç kartı ──────────────────────────────────────────────── */
function ResultCard({ slot, base, result, loading }) {
  const isCyan = slot === 'B'
  const accent = isCyan ? 'text-cyan-400' : 'text-primary'
  const go = result?.['FIRLATMA_DURUMU'] === 'GO'

  return (
    <div className="glass-card relative flex flex-col overflow-hidden rounded-xl p-6">
      <div className={`absolute -right-12 -top-12 h-32 w-32 rounded-full blur-[60px] ${isCyan ? 'bg-cyan-400/10' : 'bg-primary/10'}`} />

      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <span className={`mb-1 block text-[10px] font-bold uppercase tracking-widest ${accent}`}>
            Nokta {slot}
          </span>
          <h3 className="font-headline text-xl font-bold text-on-surface">
            {base ? base.name : 'Küre üzerinden seçin'}
          </h3>
        </div>
        {result && (
          <span className={`shrink-0 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
            go ? 'border-secondary/30 bg-secondary/10 text-secondary' : 'border-error/30 bg-error/10 text-error'
          }`}>
            {result['FIRLATMA_DURUMU']}
          </span>
        )}
      </div>

      {!base && (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 py-10 text-on-surface-variant opacity-40">
          <span className="material-symbols-outlined text-4xl">public</span>
          <p className="text-sm">Küre üzerinde {slot} noktasını seçin</p>
        </div>
      )}

      {base && loading && (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-10">
          <LoadingSpinner />
          <p className="text-sm text-on-surface-variant">Simülasyon çalışıyor…</p>
        </div>
      )}

      {result && !loading && (
        <div className="space-y-3">
          {[
            { label: 'Max-Q',        value: result['TEKNİK_ANALİZ_RAPORU']?.['Max_Q_Basıncı'] },
            { label: 'Ekvator Skoru',value: result['SAHA_ANALİZİ']?.['Ekvator_Skoru'] },
            { label: 'Başarı Oranı', value: result['SAHA_ANALİZİ']?.['Basari_Yuzdesi'] },
            { label: 'Güvenilirlik', value: result['SAHA_ANALİZİ']?.['Guvenilirlik_Puani'] },
            { label: 'Rüzgar',       value: result['METEOROLOJİ_VERİSİ']?.['Rüzgar_Hızı'] },
            { label: 'Sıcaklık',     value: result['METEOROLOJİ_VERİSİ']?.['Sicaklik_C'] != null ? `${result['METEOROLOJİ_VERİSİ']['Sicaklik_C']} °C` : '—' },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between rounded-lg bg-surface/40 px-3 py-2">
              <span className="text-[10px] uppercase tracking-wider text-on-surface-variant">{label}</span>
              <span className="text-sm font-bold text-on-surface">{value ?? '—'}</span>
            </div>
          ))}
          <div className="rounded-lg bg-surface/40 px-3 py-2">
            <span className="text-[10px] uppercase tracking-wider text-on-surface-variant">Risk Notları</span>
            <p className="mt-1 text-xs text-on-surface-variant">
              {Array.isArray(result['RİSK_VE_ENGEL_NOTLARI'])
                ? result['RİSK_VE_ENGEL_NOTLARI'].join(' | ')
                : result['RİSK_VE_ENGEL_NOTLARI']}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Ana sayfa ────────────────────────────────────────────────── */
export function Compare({ theme, onToggleTheme }) {
  const [bases, setBases]       = useState([])
  const [baseA, setBaseA]       = useState(null)
  const [baseB, setBaseB]       = useState(null)
  const [resultA, setResultA]   = useState(null)
  const [resultB, setResultB]   = useState(null)
  const [loadingA, setLoadingA] = useState(false)
  const [loadingB, setLoadingB] = useState(false)

  useEffect(() => {
    fetchSpaceBases().then(setBases).catch(() => setBases([]))
  }, [])

  const runFor = async (base, slot) => {
    const setLoading = slot === 'A' ? setLoadingA : setLoadingB
    const setResult  = slot === 'A' ? setResultA  : setResultB
    setLoading(true)
    setResult(null)
    try {
      const data = await postPredict({ rocket_idx: 0, site_idx: base.id })
      setResult(data.raw)
    } catch {}
    finally { setLoading(false) }
  }

  const handlePointClick = (b) => {
    if (!baseA || (baseA && baseB)) {
      setBaseA(b); setBaseB(null); setResultA(null); setResultB(null)
      runFor(b, 'A')
    } else if (baseA && !baseB && b.id !== baseA.id) {
      setBaseB(b)
      runFor(b, 'B')
    }
  }

  const reset = () => {
    setBaseA(null); setBaseB(null); setResultA(null); setResultB(null)
  }

  const step = !baseA ? 1 : !baseB ? 2 : 3

  return (
    <div className="min-h-screen bg-background font-body text-on-background pt-[64px]">
      <Navbar theme={theme} onToggleTheme={onToggleTheme} />

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        {/* Başlık */}
        <header className="mb-8 space-y-3">
          <div className="inline-flex items-center rounded-full border border-outline-variant/20 bg-surface-container-high px-3 py-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary">Karşılaştırma Motoru</span>
          </div>
          <h1 className="font-headline text-3xl font-extrabold tracking-tighter text-on-surface md:text-5xl">
            Karşılaştırma Paneli
          </h1>
          <p className="text-sm text-on-surface-variant">
            Küre üzerinden iki fırlatma sahası seçin. Model her iki nokta için çalışır ve sonuçları karşılaştırır.
          </p>
        </header>

        {/* Adım göstergesi */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          {[
            { n: 1, label: 'A noktasını seçin',   cls: 'text-primary border-primary/40 bg-primary/10' },
            { n: 2, label: 'B noktasını seçin',    cls: 'text-cyan-400 border-cyan-400/40 bg-cyan-400/10' },
            { n: 3, label: 'Karşılaştırma hazır',  cls: 'text-secondary border-secondary/40 bg-secondary/10' },
          ].map(({ n, label, cls }) => (
            <div key={n} className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold transition-opacity ${cls} ${step >= n ? 'opacity-100' : 'opacity-30'}`}>
              <span className="font-bold">{n}</span> {label}
            </div>
          ))}
          {baseA && (
            <button onClick={reset} className="ml-auto flex items-center gap-1 text-xs text-on-surface-variant hover:text-error">
              <span className="material-symbols-outlined text-sm">restart_alt</span> Sıfırla
            </button>
          )}
        </div>

        {/* 3D Küre */}
        <div className="mb-8 overflow-hidden rounded-2xl border border-outline-variant/10 bg-[#03030a]" style={{ height: 500 }}>
          <GlobeView
            bases={bases}
            baseA={baseA}
            baseB={baseB}
            onPointClick={handlePointClick}
          />
        </div>

        {/* Karşılaştırma kartları */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ResultCard slot="A" base={baseA} result={resultA} loading={loadingA} />
          <ResultCard slot="B" base={baseB} result={resultB} loading={loadingB} />
        </div>

        {/* Karşılaştırma tablosu */}
        {resultA && resultB && (
          <div className="mt-8 glass-card rounded-xl p-6 md:p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-headline text-2xl font-bold text-on-surface">Metrik Karşılaştırması</h2>
              <div className="flex items-center gap-4 text-xs">
                <span className="font-bold text-primary">● Nokta A</span>
                <span className="font-bold text-cyan-400">● Nokta B</span>
              </div>
            </div>
            {(() => {
              const ekA  = parseFloat(resultA['SAHA_ANALİZİ']?.['Ekvator_Skoru']) || 0
              const ekB  = parseFloat(resultB['SAHA_ANALİZİ']?.['Ekvator_Skoru']) || 0
              const baA  = parseFloat(String(resultA['SAHA_ANALİZİ']?.['Basari_Yuzdesi']).replace('%','')) || 0
              const baB  = parseFloat(String(resultB['SAHA_ANALİZİ']?.['Basari_Yuzdesi']).replace('%','')) || 0
              const guA  = parseFloat(resultA['SAHA_ANALİZİ']?.['Guvenilirlik_Puani']) || 0
              const guB  = parseFloat(resultB['SAHA_ANALİZİ']?.['Guvenilirlik_Puani']) || 0
              const sA   = ekA + baA + guA
              const sB   = ekB + baB + guB
              const winner = sA > sB ? 'A' : sB > sA ? 'B' : null
              const winnerName  = winner === 'A' ? baseA.name : winner === 'B' ? baseB.name : null
              const winnerColor = winner === 'A' ? '#bb9eff' : '#00cffc'
              const pctA = sA + sB > 0 ? Math.round((sA / (sA + sB)) * 100) : 50
              const pctB = 100 - pctA

              return (
                <div className="mt-8 relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-[#0d0d14] via-[#0a0a12] to-[#0d0d14] p-6 md:p-8">
                  {/* Glow arka plan */}
                  <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-primary/20 blur-[80px]" />
                  <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-cyan-400/15 blur-[80px]" />

                  <p className="mb-5 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                    Simülasyon Özeti
                  </p>

                  {/* Kazanan badge */}
                  {winner ? (
                    <div className="mb-6 flex flex-col items-center gap-2">
                      <div
                        className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold"
                        style={{ background: `${winnerColor}18`, border: `1px solid ${winnerColor}44`, color: winnerColor }}
                      >
                        <span className="material-symbols-outlined text-base">rocket_launch</span>
                        {winnerName} ({winner}) öne çıkıyor
                      </div>
                      <p className="text-xs text-white/40">Ekvator skoru, başarı oranı ve güvenilirlik baz alındı</p>
                    </div>
                  ) : (
                    <div className="mb-6 flex flex-col items-center gap-2">
                      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-bold text-white/70">
                        <span className="material-symbols-outlined text-base">balance</span>
                        Eşit performans
                      </div>
                    </div>
                  )}

                  {/* Skor çubuğu */}
                  <div className="mb-2 flex items-center justify-between text-xs font-semibold">
                    <span className="text-primary">{baseA.name}</span>
                    <span className="text-cyan-400">{baseB.name}</span>
                  </div>
                  <div className="flex h-3 w-full overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-l-full transition-all duration-700"
                      style={{ width: `${pctA}%`, background: 'linear-gradient(90deg,#bb9eff,#a78bfa)' }}
                    />
                    <div
                      className="h-full rounded-r-full transition-all duration-700"
                      style={{ width: `${pctB}%`, background: 'linear-gradient(90deg,#06b6d4,#00cffc)' }}
                    />
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[10px] text-white/30">
                    <span>%{pctA}</span>
                    <span>%{pctB}</span>
                  </div>
                </div>
              )
            })()}
            <RadarChart resultA={resultA} resultB={resultB} />

            {/* Maliyet Bar Grafiği */}
            {(() => {
              const costA = resultA?.['EKONOMİK_ANALİZ']?.['Birim_Maliyet']
              const costB = resultB?.['EKONOMİK_ANALİZ']?.['Birim_Maliyet']
              if (!costA || !costB) return null
              const maxCost = Math.max(costA, costB, 1)
              const barA = Math.round((costA / maxCost) * 100)
              const barB = Math.round((costB / maxCost) * 100)
              const cheaper = costA < costB ? 'A' : costB < costA ? 'B' : null

              const noteColor = (result) => {
                const n = result?.['EKONOMİK_ANALİZ']?.['Verimlilik_Notu']
                if (n === 'Yüksek Verimlilik') return 'text-secondary'
                if (n === 'Orta Verimlilik') return 'text-yellow-400'
                return 'text-error'
              }

              return (
                <div className="mt-6 rounded-2xl border border-white/5 bg-[#0a0a12] p-6">
                  <div className="mb-5 flex items-center gap-2">
                    <span className="material-symbols-outlined text-yellow-400">attach_money</span>
                    <h3 className="font-headline text-lg font-bold text-on-surface">KG Başına Maliyet Karşılaştırması</h3>
                    {cheaper && (
                      <span className="ml-auto text-xs text-white/40">
                        Nokta {cheaper} <span className="text-secondary font-semibold">daha ekonomik</span>
                      </span>
                    )}
                  </div>

                  {/* Bar A */}
                  <div className="mb-4">
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <span className="font-semibold text-primary">{baseA?.name} (A)</span>
                      <span className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold ${noteColor(resultA)}`}>{resultA['EKONOMİK_ANALİZ']['Verimlilik_Notu']}</span>
                        <span className="font-bold text-white">${costA.toLocaleString('en-US')}/kg</span>
                      </span>
                    </div>
                    <div className="h-4 w-full overflow-hidden rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${barA}%`, background: 'linear-gradient(90deg,#7c3aed,#bb9eff)' }}
                      />
                    </div>
                  </div>

                  {/* Bar B */}
                  <div>
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <span className="font-semibold text-cyan-400">{baseB?.name} (B)</span>
                      <span className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold ${noteColor(resultB)}`}>{resultB['EKONOMİK_ANALİZ']['Verimlilik_Notu']}</span>
                        <span className="font-bold text-white">${costB.toLocaleString('en-US')}/kg</span>
                      </span>
                    </div>
                    <div className="h-4 w-full overflow-hidden rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${barB}%`, background: 'linear-gradient(90deg,#0891b2,#00cffc)' }}
                      />
                    </div>
                  </div>

                  <p className="mt-4 text-[10px] text-white/25">
                    SpaceX Falcon 9 referansı: $2,700/kg · Sektör ortalaması: $5,000/kg
                  </p>
                </div>
              )
            })()}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
