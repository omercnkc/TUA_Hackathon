import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AboutContactBlock } from '../components/AboutContactBlock'
import { Footer } from '../components/Footer'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { Navbar } from '../components/Navbar'
import { WorldMap } from '../components/WorldMap'
import { postPredict } from '../services/api'

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


export function Home({ theme, onToggleTheme }) {
  const location = useLocation()
  const [rocketIdx, setRocketIdx] = useState('0')
  const [result, setResult] = useState(null)
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

  const runAnalysis = useCallback(async (base, rIdx) => {
    if (!base?.id == null) return
    setError(null)
    setLoading(true)
    try {
      const data = await postPredict({
        rocket_idx: Number(rIdx ?? 0),
        site_idx: base.id,
      })
      setResult(data.raw)
    } catch {
      setError('Analiz isteği başarısız. Flask API çalışıyor mu kontrol edin.')
    } finally {
      setLoading(false)
    }
  }, [])

  // Haritadan yer seçilince otomatik analiz çalıştır
  useEffect(() => {
    if (!selectedBase || selectedBase.id == null) { setResult(null); return }
    runAnalysis(selectedBase, rocketIdx)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBase?.id])

  const onAnalyze = (e) => {
    e.preventDefault()
    runAnalysis(selectedBase, rocketIdx)
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
                  <div className="mb-2 font-headline text-4xl font-extrabold text-on-surface glow-num">
                    {result?.['METEOROLOJİ_VERİSİ']?.['Sicaklik_C'] != null
                      ? <><CountUp key={result['METEOROLOJİ_VERİSİ']['Sicaklik_C']} to={result['METEOROLOJİ_VERİSİ']['Sicaklik_C']} decimals={1} />°C</>
                      : <span className="text-2xl text-on-surface-variant opacity-40">—</span>}
                  </div>
                  <p className="text-sm text-on-surface-variant">
                    {result ? `Rüzgar: ${result['METEOROLOJİ_VERİSİ']?.['Rüzgar_Hızı'] ?? '—'}` : 'Simülasyon sonucu bekleniyor.'}
                  </p>
                </div>
                <div className="reveal reveal-d2 glass-card group rounded-xl p-8 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(187,158,255,0.1)]">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-110">
                    <span className="material-symbols-outlined mso-fill">inventory_2</span>
                  </div>
                  <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Lojistik Puan</div>
                  <div className="mb-2 font-headline text-4xl font-extrabold text-on-surface glow-num">
                    {result?.['SAHA_ANALİZİ']?.['Guvenilirlik_Puani'] != null
                      ? <><CountUp key={result['SAHA_ANALİZİ']['Guvenilirlik_Puani']} to={result['SAHA_ANALİZİ']['Guvenilirlik_Puani']} decimals={1} />/10</>
                      : <span className="text-2xl text-on-surface-variant opacity-40">—</span>}
                  </div>
                  <p className="text-sm text-on-surface-variant">
                    {result ? `Başarı oranı: ${result['SAHA_ANALİZİ']?.['Basari_Yuzdesi'] ?? '—'} · Ekvator: ${result['SAHA_ANALİZİ']?.['Ekvator_Skoru'] ?? '—'}` : 'Simülasyon sonucu bekleniyor.'}
                  </p>
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
                {/* Sol: Parametre formu */}
                <div className="space-y-6 rounded-xl bg-surface-container p-8 text-on-surface lg:col-span-2">
                  <div>
                    <h2 className="mb-2 font-headline text-2xl font-bold">Simülasyon Parametresi</h2>
                    <p className="text-sm text-on-surface-variant">Roket seçin. Fırlatma sahası haritadan otomatik alınır.</p>
                  </div>
                  <form className="space-y-6" onSubmit={onAnalyze}>
                    <div>
                      <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                        Roket İndeksi
                      </label>
                      <input
                        value={rocketIdx}
                        onChange={(e) => setRocketIdx(e.target.value)}
                        className="w-full rounded-lg bg-surface-container-low px-4 py-3 text-on-surface transition-colors focus:bg-surface-container-high focus:outline-none focus:ring-1 focus:ring-secondary"
                        placeholder="0"
                        type="number"
                        min="0"
                        required
                      />
                    </div>
                    <div className="rounded-lg bg-surface-container-low px-4 py-3">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Seçili Üs</span>
                      <p className="mt-1 text-sm text-on-surface">
                        {selectedBase
                          ? `${selectedBase.name} — ${selectedBase.country} (idx: ${selectedBase.id})`
                          : 'Haritadan bir fırlatma sahası seçin'}
                      </p>
                    </div>
                    {error && <p className="text-sm text-error">{error}</p>}
                    <button
                      type="submit"
                      disabled={loading || !selectedBase}
                      className="premium-gradient flex w-full items-center justify-center gap-2 rounded-full py-4 font-headline font-bold text-on-primary-fixed shadow-[0_10px_30px_rgba(135,76,255,0.3)] transition-transform hover:scale-[1.04] disabled:opacity-60"
                    >
                      {loading ? <LoadingSpinner size="sm" className="border-on-surface" /> : null}
                      Analiz Et
                      <span className="material-symbols-outlined text-lg">analytics</span>
                    </button>
                  </form>
                </div>

                {/* Sağ: Model sonucu */}
                <div className="relative flex min-h-[420px] flex-col overflow-hidden rounded-xl bg-surface-container-high p-8 text-on-surface sm:p-10 lg:col-span-3">
                  <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-[100px]" aria-hidden />

                  {/* Boş durum */}
                  {!result && !loading && (
                    <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center text-on-surface-variant">
                      <span className="material-symbols-outlined text-5xl opacity-30">rocket_launch</span>
                      <p className="text-sm">Haritadan bir fırlatma sahası seçin,<br />simülasyon otomatik başlar.</p>
                    </div>
                  )}

                  {/* Yükleniyor */}
                  {loading && (
                    <div className="flex flex-1 flex-col items-center justify-center gap-4">
                      <LoadingSpinner />
                      <p className="text-sm text-on-surface-variant">Simülasyon çalışıyor...</p>
                    </div>
                  )}

                  {/* Sonuç */}
                  {result && !loading && (
                    <div className="flex flex-col gap-5">
                      {/* Başlık + GO/NO-GO rozeti */}
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h2 className="font-headline text-3xl font-extrabold">Model Sonucu</h2>
                          <p className="mt-1 text-sm text-on-surface-variant">
                            {result['GÖREV_BİLGİLERİ']?.['Operatör']} · {result['GÖREV_BİLGİLERİ']?.['Roket']}
                          </p>
                          <p className="text-xs text-on-surface-variant opacity-60">
                            {result['GÖREV_BİLGİLERİ']?.['Fırlatma_Sahas']}
                          </p>
                        </div>
                        <div
                          className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-widest ${
                            result['FIRLATMA_DURUMU'] === 'GO'
                              ? 'border-secondary/20 bg-secondary-container/20 text-secondary'
                              : 'border-error/30 bg-error/10 text-error'
                          }`}
                        >
                          <span className="h-2 w-2 animate-pulse rounded-full bg-current opacity-80" />
                          {result['FIRLATMA_DURUMU']}
                        </div>
                      </div>

                      {/* Teknik Analiz */}
                      <div>
                        <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Teknik Analiz</div>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                          {[
                            { label: 'TWR Oranı', value: result['TEKNİK_ANALİZ_RAPORU']?.['TWR_Oranı'], accent: true },
                            { label: 'Delta-v', value: result['TEKNİK_ANALİZ_RAPORU']?.['Delta_v_Kapasitesi'] },
                            { label: 'Max-Q', value: result['TEKNİK_ANALİZ_RAPORU']?.['Max_Q_Basıncı'] },
                            { label: 'İtki Kuvveti', value: result['TEKNİK_ANALİZ_RAPORU']?.['İtki_Kuvveti_N'] },
                            { label: 'Kalkış Kütlesi', value: result['TEKNİK_ANALİZ_RAPORU']?.['Kalkış_Ağırlığı_kg'] },
                            { label: 'Rüzgar', value: result['METEOROLOJİ_VERİSİ']?.['Rüzgar_Hızı'] },
                          ].map(({ label, value, accent }) => (
                            <div key={label} className="rounded-lg bg-surface/40 p-3">
                              <div className="text-[10px] uppercase tracking-wider text-on-surface-variant">{label}</div>
                              <div className={`mt-1 font-headline text-sm font-bold ${accent ? 'text-secondary' : 'text-on-surface'}`}>
                                {value ?? '—'}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Saha Analizi */}
                      <div>
                        <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Saha Analizi</div>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                          {[
                            { label: 'Ekvator Skoru', value: result['SAHA_ANALİZİ']?.['Ekvator_Skoru'] },
                            { label: 'Başarı Oranı', value: result['SAHA_ANALİZİ']?.['Basari_Yuzdesi'] },
                            { label: 'Güvenilirlik', value: result['SAHA_ANALİZİ']?.['Guvenilirlik_Puani'] },
                            { label: 'Toplam Atış', value: result['SAHA_ANALİZİ']?.['Toplam_Atis'] },
                            { label: 'Rakım', value: result['SAHA_ANALİZİ']?.['Rakım_m'] != null ? `${result['SAHA_ANALİZİ']['Rakım_m']} m` : '—' },
                            { label: 'Sıcaklık', value: result['METEOROLOJİ_VERİSİ']?.['Sicaklik_C'] != null ? `${result['METEOROLOJİ_VERİSİ']['Sicaklik_C']} °C` : '—' },
                          ].map(({ label, value }) => (
                            <div key={label} className="rounded-lg bg-surface/40 p-3">
                              <div className="text-[10px] uppercase tracking-wider text-on-surface-variant">{label}</div>
                              <div className="mt-1 font-headline text-sm font-bold text-on-surface">{value ?? '—'}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Risk notları */}
                      <div className="rounded-lg bg-surface/40 p-4">
                        <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                          Risk & Engel Notları
                        </div>
                        <p className="text-xs leading-relaxed text-on-surface-variant">
                          {Array.isArray(result['RİSK_VE_ENGEL_NOTLARI'])
                            ? result['RİSK_VE_ENGEL_NOTLARI'].join(' | ')
                            : result['RİSK_VE_ENGEL_NOTLARI']}
                        </p>
                      </div>
                    </div>
                  )}
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
