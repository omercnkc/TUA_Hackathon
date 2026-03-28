import { Footer } from '../components/Footer'
import { Navbar } from '../components/Navbar'

export function Compare({ theme, onToggleTheme }) {
  return (
    <div className="min-h-screen bg-background font-body text-on-background">
      <Navbar theme={theme} onToggleTheme={onToggleTheme} />

      <main className="mx-auto min-h-screen max-w-7xl px-6 py-12 md:px-12 lg:px-24">
        <header className="mb-12 space-y-4 md:mb-16">
          <div className="mb-4 inline-flex items-center rounded-full border border-outline-variant/20 bg-surface-container-high px-3 py-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary">Karşılaştırma Motoru</span>
          </div>
          <h1 className="font-headline text-4xl font-extrabold tracking-tighter text-on-surface md:text-6xl lg:text-7xl">
            Karşılaştırma Paneli
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-on-surface-variant">
            Veri setlerinizi yan yana getirin. Derinlemesine metrik analizi ile performans farklılıklarını saniyeler içinde
            tespit edin.
          </p>
        </header>

        <section className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-2">
          <div className="glass-card relative flex flex-col space-y-8 overflow-hidden rounded-xl p-8">
            <div className="absolute -right-16 -top-16 z-0 h-32 w-32 rounded-full bg-primary/10 blur-[60px]" />
            <div className="relative z-10 flex items-start justify-between">
              <div>
                <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                  Veri Seti A
                </span>
                <h3 className="font-headline text-2xl font-bold text-on-surface md:text-3xl">Global Pazar Analizi</h3>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-outline-variant/10 bg-surface-container-highest">
                <span className="material-symbols-outlined text-primary">analytics</span>
              </div>
            </div>
            <div className="z-10 space-y-6">
              <div className="relative flex h-48 w-full items-end gap-2 overflow-hidden rounded-lg bg-surface-container-lowest p-4 dark:bg-surface-container-lowest bg-slate-200/50">
                <div className="h-1/2 w-full rounded-t-sm bg-primary/20" />
                <div className="h-3/4 w-full rounded-t-sm bg-primary/20" />
                <div className="h-2/3 w-full rounded-t-sm bg-primary/40" />
                <div className="h-full w-full rounded-t-sm bg-primary/60" />
                <div className="h-1/2 w-full rounded-t-sm bg-primary/20" />
                <div className="h-1/3 w-full rounded-t-sm bg-primary/30" />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent opacity-80 dark:opacity-100" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-surface-container p-4 dark:bg-surface-container bg-white/60">
                  <span className="text-[10px] uppercase tracking-wider text-on-surface-variant">Büyüme Oranı</span>
                  <div className="mt-1 text-2xl font-bold text-secondary">+14.2%</div>
                </div>
                <div className="rounded-lg bg-surface-container p-4 dark:bg-surface-container bg-white/60">
                  <span className="text-[10px] uppercase tracking-wider text-on-surface-variant">Etkileşim</span>
                  <div className="mt-1 text-2xl font-bold text-on-surface">42.5k</div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-outline-variant/10 py-2">
                  <span className="text-sm text-on-surface-variant">Dönüşüm Oranı</span>
                  <span className="text-sm font-medium text-on-surface">3.8%</span>
                </div>
                <div className="flex items-center justify-between border-b border-outline-variant/10 py-2">
                  <span className="text-sm text-on-surface-variant">Hemen Çıkma</span>
                  <span className="text-sm font-medium text-on-surface">22.4%</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              className="ambient-glow z-10 w-full rounded-full bg-gradient-to-r from-primary to-primary-dim py-4 text-sm font-bold tracking-tight text-black transition-transform duration-300 hover:scale-[1.02] dark:text-on-primary-fixed"
            >
              Detayları Görüntüle
            </button>
          </div>

          <div className="glass-card relative flex flex-col space-y-8 overflow-hidden rounded-xl p-8">
            <div className="absolute -right-16 -top-16 z-0 h-32 w-32 rounded-full bg-secondary/10 blur-[60px]" />
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                  Veri Seti B
                </span>
                <h3 className="font-headline text-2xl font-bold text-on-surface md:text-3xl">Yerel Satış Performansı</h3>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-outline-variant/10 bg-surface-container-highest">
                <span className="material-symbols-outlined text-secondary">trending_up</span>
              </div>
            </div>
            <div className="z-10 space-y-6">
              <div className="relative flex h-48 w-full items-end gap-2 overflow-hidden rounded-lg bg-surface-container-lowest p-4 dark:bg-surface-container-lowest bg-slate-200/50">
                <div className="h-1/3 w-full rounded-t-sm bg-secondary/10" />
                <div className="h-2/3 w-full rounded-t-sm bg-secondary/20" />
                <div className="h-1/2 w-full rounded-t-sm bg-secondary/10" />
                <div className="h-3/4 w-full rounded-t-sm bg-secondary/40" />
                <div className="h-2/3 w-full rounded-t-sm bg-secondary/60" />
                <div className="h-1/2 w-full rounded-t-sm bg-secondary/20" />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent opacity-80 dark:opacity-100" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-surface-container p-4 dark:bg-surface-container bg-white/60">
                  <span className="text-[10px] uppercase tracking-wider text-on-surface-variant">Büyüme Oranı</span>
                  <div className="mt-1 text-2xl font-bold text-error">-2.1%</div>
                </div>
                <div className="rounded-lg bg-surface-container p-4 dark:bg-surface-container bg-white/60">
                  <span className="text-[10px] uppercase tracking-wider text-on-surface-variant">Etkileşim</span>
                  <div className="mt-1 text-2xl font-bold text-on-surface">12.8k</div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-outline-variant/10 py-2">
                  <span className="text-sm text-on-surface-variant">Dönüşüm Oranı</span>
                  <span className="text-sm font-medium text-on-surface">1.2%</span>
                </div>
                <div className="flex items-center justify-between border-b border-outline-variant/10 py-2">
                  <span className="text-sm text-on-surface-variant">Hemen Çıkma</span>
                  <span className="text-sm font-medium text-on-surface">45.8%</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              className="z-10 w-full rounded-full border border-outline-variant/30 py-4 text-sm font-bold tracking-tight text-on-surface transition-colors duration-300 hover:bg-surface-container-highest"
            >
              Kıyaslamayı Düzenle
            </button>
          </div>
        </section>

        <section className="mt-16 md:mt-20">
              <div className="rounded-xl border-none glass-card p-8 md:p-10">
            <div className="mb-10 flex flex-col justify-between gap-8 md:mb-12 md:flex-row md:items-center">
              <div>
                <h2 className="mb-2 font-headline text-2xl font-bold text-on-surface md:text-3xl">Kritik Farklılıklar</h2>
                <p className="text-on-surface-variant">Yapay zeka motorumuz tarafından tespit edilen temel sapmalar.</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex -space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-surface bg-slate-300 text-[10px] font-bold text-slate-900 dark:bg-zinc-800 dark:text-on-surface">
                    AI
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-surface bg-primary/20">
                    <span className="material-symbols-outlined text-sm text-primary">auto_awesome</span>
                  </div>
                </div>
                <span className="text-xs font-semibold tracking-wider text-tertiary">ANALİZ TAMAMLANDI</span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10">
                  <span className="material-symbols-outlined text-secondary">speed</span>
                </div>
                <h4 className="font-headline text-xl font-bold text-on-surface">Hız Farkı</h4>
                <p className="text-sm leading-relaxed text-on-surface-variant">
                  Global veri seti, yerel verilere göre %40 daha hızlı yüklenme ve tepki süresi gösteriyor.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <span className="material-symbols-outlined text-primary">groups</span>
                </div>
                <h4 className="font-headline text-xl font-bold text-on-surface">Kitle Segmenti</h4>
                <p className="text-sm leading-relaxed text-on-surface-variant">
                  B grubunda genç nüfus odaklı bir kümelenme varken, A grubu daha dengeli bir demografik yapı sergiliyor.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-tertiary/10">
                  <span className="material-symbols-outlined text-tertiary">bolt</span>
                </div>
                <h4 className="font-headline text-xl font-bold text-on-surface">Tahmini Verim</h4>
                <p className="text-sm leading-relaxed text-on-surface-variant">
                  Gelecek çeyrek projeksiyonlarında Global Pazar %22 daha fazla ROI potansiyeli sunmaktadır.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
