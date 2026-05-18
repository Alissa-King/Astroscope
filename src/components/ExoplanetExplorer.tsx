"use client";

import { useState, useMemo, useCallback } from "react";
import { Search, Thermometer, Globe, Zap, Calendar, SlidersHorizontal } from "lucide-react";

export interface Exoplanet {
  pl_name: string;
  hostname: string;
  pl_rade: number | null;
  pl_bmasse: number | null;
  pl_orbper: number | null;
  pl_eqt: number | null;
  sy_dist: number | null;
  disc_year: number | null;
  discoverymethod: string | null;
  pl_orbsmax: number | null;
  st_teff: number | null;
}

type SizeCategory = "all" | "earth" | "super-earth" | "neptune" | "giant";
type SortKey = "year" | "size" | "distance" | "temp";

function getSizeCategory(rade: number | null): string {
  if (!rade) return "unknown";
  if (rade < 0.8) return "sub-earth";
  if (rade <= 1.5) return "earth";
  if (rade <= 2.5) return "super-earth";
  if (rade <= 4) return "mini-neptune";
  if (rade <= 10) return "neptune";
  return "giant";
}

function getSizeColor(cat: string) {
  switch (cat) {
    case "earth": return { bg: "bg-emerald-500/20", border: "border-emerald-500/40", text: "text-emerald-300", dot: "bg-emerald-400", label: "Earth-sized" };
    case "super-earth": return { bg: "bg-teal-500/20", border: "border-teal-500/40", text: "text-teal-300", dot: "bg-teal-400", label: "Super-Earth" };
    case "mini-neptune": return { bg: "bg-sky-500/20", border: "border-sky-500/40", text: "text-sky-300", dot: "bg-sky-400", label: "Mini-Neptune" };
    case "neptune": return { bg: "bg-blue-500/20", border: "border-blue-500/40", text: "text-blue-300", dot: "bg-blue-400", label: "Neptune-like" };
    case "giant": return { bg: "bg-violet-500/20", border: "border-violet-500/40", text: "text-violet-300", dot: "bg-violet-400", label: "Gas Giant" };
    case "sub-earth": return { bg: "bg-slate-500/20", border: "border-slate-500/40", text: "text-slate-300", dot: "bg-slate-400", label: "Sub-Earth" };
    default: return { bg: "bg-slate-800/40", border: "border-slate-700/40", text: "text-slate-400", dot: "bg-slate-600", label: "Unknown" };
  }
}

function getTempColor(eqt: number | null) {
  if (!eqt) return "text-slate-500";
  if (eqt < 150) return "text-blue-300";
  if (eqt < 200) return "text-sky-300";
  if (eqt <= 320) return "text-emerald-300";
  if (eqt <= 500) return "text-amber-300";
  return "text-red-400";
}

function isHabitable(p: Exoplanet) {
  const okSize = p.pl_rade !== null && p.pl_rade >= 0.5 && p.pl_rade <= 1.8;
  const okTemp = p.pl_eqt !== null && p.pl_eqt >= 180 && p.pl_eqt <= 320;
  return okSize && okTemp;
}

function fmt(n: number | null, decimals = 2, unit = "") {
  if (n === null || n === undefined) return "—";
  return `${n.toFixed(decimals)}${unit}`;
}

function parsecToLy(pc: number | null) {
  if (!pc) return null;
  return pc * 3.2615637769;
}

function PlanetSizeViz({ rade }: { rade: number | null }) {
  const earthPx = 10;
  const planetPx = rade ? Math.min(Math.max(rade * earthPx, 4), 56) : earthPx;
  const cat = getSizeCategory(rade);
  const c = getSizeColor(cat);

  return (
    <div className="flex items-end gap-2 justify-center py-2">
      <div className="flex flex-col items-center gap-1">
        <div
          className="rounded-full bg-gradient-to-br from-blue-400 to-blue-600 opacity-80"
          style={{ width: earthPx * 2, height: earthPx * 2 }}
        />
        <span className="text-[9px] text-slate-500">Earth</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <div
          className={`rounded-full ${c.dot} opacity-80`}
          style={{
            width: planetPx * 2,
            height: planetPx * 2,
            background: cat === "giant"
              ? "radial-gradient(circle at 35% 35%, #a78bfa, #4c1d95)"
              : cat === "neptune" || cat === "mini-neptune"
              ? "radial-gradient(circle at 35% 35%, #7dd3fc, #1e3a5f)"
              : cat === "earth"
              ? "radial-gradient(circle at 35% 35%, #6ee7b7, #064e3b)"
              : cat === "super-earth"
              ? "radial-gradient(circle at 35% 35%, #5eead4, #134e4a)"
              : "radial-gradient(circle at 35% 35%, #94a3b8, #1e293b)",
          }}
        />
        <span className="text-[9px] text-slate-500">{rade ? `${rade.toFixed(1)} R⊕` : "?"}</span>
      </div>
    </div>
  );
}

function ExoplanetCard({ planet }: { planet: Exoplanet }) {
  const cat = getSizeCategory(planet.pl_rade);
  const c = getSizeColor(cat);
  const habitable = isHabitable(planet);
  const ly = parsecToLy(planet.sy_dist);
  const tempColor = getTempColor(planet.pl_eqt);

  return (
    <div
      className={`glass-card rounded-2xl overflow-hidden border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group ${
        habitable ? "border-emerald-500/30 hover:border-emerald-400/50 hover:shadow-emerald-500/10" : "border-slate-700/40 hover:border-slate-600/60"
      }`}
    >
      {habitable && (
        <div className="h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />
      )}

      <div className="p-5 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-bold text-white text-sm leading-tight truncate group-hover:text-sky-100 transition-colors">
              {planet.pl_name}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 truncate">
              ★ {planet.hostname}
            </p>
          </div>
          {habitable && (
            <span className="shrink-0 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              Habitable?
            </span>
          )}
        </div>

        {/* Size visualization */}
        <PlanetSizeViz rade={planet.pl_rade} />

        {/* Size badge */}
        <div className="flex justify-center">
          <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${c.bg} ${c.border} ${c.text}`}>
            {c.label}
          </span>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px] border-t border-slate-800/60 pt-3">
          <div className="flex items-center gap-1.5">
            <Globe size={10} className="text-slate-500 shrink-0" />
            <span className="text-slate-500">Radius</span>
            <span className="ml-auto text-slate-300 font-mono">
              {fmt(planet.pl_rade, 2)} R⊕
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap size={10} className="text-slate-500 shrink-0" />
            <span className="text-slate-500">Period</span>
            <span className="ml-auto text-slate-300 font-mono">
              {planet.pl_orbper ? (planet.pl_orbper >= 1 ? `${planet.pl_orbper.toFixed(1)}d` : `${(planet.pl_orbper * 24).toFixed(1)}h`) : "—"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Thermometer size={10} className={`${tempColor} shrink-0`} />
            <span className="text-slate-500">Temp</span>
            <span className={`ml-auto font-mono ${tempColor}`}>
              {planet.pl_eqt ? `${Math.round(planet.pl_eqt)} K` : "—"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 text-[9px] shrink-0">ly</span>
            <span className="text-slate-500">Dist</span>
            <span className="ml-auto text-slate-300 font-mono">
              {ly ? (ly < 1000 ? `${ly.toFixed(0)} ly` : `${(ly / 1000).toFixed(1)}k ly`) : "—"}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-[10px] text-slate-600 font-mono">
            {planet.disc_year ?? "?"}
          </span>
          {planet.discoverymethod && (
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-800/80 border border-slate-700/50 text-slate-400">
              {planet.discoverymethod}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

const SIZE_FILTERS: { key: SizeCategory; label: string }[] = [
  { key: "all", label: "All Sizes" },
  { key: "earth", label: "Earth-sized" },
  { key: "super-earth", label: "Super-Earth" },
  { key: "neptune", label: "Neptune-like" },
  { key: "giant", label: "Gas Giant" },
];

const METHODS = ["All Methods", "Transit", "Radial Velocity", "Direct Imaging", "Microlensing", "Astrometry"];

export default function ExoplanetExplorer({ planets }: { planets: Exoplanet[] }) {
  const [search, setSearch] = useState("");
  const [sizeFilter, setSizeFilter] = useState<SizeCategory>("all");
  const [methodFilter, setMethodFilter] = useState("All Methods");
  const [habitableOnly, setHabitableOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortKey>("year");

  const filtered = useMemo(() => {
    let list = planets;

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.pl_name.toLowerCase().includes(q) ||
          (p.hostname?.toLowerCase().includes(q) ?? false)
      );
    }

    if (sizeFilter !== "all") {
      list = list.filter((p) => {
        const cat = getSizeCategory(p.pl_rade);
        if (sizeFilter === "earth") return cat === "earth" || cat === "sub-earth";
        if (sizeFilter === "super-earth") return cat === "super-earth" || cat === "mini-neptune";
        if (sizeFilter === "neptune") return cat === "neptune";
        if (sizeFilter === "giant") return cat === "giant";
        return true;
      });
    }

    if (methodFilter !== "All Methods") {
      list = list.filter((p) => p.discoverymethod === methodFilter);
    }

    if (habitableOnly) {
      list = list.filter(isHabitable);
    }

    list = [...list].sort((a, b) => {
      switch (sortBy) {
        case "year": return (b.disc_year ?? 0) - (a.disc_year ?? 0);
        case "size": return (a.pl_rade ?? 999) - (b.pl_rade ?? 999);
        case "distance": return (a.sy_dist ?? 999999) - (b.sy_dist ?? 999999);
        case "temp": return (a.pl_eqt ?? 0) - (b.pl_eqt ?? 0);
        default: return 0;
      }
    });

    return list;
  }, [planets, search, sizeFilter, methodFilter, habitableOnly, sortBy]);

  const stats = useMemo(() => {
    const habitable = planets.filter(isHabitable).length;
    const methods = new Map<string, number>();
    planets.forEach((p) => {
      if (p.discoverymethod) methods.set(p.discoverymethod, (methods.get(p.discoverymethod) ?? 0) + 1);
    });
    const topMethod = [...methods.entries()].sort((a, b) => b[1] - a[1])[0];
    const nearest = planets.filter((p) => p.sy_dist).sort((a, b) => (a.sy_dist ?? 999) - (b.sy_dist ?? 999))[0];
    return { habitable, topMethod, nearest };
  }, [planets]);

  const earthAnalogs = useMemo(
    () => planets.filter(isHabitable).slice(0, 4),
    [planets]
  );

  const handleToggleHabitable = useCallback(() => setHabitableOnly((v) => !v), []);

  return (
    <div className="space-y-8">
      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Confirmed Planets", value: planets.length.toLocaleString(), color: "text-teal-400" },
          { label: "Earth Analogs", value: stats.habitable, color: "text-emerald-400" },
          {
            label: "Top Discovery Method",
            value: stats.topMethod?.[0] ?? "—",
            color: "text-sky-400",
          },
          {
            label: "Nearest (in dataset)",
            value: stats.nearest
              ? `${(parsecToLy(stats.nearest.sy_dist)!).toFixed(1)} ly`
              : "—",
            color: "text-violet-400",
          },
        ].map(({ label, value, color }) => (
          <div key={label} className="glass-card rounded-xl p-4 text-center">
            <p className={`text-xl font-bold font-mono ${color}`}>{value}</p>
            <p className="text-[11px] text-slate-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Earth Analogs spotlight */}
      {earthAnalogs.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-widest">Potentially Habitable</h2>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <div className="flex-1 h-px bg-gradient-to-r from-emerald-500/30 to-transparent" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {earthAnalogs.map((p) => (
              <ExoplanetCard key={p.pl_name} planet={p} />
            ))}
          </div>
        </section>
      )}

      {/* Filters */}
      <div className="glass-card rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <SlidersHorizontal size={14} className="text-teal-400" />
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-widest">Filter & Sort</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search planet or star name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-900/60 border border-slate-700/50 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 transition"
            />
          </div>

          {/* Method filter */}
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-700/50 text-sm text-slate-300 focus:outline-none focus:border-teal-500/50 transition"
          >
            {METHODS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-700/50 text-sm text-slate-300 focus:outline-none focus:border-teal-500/50 transition"
          >
            <option value="year">Sort: Newest</option>
            <option value="size">Sort: Smallest</option>
            <option value="distance">Sort: Nearest</option>
            <option value="temp">Sort: Coolest</option>
          </select>
        </div>

        {/* Size filters */}
        <div className="flex flex-wrap gap-2">
          {SIZE_FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setSizeFilter(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                sizeFilter === key
                  ? "bg-teal-500/20 border border-teal-500/40 text-teal-300"
                  : "bg-slate-800/60 border border-slate-700/40 text-slate-400 hover:border-slate-600 hover:text-slate-200"
              }`}
            >
              {label}
            </button>
          ))}

          <button
            onClick={handleToggleHabitable}
            className={`ml-auto px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              habitableOnly
                ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"
                : "bg-slate-800/60 border border-slate-700/40 text-slate-400 hover:border-slate-600"
            }`}
          >
            {habitableOnly ? "✓ " : ""}Habitable Only
          </button>
        </div>

        <p className="text-[11px] text-slate-600">
          Showing <span className="text-teal-400 font-mono">{filtered.length}</span> of{" "}
          <span className="font-mono">{planets.length}</span> planets
        </p>
      </div>

      {/* Planet grid */}
      {filtered.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center">
          <p className="text-4xl mb-4">🔭</p>
          <p className="text-slate-400 font-semibold">No planets match your filters</p>
          <p className="text-slate-600 text-sm mt-1">Try broadening your search</p>
        </div>
      ) : (
        <section>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-widest">All Exoplanets</h2>
            <div className="flex-1 h-px bg-slate-800/60" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((p) => (
              <ExoplanetCard key={p.pl_name} planet={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
