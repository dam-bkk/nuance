"use client";

import { useEffect, useState } from "react";

const DAYS_FR = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const MONTHS_FR = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

const WMO: Record<number, { fr: string; icon: "sun" | "cloud" | "rain" | "storm" | "fog" }> = {
  0:  { fr: "Ensoleillé",   icon: "sun" },
  1:  { fr: "Peu nuageux",  icon: "sun" },
  2:  { fr: "Nuageux",      icon: "cloud" },
  3:  { fr: "Couvert",      icon: "cloud" },
  45: { fr: "Brouillard",   icon: "fog" },
  48: { fr: "Brouillard",   icon: "fog" },
  51: { fr: "Bruine",       icon: "rain" },
  53: { fr: "Bruine",       icon: "rain" },
  55: { fr: "Bruine dense", icon: "rain" },
  61: { fr: "Pluie légère", icon: "rain" },
  63: { fr: "Pluie",        icon: "rain" },
  65: { fr: "Forte pluie",  icon: "rain" },
  71: { fr: "Neige légère", icon: "cloud" },
  73: { fr: "Neige",        icon: "cloud" },
  75: { fr: "Forte neige",  icon: "cloud" },
  80: { fr: "Averses",      icon: "rain" },
  81: { fr: "Averses",      icon: "rain" },
  82: { fr: "Fortes averses", icon: "rain" },
  95: { fr: "Orage",        icon: "storm" },
  96: { fr: "Orage",        icon: "storm" },
  99: { fr: "Orage",        icon: "storm" },
};

function getWmo(code: number) {
  return WMO[code] ?? WMO[Math.floor(code / 10) * 10] ?? { fr: "—", icon: "sun" as const };
}

function SunIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
    </svg>
  );
}
function CloudIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
    </svg>
  );
}
function RainIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/><path d="M13 19v3M9 21v1M17 21v1"/>
    </svg>
  );
}
function StormIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/><path d="M13 14l-2 4h4l-2 4"/>
    </svg>
  );
}
function FogIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10h18M3 14h18M3 18h18"/>
    </svg>
  );
}

const WEATHER_ICONS = { sun: SunIcon, cloud: CloudIcon, rain: RainIcon, storm: StormIcon, fog: FogIcon };

function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}

export default function WelcomeBar() {
  const [time, setTime] = useState("");
  const [dateStr, setDateStr] = useState("");
  const [city, setCity] = useState("");
  const [tz, setTz] = useState("Asia/Bangkok");
  const [weather, setWeather] = useState<{ temp: number; desc: string; icon: "sun"|"cloud"|"rain"|"storm"|"fog" } | null>(null);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    try { setDark(localStorage.getItem("nuance-theme") === "dark"); } catch {}
  }, []);

  // Clock — re-runs whenever tz resolves from geolocation
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const local = new Date(now.toLocaleString("en-US", { timeZone: tz }));
      setTime(local.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }));
      setDateStr(`${DAYS_FR[local.getDay()]} ${local.getDate()} ${MONTHS_FR[local.getMonth()]}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tz]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords;
        Promise.all([
          fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`)
            .then(r => r.json())
            .then(d => d.address?.city || d.address?.town || d.address?.village || d.address?.county || ""),
          fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`)
            .then(r => r.json()),
        ]).then(([cityName, wd]) => {
          setCity(cityName);
          if (wd.timezone) setTz(wd.timezone);
          const code = wd.current.weather_code as number;
          const temp = Math.round(wd.current.temperature_2m as number);
          setWeather({ temp, desc: getWmo(code).fr, icon: getWmo(code).icon });
        }).catch(() => {});
      },
      () => {
        // Fallback: Bangkok
        setCity("Bangkok");
        fetch("https://api.open-meteo.com/v1/forecast?latitude=13.7563&longitude=100.5018&current=temperature_2m,weather_code&timezone=Asia%2FBangkok")
          .then(r => r.json())
          .then(d => {
            const code = d.current.weather_code as number;
            const temp = Math.round(d.current.temperature_2m as number);
            setWeather({ temp, desc: getWmo(code).fr, icon: getWmo(code).icon });
          }).catch(() => {});
      },
      { timeout: 6000 }
    );
  }, []);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try { localStorage.setItem("nuance-theme", next ? "dark" : "light"); } catch {}
  }

  const WeatherIcon = weather ? WEATHER_ICONS[weather.icon] : null;

  return (
    <div className="flex items-center justify-between mb-5">
      {/* Left: date */}
      <span className="text-white/50 text-[11px] font-bold tracking-wide">
        {dateStr || "—"}
      </span>

      {/* Right: time · city · weather · toggle */}
      <div className="flex items-center gap-2 sm:gap-3">
        <span className="text-white/70 text-[11px] font-bold tabular-nums">
          {time || "--:--"}
        </span>
        <span className="hidden sm:inline text-white/30 text-[10px]">·</span>
        {city && <span className="hidden sm:inline text-white/50 text-[11px] font-bold">{city}</span>}

        {weather && (
          <>
            <span className="hidden sm:inline text-white/30 text-[10px]">·</span>
            <span className="hidden sm:flex items-center gap-1 text-white/60 text-[11px] font-bold">
              {WeatherIcon && <WeatherIcon />}
              {weather.temp}°C
            </span>
          </>
        )}

        <button
          onClick={toggleTheme}
          className="ml-1 w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-all"
          aria-label={dark ? "Mode clair" : "Mode sombre"}
        >
          {dark ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>
    </div>
  );
}
