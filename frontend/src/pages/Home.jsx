import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AboutContactBlock } from '../components/AboutContactBlock'
import { Footer } from '../components/Footer'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { Navbar } from '../components/Navbar'
import { WorldMap } from '../components/WorldMap'
import { postPredict } from '../services/api'

const defaultResult = {
  confidence: 98.4,
  riskFactor: 0.02,
  status: 'SUCCESS',
  atmosphericStability: 85,
  geopoliticalFit: 92,
  summary:
    'Veri seti 1.4ms içerisinde işlendi. Mevcut girdiler fırlatma penceresinin %94 olasılıkla başarılı geçeceğini işaret etmektedir.',
  engineVersion: 'Derin Öğrenme Motoru v4.2',
}

/* Animated counter that counts up when scrolled into view */
function CountUp({ to, decimals = 0, duration = 1400 }) {
  const [val, setVal] = useState(0)
  const nodeRef = useRef(null)
  const rafRef = useRef(null)

  const run = useCallback(() => {
    const start = performance.now()
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1)
      const ease = 1 - Math.pow(1 - t, 4)
      setVal(+(ease * to).toFixed(decimals))
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
  }, [to, decimals, duration])

  useEffect(() => {
    const el = nodeRef.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { run(); obs.disconnect() }
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => { obs.disconnect(); cancelAnimationFrame(rafRef.current) }
  }, [run])

  return <span ref={nodeRef}>{val.toFixed(decimals)}</span>
}

function statusStyles(status) {
  if (status === 'SUCCESS')
    return 'border-secondary/20 bg-secondary-container/20 text-secondary'
  if (status === 'CAUTION') return 'border-amber-500/30 bg-amber-500/10 text-amber-400'
  return 'border-error/30 bg-error/10 text-error'
}

export function Home({ theme, onToggleTheme }) {
  const location = useLocation()
  const [temperature, setTemperature] = useState('24')
  const [population, setPopulation] = useState('500000')
  const [logisticsScore, setLogisticsScore] = useState('8.5')
  const [extra, setExtra] = useState('Standart')
  const [result, setResult] = useState(defaultResult)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedBase, setSelectedBase] = useState(null)

  /* Scroll reveal */
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) }
      })
    }, { threshold: 0.12 })
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [selectedBase])

  useEffect(() => {
    const raw = location.hash?.replace(/^#/, '')
    if (!raw) return
    const id = decodeURIComponent(raw)
    const t = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }, 350)
    return () => window.clearTimeout(t)
  }, [location.hash, location.pathname])

  const onAnalyze = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const data = await postPredict({
        temperature: Number(temperature),
        population: Number(population),
        logisticsScore: Number(logisticsScore),
        extra,
      })
      setResult((r) => ({
        ...r,
        confidence: data.confidence,
        riskFactor: data.riskFactor,
        status: data.status,
        atmosphericStability: data.atmosphericStability,
        geopoliticalFit: data.geopoliticalFit,
        summary: data.summary ?? r.summary,
        engineVersion: data.engineVersion ?? r.engineVersion,
      }))
    } catch {
      setError('Analiz isteği başarısız. API çalışıyor mu kontrol edin.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-background text-on-background overflow-x-hidden">
      {/* Ambient background orbs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
        <div className="cosmos-orb-a absolute left-[10%] top-[20%] h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="cosmos-orb-b absolute right-[8%] top-[50%] h-[400px] w-[400px] rounded-full bg-secondary/5 blur-[100px]" />
        <div className="cosmos-orb-c absolute left-[40%] bottom-[10%] h-[350px] w-[350px] rounded-full bg-tertiary/4 blur-[110px]" />
      </div>

      <Navbar theme={theme} onToggleTheme={onToggleTheme} />

      <main className="relative z-[1] w-full">
        <div className="px-2 sm:px-3 md:px-4">
          <WorldMap onSelectBase={setSelectedBase} selectedBase={selectedBase} />
        </div>

        {/* Konum seçilmediğinde Hakkımızda haritanın hemen altında */}
        {!selectedBase && <AboutContactBlock />}

        {/* Haritadan herhangi bir yere tıklanınca analiz kartları açılır */}
        {selectedBase && (
          <div
            className="animate-in fade-in slide-in-from-bottom-4 duration-500"
            style={{ animation: 'fadeSlideIn 0.45s cubic-bezier(0.16,1,0.3,1) both' }}
          >
            {/* Seçili üs başlığı */}
            <div className="mx-auto max-w-7xl px-6 pt-10">
              <div className="mb-2 flex items-center gap-3">
                <span className="h-3 w-3 animate-pulse rounded-full bg-cyan-400" />
                {selectedBase?.name ? (
                  <>
                    <h2 className="font-headline text-xl font-bold text-white">{selectedBase.name}</h2>
                    <span className="text-sm text-zinc-500">{selectedBase.country}</span>
                  </>
                ) : (
                  <h2 className="font-headline text-xl font-bold text-white">Konum Seçildi</h2>
                )}
                <button
                  onClick={() => setSelectedBase(null)}
                  className="ml-auto flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400 transition-colors hover:border-cyan-400/40 hover:text-cyan-400"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                  Seçimi kaldır
                </button>
              </div>
              {selectedBase?.description && (
                <p className="text-sm text-zinc-500">{selectedBase.description}</p>
              )}
            </div>

            <div className="mx-auto max-w-7xl space-y-24 px-6 py-12">
              <section className="grid grid-cols-1 gap-8 md:grid-cols-3">
                <div className="reveal reveal-d1 glass-card group rounded-xl p-8 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,207,252,0.1)]">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10 text-secondary transition-transform group-hover:scale-110">
                    <span className="material-symbols-outlined mso-fill">cloud</span>
                  </div>
                  <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Hava Durumu</div>
                  <div className="mb-2 font-headline text-4xl font-extrabold text-on-surface glow-num"><CountUp to={24} />°C</div>
                  <p className="text-sm text-on-surface-variant">Parçalı bulutlu, rüzgar hızı düşük. Fırlatış için ideal.</p>
                </div>
                <div className="reveal reveal-d2 glass-card group rounded-xl p-8 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(187,158,255,0.1)]">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-110">
                    <span className="material-symbols-outlined mso-fill">inventory_2</span>
                  </div>
                  <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Lojistik Puan</div>
                  <div className="mb-2 font-headline text-4xl font-extrabold text-on-surface glow-num"><CountUp to={9.2} decimals={1} />/10</div>
                  <p className="text-sm text-on-surface-variant">Tedarik zinciri verimliliği en üst düzeyde seyrediyor.</p>
                </div>
                <div className="reveal reveal-d3 glass-card group rounded-xl p-8 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(255,89,227,0.1)]">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-tertiary/10 text-tertiary transition-transform group-hover:scale-110">
                    <span className="material-symbols-outlined mso-fill">groups</span>
                  </div>
                  <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Nüfus Yoğunluğu</div>
                  <div className="mb-2 font-headline text-4xl font-extrabold text-on-surface glow-num">
                    <CountUp to={1240} /> <span className="text-sm font-normal opacity-50">/km²</span>
                  </div>
                  <p className="text-sm text-on-surface-variant">Çevresel etki analizi bölge için kararlı sonuçlar veriyor.</p>
                </div>
              </section>

              <section id="analiz" className="reveal grid grid-cols-1 items-start gap-8 scroll-mt-28 lg:grid-cols-5">
                <div className="space-y-8 rounded-xl bg-surface-container p-8 text-on-surface lg:col-span-2">
                  <div>
                    <h2 className="mb-2 font-headline text-2xl font-bold">Parametre Girişi</h2>
                    <p className="text-sm text-on-surface-variant">Analiz için gerekli değişkenleri manuel olarak düzenleyin.</p>
                  </div>
                  <form className="space-y-6" onSubmit={onAnalyze}>
                    <div>
                      <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                        Sıcaklık (°C)
                      </label>
                      <input
                        value={temperature}
                        onChange={(e) => setTemperature(e.target.value)}
                        className="w-full rounded-lg border-none border-b-2 border-transparent bg-surface-container-low px-4 py-3 text-on-surface transition-colors placeholder:text-outline focus:bg-surface-container-high focus:ring-0 focus:border-secondary dark:bg-surface-container-low"
                        placeholder="24"
                        type="number"
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Nüfus</label>
                      <input
                        value={population}
                        onChange={(e) => setPopulation(e.target.value)}
                        className="w-full rounded-lg border-none border-b-2 border-transparent bg-surface-container-low px-4 py-3 text-on-surface transition-colors focus:bg-surface-container-high focus:ring-0 focus:border-secondary dark:bg-surface-container-low"
                        placeholder="500000"
                        type="number"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                          Lojistik Skoru
                        </label>
                        <input
                          value={logisticsScore}
                          onChange={(e) => setLogisticsScore(e.target.value)}
                          className="w-full rounded-lg border-none border-b-2 border-transparent bg-surface-container-low px-4 py-3 text-on-surface transition-colors focus:bg-surface-container-high focus:ring-0 focus:border-secondary dark:bg-surface-container-low"
                          placeholder="8.5"
                          step="0.1"
                          type="number"
                          required
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                          Ek Parametre
                        </label>
                        <input
                          value={extra}
                          onChange={(e) => setExtra(e.target.value)}
                          className="w-full rounded-lg border-none border-b-2 border-transparent bg-surface-container-low px-4 py-3 text-on-surface transition-colors focus:bg-surface-container-high focus:ring-0 focus:border-secondary dark:bg-surface-container-low"
                          placeholder="Standart"
                          type="text"
                        />
                      </div>
                    </div>
                    {error && <p className="text-sm text-error">{error}</p>}
                    <button
                      type="submit"
                      disabled={loading}
                      className="premium-gradient flex w-full items-center justify-center gap-2 rounded-full py-4 font-headline font-bold text-on-primary-fixed shadow-[0_10px_30px_rgba(135,76,255,0.3)] transition-transform hover:scale-[1.04] disabled:opacity-60"
                    >
                      {loading ? <LoadingSpinner size="sm" className="border-on-surface" /> : null}
                      Analiz Et
                      <span className="material-symbols-outlined text-lg">analytics</span>
                    </button>
                  </form>
                </div>

                <div className="relative flex h-full min-h-[420px] flex-col justify-between overflow-hidden rounded-xl bg-surface-container-high p-8 text-on-surface sm:p-10 lg:col-span-3">
                  <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-[100px]" aria-hidden />
                  <div>
                    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                      <div>
                        <h2 className="mb-2 font-headline text-3xl font-extrabold">Model Sonucu</h2>
                        <p className="text-sm italic text-on-surface-variant">{result.engineVersion} tarafından oluşturuldu.</p>
                      </div>
                      <div
                        className={`inline-flex shrink-0 items-center gap-2 self-start rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-widest ${statusStyles(result.status)}`}
                      >
                        <span className="h-2 w-2 animate-pulse rounded-full bg-current opacity-80" />
                        {result.status}
                      </div>
                    </div>
                    <div className="mb-10 grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-12">
                      <div>
                        <div className="mb-1 text-xs text-on-surface-variant">Güven Aralığı</div>
                        <div className="font-headline text-5xl font-black text-on-surface glow-num">
                          <CountUp to={result.confidence} decimals={1} />
                          <span className="text-2xl font-normal opacity-40">%</span>
                        </div>
                      </div>
                      <div>
                        <div className="mb-1 text-xs text-on-surface-variant">Risk Faktörü</div>
                        <div className="font-headline text-5xl font-black text-error-dim glow-num">
                          <CountUp to={result.riskFactor} decimals={2} />
                          <span className="text-2xl font-normal opacity-40">σ</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg bg-surface/40 p-4">
                      <span className="text-sm font-medium text-on-surface">Atmosferik Kararlılık</span>
                      <div className="h-1.5 w-full max-w-[8rem] shrink-0 overflow-hidden rounded-full bg-surface-container sm:w-32">
                        <div
                          className="bar-animated h-full bg-secondary transition-all duration-700"
                          style={{ width: `${result.atmosphericStability}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg bg-surface/40 p-4">
                      <span className="text-sm font-medium text-on-surface">Jeopolitik Uygunluk</span>
                      <div className="h-1.5 w-full max-w-[8rem] shrink-0 overflow-hidden rounded-full bg-surface-container sm:w-32">
                        <div
                          className="bar-animated h-full bg-primary transition-all duration-700"
                          style={{ width: `${result.geopoliticalFit}%` }}
                        />
                      </div>
                    </div>
                    <p className="mt-6 text-xs leading-relaxed text-on-surface-variant">{result.summary}</p>
                  </div>
                </div>
              </section>

              <section id="gecmis" className="reveal section-scanline scroll-mt-28 rounded-xl border border-outline-variant/20 bg-surface-container/50 p-8 backdrop-blur-sm">
                <h2 className="font-headline text-2xl font-bold text-on-surface">Geçmiş Denemeler</h2>
                <ul className="mt-4 space-y-2 text-sm text-on-surface-variant">
                  <li>Simülasyon #A12 — Kennedy penceresi — Başarılı</li>
                  <li>Simülasyon #B04 — Guyane yörünge — Başarılı</li>
                  <li>Simülasyon #C91 — Tanegashima hava — Erteleme</li>
                </ul>
              </section>
            </div>

            <AboutContactBlock />
          </div>
        )}
      </main>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <Footer />
    </div>
  )
}
