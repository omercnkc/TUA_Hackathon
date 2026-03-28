export function Footer() {
  return (
    <footer className="flex w-full flex-col items-center justify-between gap-6 border-t border-zinc-800/30 bg-zinc-950 px-8 py-10 font-body text-xs uppercase tracking-widest md:flex-row md:px-12 dark:bg-zinc-950 bg-slate-100/80 border-slate-200/80">
      <div className="text-center text-zinc-500 md:text-left dark:text-zinc-500 text-slate-600">
        © 2024 COSMOS. The Ethereal Engine.
      </div>
      <div className="flex flex-wrap justify-center gap-6 md:gap-8">
        <a className="text-zinc-500 transition-colors hover:text-secondary dark:text-zinc-500 dark:hover:text-secondary text-slate-600" href="#iletisim">
          Contact
        </a>
        <a
          className="text-zinc-500 transition-colors hover:text-secondary dark:text-zinc-500 dark:hover:text-secondary text-slate-600"
          href="mailto:hello@cosmos.example"
        >
          Email
        </a>
        <a className="text-zinc-500 transition-colors hover:text-secondary" href="#">
          Privacy Policy
        </a>
        <a className="text-zinc-500 transition-colors hover:text-secondary" href="#">
          Terms
        </a>
      </div>
    </footer>
  )
}
