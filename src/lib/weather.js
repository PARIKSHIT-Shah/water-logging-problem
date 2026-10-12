// Weather data + waterlogging risk model.
// Data source: Open-Meteo (free, no API key). https://open-meteo.com

export const KOLKATA = { lat: 22.5726, lon: 88.3639, name: "Kolkata" };
const API = "https://api.open-meteo.com/v1/forecast";

/* ---------- Fetching ---------- */

export async function fetchWeather(signal) {
  const params = new URLSearchParams({
    latitude: KOLKATA.lat,
    longitude: KOLKATA.lon,
    current:
      "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,surface_pressure",
    hourly: "precipitation,precipitation_probability",
    daily:
      "weather_code,precipitation_sum,precipitation_probability_max,temperature_2m_max,temperature_2m_min",
    timezone: "Asia/Kolkata",
    past_days: "1",
    forecast_days: "7",
  });
  const res = await fetch(`${API}?${params}`, { signal });
  if (!res.ok) throw new Error(`Weather service returned status ${res.status}`);
  return normalise(await res.json());
}

function normalise(j) {
  const nowKey = j.current.time.slice(0, 13) + ":00";
  let idx = j.hourly.time.indexOf(nowKey);
  if (idx < 0) idx = 24;

  const hourly = j.hourly.time.map((t, i) => ({
    time: t,
    mm: j.hourly.precipitation[i] ?? 0,
    prob: j.hourly.precipitation_probability[i] ?? 0,
  }));

  const past = hourly.slice(Math.max(0, idx - 24), idx);
  const next = hourly.slice(idx, idx + 24);

  const daily = j.daily.time
    .map((date, i) => ({
      date,
      code: j.daily.weather_code[i],
      rain: j.daily.precipitation_sum[i] ?? 0,
      prob: j.daily.precipitation_probability_max[i] ?? 0,
      max: j.daily.temperature_2m_max[i],
      min: j.daily.temperature_2m_min[i],
    }))
    .slice(1); // index 0 is yesterday (past_days=1)

  return {
    source: "live",
    current: {
      time: j.current.time,
      temp: j.current.temperature_2m,
      feels: j.current.apparent_temperature,
      humidity: j.current.relative_humidity_2m,
      rain: j.current.precipitation ?? 0,
      code: j.current.weather_code,
      wind: j.current.wind_speed_10m,
      pressure: j.current.surface_pressure,
    },
    past24Mm: past.reduce((s, h) => s + h.mm, 0),
    next,
    daily,
  };
}

/* ---------- Scenarios (so the app is demo-able on a dry day) ---------- */

const SCENARIOS = {
  light: { peak: 2.5, spread: 4, past: 6, prob: 70, humidity: 82, code: 61, daily: [12, 6, 3] },
  heavy: { peak: 14, spread: 3, past: 35, prob: 92, humidity: 92, code: 65, daily: [85, 40, 15] },
  extreme: { peak: 38, spread: 2.5, past: 80, prob: 98, humidity: 96, code: 95, daily: [190, 90, 40] },
};

export const SCENARIO_OPTIONS = [
  { key: "live", label: "Live data" },
  { key: "light", label: "Light rain" },
  { key: "heavy", label: "Heavy rain" },
  { key: "extreme", label: "Cloudburst" },
];

export function applyScenario(raw, key) {
  if (key === "live") return raw;
  const p = SCENARIOS[key];
  const next = raw.next.map((h, i) => ({
    ...h,
    mm: +(p.peak * Math.exp(-((i - 3) ** 2) / (2 * p.spread ** 2))).toFixed(1),
    prob: Math.max(20, Math.min(100, p.prob - Math.abs(i - 3) * 2)),
  }));
  return {
    ...raw,
    source: "simulated",
    past24Mm: p.past,
    next,
    current: { ...raw.current, rain: next[0].mm, humidity: p.humidity, code: p.code },
    daily: raw.daily.map((d, i) =>
      i < 3 ? { ...d, rain: p.daily[i], prob: 90 - i * 10, code: p.code } : d
    ),
  };
}

// Offline fallback if the API cannot be reached.
export function demoRaw() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const iso = (d) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:00`;
  const next = Array.from({ length: 24 }, (_, i) => {
    const d = new Date(now.getTime() + i * 3600 * 1000);
    return { time: iso(d), mm: i % 7 === 3 ? 0.6 : 0, prob: 25 };
  });
  const daily = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now.getTime() + i * 86400 * 1000);
    return {
      date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
      code: i % 2 ? 3 : 2,
      rain: i % 3 === 0 ? 4 : 0.5,
      prob: 30,
      max: 32,
      min: 25,
    };
  });
  return {
    source: "demo",
    current: { time: iso(now), temp: 30, feels: 35, humidity: 78, rain: 0, code: 2, wind: 11, pressure: 1008 },
    past24Mm: 1,
    next,
    daily,
  };
}

/* ---------- Risk model ---------- */

export const LEVELS = [
  { key: "low", min: 0, label: "Low", color: "#5FC29A", advice: "Streets should drain normally. A normal day to travel." },
  { key: "moderate", min: 20, label: "Moderate", color: "#F2B632", advice: "Expect puddles in low-lying lanes and near blocked drains." },
  { key: "high", min: 40, label: "High", color: "#F08A3C", advice: "Waterlogging is likely in known hotspots. Leave early and avoid underpasses." },
  { key: "severe", min: 65, label: "Severe", color: "#E2553F", advice: "Avoid non-essential travel. Roads, underpasses and tram lines are likely to flood." },
];

export function levelFor(score) {
  let out = LEVELS[0];
  for (const l of LEVELS) if (score >= l.min) out = l;
  return out;
}

export const FACTOR_MAX = {
  intensity: 40,
  volume: 25,
  saturation: 15,
  chance: 10,
  humidity: 5,
  season: 5,
};

/**
 * Score from 0 to 100. A transparent weighted sum so it is easy to explain in a viva:
 *  - intensity  (40): heaviest hourly rain in the next 6 hours (10 mm/h hits the cap)
 *  - volume     (25): total rain expected in the next 24 hours
 *  - saturation (15): rain that already fell in the last 24 hours (ground and drains are full)
 *  - chance     (10): highest rain probability in the next 12 hours
 *  - humidity    (5): very humid air means rain keeps coming
 *  - season      (5): monsoon months (June to September)
 */
export function assess(data) {
  const next6 = data.next.slice(0, 6);
  const peak = Math.max(0, data.current.rain || 0, ...next6.map((h) => h.mm));
  const total24 = data.next.reduce((s, h) => s + h.mm, 0);
  const prob12 = Math.max(0, ...data.next.slice(0, 12).map((h) => h.prob));
  const month = new Date().getMonth();
  const monsoon = month >= 5 && month <= 8;

  const parts = {
    intensity: Math.min(FACTOR_MAX.intensity, peak * 4),
    volume: Math.min(FACTOR_MAX.volume, total24 * 0.4),
    saturation: Math.min(FACTOR_MAX.saturation, data.past24Mm * 0.5),
    chance: Math.min(FACTOR_MAX.chance, prob12 * 0.1),
    humidity: data.current.humidity >= 85 ? FACTOR_MAX.humidity : 0,
    season: monsoon ? FACTOR_MAX.season : 0,
  };

  const score = Math.round(Object.values(parts).reduce((a, b) => a + b, 0));
  return { score, level: levelFor(score), parts, peak, total24, prob12, past24: data.past24Mm };
}
