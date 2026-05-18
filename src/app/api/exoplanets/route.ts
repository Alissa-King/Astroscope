import { NextResponse } from "next/server";

const COLS = [
  "pl_name", "hostname", "pl_rade", "pl_bmasse",
  "pl_orbper", "pl_eqt", "sy_dist", "disc_year",
  "discoverymethod", "pl_orbsmax", "st_teff",
].join(",");

export async function GET() {
  try {
    const query = `SELECT TOP 600 ${COLS} FROM pscomppars WHERE pl_controv_flag = 0 ORDER BY disc_year DESC, pl_rade ASC`;
    const url = new URL("https://exoplanetarchive.ipac.caltech.edu/TAP/sync");
    url.searchParams.set("query", query);
    url.searchParams.set("format", "json");

    const res = await fetch(url.toString(), {
      next: { revalidate: 86400 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error(`API ${res.status}`);

    const raw = await res.json();
    // TAP may return array directly or wrapped object
    const data = Array.isArray(raw) ? raw : (raw.data ?? []);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
