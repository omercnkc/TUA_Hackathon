import { useState } from 'react'

function FootLink({ href, children, onClick }) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="group flex items-start gap-2 text-sm text-zinc-400 transition-colors hover:text-cyan-400"
    >
      <span className="mt-0.5 shrink-0 text-cyan-500/80 transition-colors group-hover:text-cyan-400" aria-hidden>
        ›
      </span>
      <span>{children}</span>
    </a>
  )
}

function ColTitle({ children }) {
  return (
    <h3 className="mb-4 font-headline text-xs font-bold uppercase tracking-[0.2em] text-white">{children}</h3>
  )
}

export function AboutContactBlock() {
  const [open, setOpen] = useState(false)
  const [openMisyon, setOpenMisyon] = useState(false)

  return (
    <section
      id="hakkimizda"
      className="scroll-mt-28 w-full overflow-hidden bg-[#141416] text-zinc-100 reveal"
    >
      <div className="about-gradient-bar w-full" />
      <div className="border-b border-white/10 px-6 py-8 md:px-10 md:py-10">
        <div className="flex flex-col items-center gap-6">
          <div className="flex shrink-0 items-center justify-center">
            <img
              src="/cosmos-logo.png"
              alt="COSMOS Software Team"
              className="animate-float h-48 w-auto max-w-[420px] object-contain md:h-64"
            />
          </div>
          <div className="min-w-0 text-center">
            <p className="font-headline text-2xl font-bold tracking-tight text-white md:text-3xl">COSMOS SOFTWARE TEAM</p>
            <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.25em] text-zinc-500">
              Aerospatial &amp; Software Engineering
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 px-6 py-10 md:grid-cols-2 md:gap-14 md:px-10 md:py-12">
        <div>
          <ColTitle>Hakkımızda</ColTitle>
          <ul className="flex flex-col gap-3">
            <li>
              <FootLink
                href="#"
                onClick={(e) => { e.preventDefault(); setOpen((v) => !v) }}
              >
                Biz kimiz?
                <span className="ml-1 text-xs transition-transform duration-300" style={{ display: 'inline-block', transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}>›</span>
              </FootLink>
              {open && (
                <p className="mt-3 ml-4 max-w-sm text-xs leading-relaxed text-zinc-500"
                   style={{ animation: 'fadeIn 0.3s ease' }}>
                  Veri odaklı çözümler geliştiren yenilikçi bir teknoloji ekibiyiz. Amacımız, karmaşık verileri anlamlı
                  analizlere dönüştürerek hızlı ve doğru karar süreçlerini desteklemektir. Modern teknolojiler ve yapay zekâ
                  destekli sistemlerle kullanıcı odaklı, güvenilir ve sürdürülebilir çözümler sunuyoruz.
                </p>
              )}
            </li>
            <li>
              <FootLink
                href="#"
                onClick={(e) => { e.preventDefault(); setOpenMisyon((v) => !v) }}
              >
                Misyon ve yaklaşım
                <span className="ml-1 text-xs" style={{ display: 'inline-block', transform: openMisyon ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>›</span>
              </FootLink>
              {openMisyon && (
                <div className="mt-3 ml-4 max-w-sm space-y-3" style={{ animation: 'fadeIn 0.3s ease' }}>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-500 mb-1">Misyon</p>
                    <p className="text-xs leading-relaxed text-zinc-500">
                      Veriyi anlamlı ve uygulanabilir içgörülere dönüştürerek kullanıcıların hızlı, doğru ve etkili kararlar almasını sağlamak. Geliştirdiğimiz yenilikçi ve kullanıcı odaklı çözümlerle analiz süreçlerini daha erişilebilir ve verimli hale getirmeyi hedefliyoruz.
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-violet-400 mb-1">Vizyon</p>
                    <p className="text-xs leading-relaxed text-zinc-500">
                      Yapay zekâ ve veri teknolojilerini en etkin şekilde kullanarak, geleceğin akıllı karar destek sistemlerini geliştiren öncü ve güvenilir bir platform olmak. Sürekli gelişen teknolojiye uyum sağlayarak global ölçekte değer üreten çözümler sunmak.
                    </p>
                  </div>
                </div>
              )}
            </li>
            <li>
              <FootLink href="#hakkimizda-ozet">Teknoloji ve yenilik</FootLink>
            </li>
            <li>
              <FootLink href="#hakkimizda-ozet">Sürdürülebilir çözümler</FootLink>
            </li>
          </ul>
        </div>

        <div id="iletisim" className="scroll-mt-28 md:border-l md:border-white/10 md:pl-14">
          <ColTitle>İletişim</ColTitle>
          <ul className="flex flex-col gap-3">
            <li>
              <FootLink href="mailto:hello@cosmos.example">E-posta — hello@cosmos.example</FootLink>
            </li>
            <li>
              <span className="flex items-start gap-2 text-sm text-zinc-400">
                <span className="mt-0.5 text-cyan-500/80" aria-hidden>
                  ›
                </span>
                <span>
                  Adres
                  <br />
                  <span className="text-zinc-500">Elazığ Teknokent · Türkiye</span>
                </span>
              </span>
            </li>
            <li>
              <span className="flex items-start gap-2 text-sm text-zinc-400">
                <span className="mt-0.5 text-cyan-500/80" aria-hidden>
                  ›
                </span>
                <span>
                  Telefon
                  <br />
                  <span className="text-zinc-500"> Talep üzerine paylaşılır</span>
                </span>
              </span>
            </li>
            <li>
              <span className="flex items-start gap-2 text-sm text-zinc-400">
                <span className="mt-0.5 text-cyan-500/80" aria-hidden>
                  ›
                </span>
                <span>Çalışma saatleri — Hafta içi 09:00–17:00</span>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
