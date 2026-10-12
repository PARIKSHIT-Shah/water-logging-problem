import { useMemo, useState } from "react";
import { useWeather } from "./hooks/useWeather";
import { applyScenario, assess } from "./lib/weather";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Forecast from "./components/Forecast";
import Hotspots from "./components/Hotspots";
import Seasons from "./components/Seasons";
import Causes from "./components/Causes";
import Footer from "./components/Footer";

function Splash({ error, onRetry, onDemo }) {
  return (
    <div className="grid min-h-[70vh] place-items-center px-5 text-center">
      {error ? (
        <div className="max-w-md">
          <h1 className="font-display text-3xl font-extrabold text-white">Could not load the weather</h1>
          <p className="mt-3 text-mist/75">
            {error}. Check your internet connection and try again, or continue with demo data.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button onClick={onRetry} className="rounded-full bg-taxi px-5 py-2 font-semibold text-ink">
              Try again
            </button>
            <button onClick={onDemo} className="rounded-full border border-white/30 px-5 py-2 font-semibold text-mist hover:border-taxi">
              Use demo data
            </button>
          </div>
        </div>
      ) : (
        <p className="font-display text-2xl text-mist/80" role="status">
          Checking the sky over Kolkata...
        </p>
      )}
    </div>
  );
}

export default function App() {
  const { raw, loading, error, updatedAt, refresh, loadDemo } = useWeather();
  const [scenario, setScenario] = useState("live");

  const data = useMemo(() => (raw ? applyScenario(raw, scenario) : null), [raw, scenario]);
  const risk = useMemo(() => (data ? assess(data) : null), [data]);

  return (
    <>
      <Navbar />
      <main>
        {!data ? (
          <Splash error={error} onRetry={refresh} onDemo={loadDemo} />
        ) : (
          <>
            <Hero
              data={data}
              risk={risk}
              scenario={scenario}
              setScenario={setScenario}
              updatedAt={updatedAt}
              onRefresh={refresh}
              loading={loading}
            />
            <Forecast data={data} risk={risk} />
            <Hotspots risk={risk} />
            <Seasons />
            <Causes />
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
