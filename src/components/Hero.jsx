import RainCanvas from "./RainCanvas";
import { SCENARIO_OPTIONS } from "../lib/weather";
import { wxLabel } from "../lib/format";

const TICKS = [0, 25, 50, 75, 100];

function Gauge({ score, color }) {
  return (
    <figure className="mx-auto flex flex-col items-center md:mx-0">
      <div
        className="relative h-[22rem] w-28 overflow-hidden rounded-2xl border-2 border-mist/40 bg-ink/50"
        role="img"
        aria-label={`Waterlogging risk gauge at ${score} out of 100`}
      >
        <div
          className="absolute inset-x-0 bottom-0 transition-[height] duration-1000 ease-out"
          style={{ height: `${Math.max(score, 3)}%`, backgroundColor: color, opacity: 0.88 }}
        >
          <svg
            className="animate-wave absolute -top-2.5 left-0 h-3 w-[200%]"
            viewBox="0 0 400 20"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M0 10 Q 50 0 100 10 T 200 10 T 300 10 T 400 10 V20 H0Z" fill={color} />
          </svg>
        </div>
        {TICKS.map((t) => (
          <div
            key={t}
            className="absolute inset-x-0 flex items-center justify-between px-2 text-xs font-semibold text-white"
            style={{ bottom: `calc(${t}% - ${t === 100 ? 14 : t === 0 ? 0 : 7}px)` }}
          >
            <span className="drop-shadow">{t}</span>
            <span className="h-0.5 w-5 bg-white/80" />
          </div>
        ))}
      </div>
      <figcaption className="mt-3 text-center text-sm text-mist/70">Street gauge, risk out of 100</figcaption>
    </figure>
  );
}

export default function Hero({ data, risk, scenario, setScenario, updatedAt, onRefresh, loading }) {
  const c = data.current;
  const intensity = Math.min(1, Math.max(c.rain, risk.peak) / 20);

  const badge =
    data.source === "live"
      ? "Live weather"
      : data.source === "simulated"
      ? "Simulated scenario"
      : "Offline demo data";

  const stats = [
    { label: "Temperature", value: `${Math.round(c.temp)}°C`, sub: `Feels like ${Math.round(c.feels)}°C` },
    { label: "Humidity", value: `${Math.round(c.humidity)}%`, sub: wxLabel(c.code) },
    { label: "Rain right now", value: `${c.rain.toFixed(1)} mm`, sub: `Wind ${Math.round(c.wind)} km/h` },
    { label: "Next 24 hours", value: `${risk.total24.toFixed(0)} mm`, sub: `${Math.round(risk.past24)} mm fell in the last 24 h` },
  ];

  return (
    <section id="now" className="relative isolate overflow-hidden bg-gradient-to-b from-ink via-deep to-ink">
      <RainCanvas intensity={intensity} />
      <div className="relative z-10 mx-auto grid max-w-6xl gap-12 px-5 pb-20 pt-14 md:grid-cols-[1fr_auto] md:items-center md:pt-20">
        <div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded-full border border-rain/50 bg-rain/10 px-3 py-1 font-semibold text-rain">{badge}</span>
            {updatedAt && data.source === "live" && (
              <span className="text-mist/60">
                Updated {updatedAt.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}
              </span>
            )}
            <button
              onClick={onRefresh}
              disabled={loading}
              className="rounded-full px-3 py-1 text-mist/70 underline-offset-4 hover:text-taxi hover:underline disabled:opacity-50"
            >
              {loading ? "Refreshing" : "Refresh"}
            </button>
          </div>

          <h1 className="mt-6 max-w-2xl font-display text-5xl font-extrabold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Will Kolkata's streets hold today's rain?
          </h1>

          <div
            className="mt-7 inline-flex flex-wrap items-baseline gap-x-3 rounded-xl px-5 py-3 text-ink"
            style={{ backgroundColor: risk.level.color }}
          >
            <span className="font-display text-2xl font-extrabold">{risk.level.label} risk</span>
            <span className="text-sm font-semibold">Score {risk.score} out of 100</span>
          </div>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-mist/90">{risk.level.advice}</p>

          <dl className="mt-10 grid max-w-2xl grid-cols-2 gap-y-6 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="border-l-2 border-taxi/70 pl-4">
                <dt className="text-sm text-mist/60">{s.label}</dt>
                <dd className="font-display text-3xl font-bold text-white">{s.value}</dd>
                <dd className="text-xs text-mist/60">{s.sub}</dd>
              </div>
            ))}
          </dl>

          <fieldset className="mt-10">
            <legend className="text-sm text-mist/70">
              It may be dry today. Try a rain scenario to see how the score reacts.
            </legend>
            <div className="mt-3 inline-flex flex-wrap gap-2">
              {SCENARIO_OPTIONS.map((o) => (
                <button
                  key={o.key}
                  onClick={() => setScenario(o.key)}
                  aria-pressed={scenario === o.key}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    scenario === o.key
                      ? "border-taxi bg-taxi text-ink"
                      : "border-white/25 text-mist hover:border-taxi hover:text-taxi"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <Gauge score={risk.score} color={risk.level.color} />
      </div>
    </section>
  );
}
