const LINKS = [
  { href: "#now", label: "Today" },
  { href: "#forecast", label: "Forecast" },
  { href: "#hotspots", label: "Hotspots" },
  { href: "#seasons", label: "Seasons" },
  { href: "#why", label: "Why it floods" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-ink/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <a href="#now" className="flex items-baseline gap-2">
          <span className="font-display text-xl font-extrabold tracking-tight text-white">SHOW</span>
          <span className="hidden text-sm text-mist/60 sm:inline"> waterlogging in KOLKATA </span>
        </a>
        <ul className="hidden gap-6 text-sm text-mist/80 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="rounded py-1 transition hover:text-taxi">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
