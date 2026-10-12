# Jol Jomechhe: Kolkata Waterlogging Watch

A React + Tailwind CSS web app that shows how likely waterlogging is in Kolkata right now.
It uses live weather data (rain, humidity, forecast), the current season and neighbourhood vulnerability.

## Run it

You need Node.js 18 or newer.

```bash
npm install
npm run dev        # opens at http://localhost:5173
npm run build      # production build in /dist
npm run preview    # test the production build
```

## Features

- Live weather from the Open-Meteo API (free, no API key needed), refreshed every 10 minutes
- Waterlogging risk score (0 to 100) with a flood-gauge visual and animated rain
- Scenario buttons (light rain, heavy rain, cloudburst) so you can demo it on a dry day
- 24-hour rainfall chart and 7-day forecast
- Neighbourhood hotspots with a zone filter
- Monthly rainfall chart and the four Kolkata seasons, with the current one highlighted
- Causes of waterlogging and safety tips
- Responsive, keyboard friendly, respects reduced-motion settings

## How the risk score works (for your viva)

Score = sum of six factors, capped at 100. See `assess()` in `src/lib/weather.js`.

| Factor | Max points | Input |
| --- | --- | --- |
| Rain intensity | 40 | Heaviest hourly rain in the next 6 hours |
| Rain volume | 25 | Total rain in the next 24 hours |
| Saturation | 15 | Rain in the last 24 hours |
| Chance of rain | 10 | Highest probability in the next 12 hours |
| Humidity | 5 | 85% or higher |
| Season | 5 | June to September |

Each hotspot multiplies the city score by a vulnerability factor in `src/lib/data.js`.

## Project structure

```
src/
  App.jsx               page layout and state
  hooks/useWeather.js   fetches and refreshes weather
  lib/weather.js        API call, scenarios, risk model
  lib/data.js           seasons, hotspots, causes, tips
  lib/format.js         date and weather-code helpers
  components/           Hero, Forecast, Hotspots, Seasons, Causes, ...
```

## Deploy for free

Push to GitHub, then import the repo in Vercel or Netlify. Build command `npm run build`, output folder `dist`.

## Ideas to extend it

- Add tide times for the Hooghly, since high tide is a major cause of flooding
- Let users search a locality and use its coordinates
- Store user reports of waterlogged streets in Firebase or Supabase and show them on a map (Leaflet)
- Add Bengali language support
