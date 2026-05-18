# ✦ AstroScope v2

> **Mission control for the cosmos.** Real-time NASA data, live ISS tracking, interactive star maps, and a cinematic dark-mode UI — all in one space intelligence dashboard.

🌐 **[astroscope2.vercel.app](https://astroscope2.vercel.app)**

---

## Features

### 🛰️ Live ISS Tracker
Real-time International Space Station positioning updated every 5 seconds. Includes an equirectangular globe visualization, orbital trail, altitude/velocity telemetry, and current crew roster.

### 🔭 APOD Gallery
NASA's Astronomy Picture of the Day with full explanations, HD image support, and a browsable archive.

### ☄️ Asteroid Tracker
7-day near-Earth object feed from NASA NeoWs. Flags potentially hazardous asteroids, and visualizes velocity, size, and miss distance with interactive charts.

### 🌙 Tonight's Sky
Real-time sky conditions including moon phase & illumination, planetary visibility, best viewing window estimates, and observing quality forecast.

### 🗺️ Interactive Star Map
Azimuthal-projection sky dome with 50+ catalogued stars, constellation lines, and real-time sidereal positioning. Updates every 30 seconds based on Local Sidereal Time.

### 🪐 Solar System Orrery
Animated, interactive model of all 8 planets with real orbital mechanics (J2000 epoch, mean longitude), Saturn's rings, gas giant glows, and a log-scale speed slider (1 day/s → 10 yr/s). Includes a **Reset to Today** button.

### 🌀 Asteroid Orbit Viewer
Keplerian ellipse visualization for 5 notable near-Earth asteroids (Apophis, Bennu, Eros, Ryugu, 2024 YR4). Shows perihelion/aphelion, close approach indicators, and a variable-speed animation.

### 🚀 Launch Tracker
Upcoming SpaceX launch countdowns plus a calendar of major astronomical events.

### ✨ Exoplanet Explorer
Browse 500+ confirmed exoplanets from NASA's Exoplanet Archive. Filter by size category, discovery method, and habitability. Highlights Earth-analog candidates with equilibrium temperature and size-comparison visualizations.

### 📡 Star Chart Generator
Custom printable sky charts for any location, date, and time.

### 🌕 Artemis II Gallery
Official NASA photography from the 2026 Artemis II lunar flyby mission.

---

## Easter Eggs

- **Click anywhere** — star particles burst from your cursor
- **Click the ✦ logo 5× rapidly** — triggers a supernova shockwave with the message *"Welcome to the cosmos"*

---

## Data Sources

| Source | Data |
|--------|------|
| [NASA APOD API](https://api.nasa.gov) | Astronomy Picture of the Day |
| [NASA NeoWs](https://api.nasa.gov) | Near-Earth asteroid feed |
| [NASA Exoplanet Archive](https://exoplanetarchive.ipac.caltech.edu) | Confirmed exoplanet catalog |
| [NASA Images API](https://images.nasa.gov) | Artemis mission photography |
| [Where the ISS at?](https://wheretheiss.at) | Live ISS position |
| [SpaceX API](https://github.com/r-spacex/SpaceX-API) | Upcoming launch data |

---

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org) (App Router, Partial Prerendering)
- **Language:** TypeScript 5
- **UI:** React 19, Tailwind CSS 4, Lucide React
- **Visualizations:** Canvas API (star map, orrery, ISS globe), Recharts
- **Deployment:** Vercel

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

The app works without any API keys (NASA's `DEMO_KEY` is used by default). For higher rate limits, add your own key:

```bash
# .env.local
NASA_API_KEY=your_key_here
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

Get a free NASA API key at [api.nasa.gov](https://api.nasa.gov).

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Home dashboard
│   ├── layout.tsx            # Root layout (nav, starfield, nebula layers)
│   ├── /apod                 # APOD gallery & archive
│   ├── /asteroids            # Asteroid tracker
│   ├── /exoplanets           # Exoplanet explorer
│   ├── /iss                  # ISS live tracker
│   ├── /launches             # Launch countdown
│   ├── /sky                  # Tonight's sky & star map
│   ├── /solar-system         # Orrery & asteroid orbit viewer
│   ├── /star-chart           # Star chart generator
│   ├── /artemis              # Artemis II gallery
│   └── /api                  # API proxy routes
├── components/               # Reusable React components
└── lib/
    └── nasa.ts               # NASA API client & data types
```

---

<div align="center">
  <sub>Built with Next.js · Data from NASA Open APIs · Deployed on Vercel</sub>
</div>
