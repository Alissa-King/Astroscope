import { Suspense } from "react";
import { Sparkles } from "lucide-react";
import ExoplanetExplorer, { type Exoplanet } from "@/components/ExoplanetExplorer";

export const metadata = {
  title: "Exoplanet Explorer — AstroScope",
  description: "Browse thousands of confirmed exoplanets from NASA's Exoplanet Archive",
};

function LoadingSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-card rounded-xl p-4 h-20 bg-slate-800/40" />
        ))}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="glass-card rounded-2xl h-60 bg-slate-800/30" />
        ))}
      </div>
    </div>
  );
}

async function ExoplanetContent() {
  const { connection } = await import("next/server");
  await connection();

  let planets: Exoplanet[] = [];
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const res = await fetch(`${base}/api/exoplanets`, { next: { revalidate: 86400 } });
    if (res.ok) planets = await res.json();
  } catch {
    // fallback to empty
  }

  if (planets.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-16 text-center">
        <Sparkles size={40} className="text-teal-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Exoplanet data unavailable</h2>
        <p className="text-slate-500 text-sm">
          The NASA Exoplanet Archive is temporarily unreachable. Try again shortly.
        </p>
      </div>
    );
  }

  return <ExoplanetExplorer planets={planets} />;
}

export default function ExoplanetsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={18} className="text-teal-400" />
            <span className="text-teal-400 text-xs font-bold uppercase tracking-widest">
              NASA Exoplanet Archive
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Exoplanet Explorer</h1>
          <p className="text-slate-400 mt-2 text-sm leading-relaxed max-w-xl">
            Confirmed planets orbiting distant stars — filtered, sorted, and visualized.
            Earth-sized worlds, hot Jupiters, and everything in between.
          </p>
        </div>
        <div className="glass-card rounded-xl px-4 py-2 text-right shrink-0">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest">Data source</p>
          <p className="text-xs text-teal-300 font-semibold">NASA Exoplanet Archive</p>
          <p className="text-[10px] text-slate-600 font-mono">pscomppars · TAP v1</p>
        </div>
      </div>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-teal-500/30 to-transparent" />

      <Suspense fallback={<LoadingSkeleton />}>
        <ExoplanetContent />
      </Suspense>
    </div>
  );
}
