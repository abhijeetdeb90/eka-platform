/**
 * EKA × Google Maps Platform Integration
 *
 * Provides sacred geography modeling, dynamic map script loading, and
 * geospatial lookup for temples, monasteries, shrines, and pilgrimage routes.
 *
 * Compatible with both:
 * - VITE_GOOGLE_MAPS_API_KEY
 * - VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY
 */

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface SacredPlace {
  id: string;
  name: string;
  vernacularName?: string;
  tradition: "Hindu" | "Buddhist" | "Sikh" | "Jain" | "Islamic" | "Christian" | "Ecumenical";
  location: string;
  state: string;
  country: string;
  coordinates: Coordinates;
  significance: string;
  bestTimeToVisit?: string;
  visitingGuidelines?: string;
  imageUrl?: string;
}

// Canonical seed array of foundational sacred geography nodes
export const FOUNDATIONAL_SACRED_PLACES: SacredPlace[] = [
  {
    id: "kashi-vishwanath",
    name: "Kashi Vishwanath Sanctum",
    vernacularName: "काशी विश्वनाथ",
    tradition: "Hindu",
    location: "Varanasi",
    state: "Uttar Pradesh",
    country: "India",
    coordinates: { lat: 25.3109, lng: 83.0107 },
    significance: "One of the twelve Jyotirlingas, situated along the sacred curvature of the Ganga.",
    bestTimeToVisit: "October to March; Dev Deepawali (Kartik Purnima)",
    visitingGuidelines: "Traditional attire recommended; phone/camera lockers available.",
  },
  {
    id: "harmandir-sahib",
    name: "Sri Harmandir Sahib (Golden Temple)",
    vernacularName: "ਸ੍ਰੀ ਹਰਿਮੰਦਰ ਸਾਹਿਬ",
    tradition: "Sikh",
    location: "Amritsar",
    state: "Punjab",
    country: "India",
    coordinates: { lat: 31.62, lng: 74.8765 },
    significance: "Spiritual headquarters of Sikhism; continuous kirtan and universal 24/7 Guru-ka-Langar.",
    bestTimeToVisit: "November to March; Gurpurab & Baisakhi",
    visitingGuidelines: "Head covering mandatory; barefoot inside parikrama.",
  },
  {
    id: "mahabodhi-temple",
    name: "Mahabodhi Mahavihara",
    vernacularName: "महाबोधि महाविहार",
    tradition: "Buddhist",
    location: "Bodh Gaya",
    state: "Bihar",
    country: "India",
    coordinates: { lat: 24.696, lng: 84.9914 },
    significance: "The sacred site where Siddhartha Gautama attained supreme awakening under the Bodhi tree.",
    bestTimeToVisit: "October to March; Buddha Jayanti (Vesak)",
    visitingGuidelines: "Silence maintained in meditation zones around the Vajrasana.",
  },
  {
    id: "palitana-shatrunjaya",
    name: "Shatrunjaya Sacred Hills",
    vernacularName: "શત્રુંજય તીર્થ",
    tradition: "Jain",
    location: "Palitana",
    state: "Gujarat",
    country: "India",
    coordinates: { lat: 21.5034, lng: 71.7997 },
    significance: "Primary Shvetambara pilgrimage site; over 800 white marble temples atop the sacred ridge.",
    bestTimeToVisit: "November to February; Kartik Purnima pilgrimage opening",
    visitingGuidelines: "Ascent begins at dawn; no food or leather items permitted on the hill.",
  },
  {
    id: "ajmer-dargah-sharif",
    name: "Dargah Hazrat Khwaja Moinuddin Chishti",
    vernacularName: "दरगाह हज़रत ख़्वाजा मुईनुद्दीन चिश्ती",
    tradition: "Islamic",
    location: "Ajmer",
    state: "Rajasthan",
    country: "India",
    coordinates: { lat: 26.456, lng: 74.6282 },
    significance: "Historic sanctuary of the Chishti Sufi order, embodying universal brotherhood and langar.",
    bestTimeToVisit: "Annual Urs festival; cooler winter months",
    visitingGuidelines: "Head covering recommended; fragrant chadar and floral offerings customary.",
  },
  {
    id: "velankanni-basilica",
    name: "Basilica of Our Lady of Good Health",
    vernacularName: "ஆரோக்கிய மாதா பேராலயம்",
    tradition: "Christian",
    location: "Velankanni",
    state: "Tamil Nadu",
    country: "India",
    coordinates: { lat: 10.6805, lng: 79.8496 },
    significance: "Renowned coastal pilgrimage sanctuary; synthesis of Marian devotion with South Indian customs.",
    bestTimeToVisit: "Annual feast (August 29 – September 8); winter season",
    visitingGuidelines: "Traditional reverence observed; tonsuring and offering of silver cradles.",
  },
];

let mapsScriptLoaded = false;
let mapsScriptPromise: Promise<boolean> | null = null;

/**
 * Returns the effective Google Maps API Key from available environment variables.
 */
export function getGoogleMapsApiKey(): string | null {
  if (typeof process !== "undefined" && process.env) {
    if (process.env["VITE_GOOGLE_MAPS_API_KEY"]) return process.env["VITE_GOOGLE_MAPS_API_KEY"];
    if (process.env["VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY"]) {
      return process.env["VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY"];
    }
    if (process.env["GOOGLE_MAPS_API_KEY"]) return process.env["GOOGLE_MAPS_API_KEY"];
  }

  if (typeof import.meta !== "undefined") {
    const metaEnv = (import.meta as unknown as { env?: Record<string, string> }).env;
    if (metaEnv?.["VITE_GOOGLE_MAPS_API_KEY"]) return metaEnv["VITE_GOOGLE_MAPS_API_KEY"];
    if (metaEnv?.["VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY"]) {
      return metaEnv["VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY"];
    }
  }

  return null;
}

/**
 * Dynamically loads the Google Maps JavaScript API script tag into the document head.
 */
export function loadGoogleMapsScript(customApiKey?: string): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (mapsScriptLoaded || (window as unknown as { google?: { maps?: unknown } }).google?.maps) {
    mapsScriptLoaded = true;
    return Promise.resolve(true);
  }

  if (mapsScriptPromise) return mapsScriptPromise;

  mapsScriptPromise = new Promise((resolve) => {
    const apiKey = customApiKey || getGoogleMapsApiKey();
    if (!apiKey) {
      console.warn("[EKA Maps] No Google Maps API key found in environment.");
      resolve(false);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      mapsScriptLoaded = true;
      resolve(true);
    };
    script.onerror = () => {
      console.error("[EKA Maps] Failed to load Google Maps script.");
      resolve(false);
    };

    document.head.appendChild(script);
  });

  return mapsScriptPromise;
}

/**
 * Filter sacred places by faith or lineage tradition.
 */
export function getSacredPlacesByTradition(tradition?: string): SacredPlace[] {
  if (!tradition || tradition === "all") return FOUNDATIONAL_SACRED_PLACES;
  return FOUNDATIONAL_SACRED_PLACES.filter(
    (place) => place.tradition.toLowerCase() === tradition.toLowerCase(),
  );
}

/**
 * Calculate Great-Circle distance between two coordinates in kilometers (Haversine formula).
 */
export function calculatePilgrimageDistance(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371; // Earth radius in km
  const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const dLon = ((coord2.lng - coord1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1.lat * Math.PI) / 180) *
      Math.cos((coord2.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}
