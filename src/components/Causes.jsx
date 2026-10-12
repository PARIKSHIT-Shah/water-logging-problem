import SectionHead from "./SectionHead";
import { CAUSES, TIPS } from "../lib/data";

export default function Causes() {
  return (
    <section id="why" className="bg-mist py-24 text-ink">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHead light title="Why Kolkata floods">
          Rain alone does not flood a city. It floods when land, drains and the river all fail to carry the water away at once.
        </SectionHead>

        <ol className="divide-y divide-ink/15 border-y border-ink/15">
          {CAUSES.map((c) => (
            <li key={c.title} className="grid gap-2 py-6 md:grid-cols-[1fr_1.4fr] md:gap-10">
              <h3 className="font-display text-2xl font-bold">{c.title}</h3>
              <p className="max-w-xl text-lg leading-relaxed text-ink/75">{c.text}</p>
            </li>
          ))}
        </ol>

        <h2 className="mb-8 mt-24 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">Stay safe</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {TIPS.map((t, i) => (
            <div key={t.when} className={`rounded-2xl p-6 ${i === 1 ? "bg-ink text-mist" : "bg-white ring-1 ring-ink/10"}`}>
              <h3 className="font-display text-2xl font-bold">{t.when}</h3>
              <ul className="mt-4 space-y-3">
                {t.items.map((item) => (
                  <li key={item} className={`flex gap-3 leading-relaxed ${i === 1 ? "text-mist/90" : "text-ink/80"}`}>
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-taxi" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
