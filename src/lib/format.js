export function fmtHour(t) {
  return new Date(t).toLocaleTimeString("en-IN", { hour: "numeric", hour12: true });
}

export function fmtDay(d) {
  return new Date(d + "T00:00").toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

// WMO weather codes used by Open-Meteo
export function wxLabel(code) {
  if (code === 0) return "Clear sky";
  if (code <= 2) return "Partly cloudy";
  if (code === 3) return "Overcast";
  if (code === 45 || code === 48) return "Fog";
  if (code >= 51 && code <= 57) return "Drizzle";
  if (code >= 61 && code <= 65) return code === 65 ? "Heavy rain" : "Rain";
  if (code >= 80 && code <= 82) return code === 82 ? "Violent showers" : "Rain showers";
  if (code >= 95) return "Thunderstorm";
  return "Cloudy";
}
