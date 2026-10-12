import { useMemo, useState } from "react";
import SectionHead from "./SectionHead";
import { HOTSPOTS } from "../lib/data";
import { levelFor } from "../lib/weather";

const ZONES = ["All", "North", "Central", "South", "East"];

export default function Hotspots({ risk }) {
  const [zone, setZone] = useState("All");

  const rows = useMemo(
    () =>
      HOTSPOTS.filter((h) => zone === "All" || h.zone === zone)
        .map((h) => {
          const score = Math.min(100, Math.round(risk.score * h.mult));
          return { ...h, score, level: levelFor(score) };
        })
        .sort((a, b) => b.score - a.score),
    [zone, risk.score]
  );

  return (
    <section id="hotspots" className="bg-mist py-24 text-ink">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHead light title="Neighbourhoods that flood first">
          Each area's score is today's city-wide score adjusted for how badly it drains. These are illustrative, based on areas often named in local news, and not official municipal data.
        </SectionHead>

        <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter by part of the city">
          {ZONES.map((z) => (
            <button
              key={z}
              onClick={() => setZone(z)}
              aria-pressed={zone === z}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                zone === z ? "border-ink bg-ink text-mist" : "border-ink/25 text-ink hover:border-ink"
              }`}
            >
              {z === "All" ? "All of Kolkata" : `${z} Kolkata`}
            </button>
          ))}
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((h) => (
            <li key={h.name} className="flex flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-ink/10">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-xl font-bold leading-tight">{h.name}</h3>
                <span
                  className="shrink-0 rounded-full px-3 py-1 text-xs font-bold text-ink"
                  style={{ backgroundColor: h.level.color }}
                >
                  {h.level.label}
                </span>
              </div>
              <p className="mt-1 text-sm text-ink/55">{h.zone} Kolkata</p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/80">{h.why}</p>
              <div className="mt-4">
                <div className="flex justify-between text-xs font-semibold text-ink/70">
                  <span>Risk today</span>
                  <span>{h.score} of 100</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-ink/10">
                  <div
                    className="h-full rounded-full transition-[width] duration-700"
                    style={{ width: `${h.score}%`, backgroundColor: h.level.color }}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
