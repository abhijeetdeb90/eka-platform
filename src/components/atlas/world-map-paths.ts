// ==============================================================================
// EKA LIVING CULTURAL ATLAS — GEOGRAPHIC VIEWBOX PRESETS & PROJECTION
// ==============================================================================
// Calibrated to Natural Earth 110m equirectangular projection (1000 x 500 plane).
// Longitude: -180 to 180 -> x: 0 to 1000
// Latitude: 85 to -80 -> y: 0 to 500
// ==============================================================================

export interface MapRegionPreset {
  id: string;
  name: string;
  label: string;
  viewBox: string;
  zoomLevel: number;
  subregions?: Array<{ id: string; name: string; viewBox: string }>;
}

export const ATLAS_VIEWBOX_PRESETS: Record<string, MapRegionPreset> = {
  world: {
    id: "world",
    name: "The Living World",
    label: "Global View",
    viewBox: "0 0 1000 500",
    zoomLevel: 1,
  },
  india: {
    id: "india",
    name: "Indian Subcontinent & Sacred Geography",
    label: "India",
    viewBox: "660 130 145 125",
    zoomLevel: 3.8,
    subregions: [
      { id: "in-west", name: "Rajasthan & Gujarat Desert Corridors", viewBox: "675 160 70 55" },
      { id: "in-north", name: "Gangetic Plain & Kashi Corridor", viewBox: "700 155 70 55" },
      { id: "in-south", name: "Deccan & Coastal Malabar-Coromandel", viewBox: "695 195 65 60" },
      { id: "in-east", name: "Bengal Delta & Sacred Brahmaputra", viewBox: "720 160 70 55" },
    ],
  },
  asia: {
    id: "asia",
    name: "Asia & Silk Routes",
    label: "Asia",
    viewBox: "580 80 380 280",
    zoomLevel: 2.2,
  },
  middle_east: {
    id: "middle_east",
    name: "Middle East & Maghreb",
    label: "Middle East",
    viewBox: "460 110 200 170",
    zoomLevel: 2.6,
  },
  africa: {
    id: "africa",
    name: "African Continent & Swahili Coast",
    label: "Africa",
    viewBox: "420 140 220 220",
    zoomLevel: 2.2,
  },
  europe: {
    id: "europe",
    name: "Europe & Mediterranean Basin",
    label: "Europe",
    viewBox: "460 60 190 140",
    zoomLevel: 2.8,
  },
  americas: {
    id: "americas",
    name: "The Americas & Indigenous Horizons",
    label: "Americas",
    viewBox: "140 50 320 340",
    zoomLevel: 1.8,
  },
};

/**
 * Project [lng, lat] to SVG coordinates [x, y] in 1000 x 500 canvas.
 */
export function projectLngLat(lng: number, lat: number): [number, number] {
  const clampedLat = Math.max(-80, Math.min(84, lat));
  const x = ((lng + 180) / 360) * 1000;
  const y = ((85 - clampedLat) / 165) * 500;
  return [Number(x.toFixed(1)), Number(y.toFixed(1))];
}
