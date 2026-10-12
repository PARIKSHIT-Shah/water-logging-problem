import { useCallback, useEffect, useState } from "react";
import { demoRaw, fetchWeather } from "../lib/weather";

export function useWeather() {
  const [raw, setRaw] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);

  const load = useCallback(async (signal) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeather(signal);
      setRaw(data);
      setUpdatedAt(new Date());
    } catch (e) {
      if (e.name !== "AbortError") setError(e.message || "Could not reach the weather service.");
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    const id = setInterval(() => load(), 10 * 60 * 1000); // refresh every 10 minutes
    return () => {
      controller.abort();
      clearInterval(id);
    };
  }, [load]);

  const loadDemo = () => {
    setRaw(demoRaw());
    setError(null);
    setUpdatedAt(new Date());
  };

  return { raw, loading, error, updatedAt, refresh: () => load(), loadDemo };
}
