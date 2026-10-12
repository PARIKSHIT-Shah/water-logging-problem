import { useState } from "react";
import SectionHead from "./SectionHead";
import { FACTOR_MAX } from "../lib/weather";
import { fmtDay, fmtHour, wxLabel } from "../lib/format";

const barColor = (mm) => (mm < 0.2 ? "#2B5566" : mm < 2.5 ? "#7FD0E4" : mm < 7.5 ? "#F2B632" : "#E2553F");

const FACTORS = [
  ["intensity", "Rain intensity in the next 6 hours"],
  ["volume", "Rain expected in the next 24 hours"],
  ["saturation", "Rain already fallen in the last 24 hours"],
  ["chance", "Chance of rain in the next 12 hours"],
  ["humidity", "Very humid air"],
  ["season", "Monsoon months"],
];

function HourlyChart({ hours }) {
  const peakIdx = hours.reduce((best, h, i) => (h.mm > hours[best].mm ? i : best), 0);
  const [active, setActive] = useState(peakIdx);
  const idx = Math.min(active, hours.length - 1);

  const W = 720;
  const H = 210;
  const padL = 30;
  const padB = 26;
  const padT = 8;
  const chartH = H - padB - padT;
  const max = Math.max(5, ...hours.map((h) => h.mm));
  const step = (W - padL) / hours.length;
  const sel = hours[idx];

  const probLine = hours
    .map((h, i) => `${padL + i * step + step / 2},${padT + chartH - (h.prob / 100) * chartH}`)
    .join(" ");

  return (
    <div>
      <p className="min-h-[3rem] text-lg text-white">
        <span className="font-display text-2xl font-bold">{fmtHour(sel.time)}</span>
        <span className="ml-3 text-mist/80">
          {sel.mm.toFixed(1)} mm of rain, {sel.prob}% chance
        </span>
      </p>
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="min-w-[560px] w-full" role="img" aria-label="Hourly rainfall for the next 24 hours">
          {[0, 0.5, 1].map((f) => (
            <g key={f}>
              <line x1={padL} x2={W} y1={padT + chartH * (1 - f)} y2={padT + chartH * (1 - f)} stroke="rgba(220,233,236,0.12)" />
              <text x={padL - 6} y={padT + chartH * (1 - f) + 4} textAnchor="end" fontSize="10" fill="rgba(220,233,236,0.6)">
                {(max * f).toFixed(max < 10 ? 1 : 0)}
              </text>
            </g>
          ))}
          {hours.map((h, i) => {
            const bh = Math.max(2, (h.mm / max) * chartH);
            const x = padL + i * step;
            return (
              <g key={h.time}>
                <rect
                  x={x + 2}
                  y={padT + chartH - bh}
                  width={step - 4}
                  height={bh}
                  rx="3"
                  fill={barColor(h.mm)}
                  opacity={i === idx ? 1 : 0.8}
                  stroke={i === idx ? "#fff" : "none"}
                  strokeWidth="1.5"
                />
                <rect
                  x={x}
                  y={0}
                  width={step}
                  height={H - padB}
                  fill="transparent"
                  tabIndex={0}
                  aria-label={`${fmtHour(h.time)}: ${h.mm.toFixed(1)} millimetres`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                />
                {i % 3 === 0 && (
                  <text x={x + step / 2} y={H - 8} textAnchor="middle" fontSize="10" fill="rgba(220,233,236,0.65)">
                    {fmtHour(h.time)}
                  </text>
                )}
              </g>
            );
          })}
          <polyline points={probLine} fill="none" stroke="#fff" strokeOpacity="0.55" strokeWidth="1.5" strokeDasharray="4 4" />
        </svg>
      </div>
      <p className="mt-2 text-sm text-mist/60">
        Bars show millimetres of rain per hour. The dashed line shows the chance of rain.
      </p>
    </div>
  );
}

function Breakdown({ risk }) {
  return (
    <div>
      <h3 className="font-display text-2xl font-bold text-white">How the score is built</h3>
      <p className="mt-1 text-sm text-mist/65">Six weather factors add up to a maximum of 100.</p>
      <ul className="mt-5 space-y-4">
        {FACTORS.map(([key, label]) => {
          const val = risk.parts[key];
          const max = FACTOR_MAX[key];
          return (
            <li key={key}>
              <div className="flex justify-between gap-4 text-sm">
                <span className="text-mist/85">{label}</span>
                <span className="font-semibold text-white">
                  {val.toFixed(0)} of {max}
                </span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full transition-[width] duration-700"
                  style={{ width: `${(val / max) * 100}%`, backgroundColor: risk.level.color }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function Forecast({ data, risk }) {
  return (
    <section id="forecast" className="bg-ink py-24">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHead title="The next 24 hours, hour by hour">
          Waterlogging depends on how hard it rains, not just how much. A few intense hours matter more than a long drizzle.
        </SectionHead>

        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
          <HourlyChart hours={data.next} />
          <Breakdown risk={risk} />
        </div>

        <h3 className="mb-5 mt-20 font-display text-2xl font-bold text-white">Next 7 days</h3>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {data.daily.map((d) => (
            <li key={d.date} className="rounded-xl border border-white/10 bg-deep/70 p-4">
              <p className="text-sm font-semibold text-white">{fmtDay(d.date)}</p>
              <p className="mt-1 text-xs text-mist/65">{wxLabel(d.code)}</p>
              <p className="mt-3 font-display text-2xl font-bold text-rain">{d.rain.toFixed(0)} mm</p>
              <p className="text-xs text-mist/60">{d.prob}% chance</p>
              <p className="mt-2 text-xs text-mist/70">
                {Math.round(d.min)}° to {Math.round(d.max)}°C
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
