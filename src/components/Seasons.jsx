import SectionHead from "./SectionHead";
import { MONTHLY_RAIN_MM, MONTHS, SEASONS } from "../lib/data";

export default function Seasons() {
  const now = new Date().getMonth();
  const max = Math.max(...MONTHLY_RAIN_MM);
  const currentSeason = SEASONS.find((s) => s.months.includes(now));

  return (
    <section id="seasons" className="bg-deep py-24">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHead title="Kolkata's rain, month by month">
          The city gets about 1,700 mm of rain a year, and most of it arrives in four months. Today falls in the {currentSeason.name.toLowerCase()} season.
        </SectionHead>

        <div className="overflow-x-auto">
          <ul className="flex h-64 min-w-[560px] items-end gap-2 sm:gap-3" aria-label="Average monthly rainfall in millimetres">
            {MONTHLY_RAIN_MM.map((mm, i) => {
              const isNow = i === now;
              return (
                <li key={MONTHS[i]} className="flex h-full flex-1 flex-col items-center justify-end">
                  <span className={`mb-1 text-xs font-semibold ${isNow ? "text-taxi" : "text-mist/70"}`}>{mm}</span>
                  <div
                    className="w-full rounded-t-md transition-[height] duration-700"
                    style={{
                      height: `${(mm / max) * 78}%`,
                      minHeight: 4,
                      backgroundColor: isNow ? "#F2B632" : i >= 5 && i <= 8 ? "#3B8FA8" : "#245568",
                    }}
                  />
                  <span className={`mt-2 text-xs ${isNow ? "font-bold text-taxi" : "text-mist/70"}`}>{MONTHS[i]}</span>
                </li>
              );
            })}
          </ul>
        </div>
        <p className="mt-3 text-sm text-mist/60">
          Approximate long-term average rainfall in mm. The yellow bar is the current month.
        </p>

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SEASONS.map((s) => {
            const on = s.key === currentSeason.key;
            return (
              <li
                key={s.key}
                className={`rounded-2xl p-5 ring-1 ${
                  on ? "bg-taxi text-ink ring-taxi" : "bg-ink/50 text-mist ring-white/10"
                }`}
              >
                <h3 className="font-display text-2xl font-bold">{s.name}</h3>
                <p className={`text-sm ${on ? "text-ink/70" : "text-mist/60"}`}>{s.range}</p>
                <p className="mt-3 font-display text-lg font-bold">{s.rain}</p>
                <p className={`mt-2 text-sm leading-relaxed ${on ? "text-ink/85" : "text-mist/80"}`}>{s.text}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
