import { useEffect, useRef, useState } from "react";
import {
  MapPin,
  Navigation,
  Compass,
  Calendar,
  Shield,
  Layers,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import {
  loadGoogleMapsScript,
  getSacredPlacesByTradition,
  calculatePilgrimageDistance,
  type SacredPlace,
  type Coordinates,
} from "@/lib/maps/google-maps";
import { trackSacredPlaceVisited } from "@/lib/analytics/ga4";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    google?: any;
  }
  namespace google {
    namespace maps {
      type Map = any;
      type Marker = any;
      type InfoWindow = any;
      type MapTypeStyle = any;
      type Point = any;
      type LatLngBounds = any;
    }
  }
}

interface SacredGeographyMapProps {
  initialTradition?: string;
  className?: string;
}

const TRADITION_COLORS: Record<string, string> = {
  Hindu: "#D97706", // Saffron / Ochre
  Buddhist: "#B45309", // Deep Amber
  Sikh: "#1D4ED8", // Royal Nihang Blue
  Jain: "#4B5563", // Marble Stone
  Islamic: "#059669", // Emerald Green
  Christian: "#DC2626", // Crimson
};

export function SacredGeographyMap({
  initialTradition = "all",
  className = "",
}: SacredGeographyMapProps) {
  const [selectedTradition, setSelectedTradition] = useState<string>(initialTradition);
  const [selectedPlace, setSelectedPlace] = useState<SacredPlace | null>(null);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [mapsLoaded, setMapsLoaded] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"map" | "grid">("map");

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  const places = getSacredPlacesByTradition(selectedTradition);

  // Initialize selected place
  useEffect(() => {
    if (places.length > 0 && !selectedPlace) {
      setSelectedPlace(places[0] ?? null);
    }
  }, [places, selectedPlace]);

  // Request user geolocation for pilgrimage distance calculation
  useEffect(() => {
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => {
          // Default reference point: Varanasi Ghats
          setUserLocation({ lat: 25.3109, lng: 83.0107 });
        },
        { timeout: 5000 },
      );
    }
  }, []);

  // Load Google Maps JavaScript API
  useEffect(() => {
    let mounted = true;
    loadGoogleMapsScript().then((loaded) => {
      if (mounted) {
        setMapsLoaded(loaded);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Initialize and update Google Map instance when script loads and places change
  useEffect(() => {
    if (!mapsLoaded || !mapContainerRef.current || typeof window === "undefined" || !window.google) {
      return;
    }

    // Default center: Central India / Madhya Pradesh
    const defaultCenter = { lat: 22.9734, lng: 78.6569 };

    if (!mapInstanceRef.current) {
      // EKA Warm Editorial Map Styles (Ivory/Stone/Muted landscape)
      const ekaMapStyles: google.maps.MapTypeStyle[] = [
        { elementType: "geometry", stylers: [{ color: "#f8f5f0" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#f8f5f0" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#524d45" }] },
        {
          featureType: "administrative.locality",
          elementType: "labels.text.fill",
          stylers: [{ color: "#8a5839" }],
        },
        {
          featureType: "poi",
          elementType: "labels.text.fill",
          stylers: [{ color: "#786e64" }],
        },
        {
          featureType: "poi.park",
          elementType: "geometry",
          stylers: [{ color: "#e8ede4" }],
        },
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [{ color: "#eae4dc" }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry",
          stylers: [{ color: "#dfd5c8" }],
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#dbe5e8" }],
        },
        {
          featureType: "water",
          elementType: "labels.text.fill",
          stylers: [{ color: "#6e8894" }],
        },
      ];

      mapInstanceRef.current = new window.google.maps.Map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 5,
        styles: ekaMapStyles,
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
      });

      infoWindowRef.current = new window.google.maps.InfoWindow();
    }

    // Clear existing markers
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    // Add markers for currently filtered places
    const bounds = new window.google.maps.LatLngBounds();

    places.forEach((place) => {
      const markerColor = TRADITION_COLORS[place.tradition] || "#B45309";

      // SVG Pin for high DPI sharpness
      const pinSvg = {
        path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
        fillColor: markerColor,
        fillOpacity: 1,
        strokeWeight: 1.5,
        strokeColor: "#ffffff",
        scale: 1.6,
        anchor: new window.google.maps.Point(12, 22),
      };

      const marker = new window.google.maps.Marker({
        position: place.coordinates,
        map: mapInstanceRef.current,
        title: place.name,
        icon: pinSvg,
      });

      marker.addListener("click", () => {
        setSelectedPlace(place);
        trackSacredPlaceVisited(place.id, place.tradition);

        if (infoWindowRef.current && mapInstanceRef.current) {
          infoWindowRef.current.setContent(`
            <div style="padding: 6px; font-family: system-ui, sans-serif; max-width: 240px;">
              <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: ${markerColor};">${place.tradition} Tradition</span>
              <h3 style="font-size: 14px; font-weight: 600; margin: 4px 0 2px 0;">${place.name}</h3>
              <p style="font-size: 11px; color: #666; margin: 0 0 6px 0;">${place.location}, ${place.state}</p>
              <p style="font-size: 11px; line-height: 1.4; color: #333; margin: 0;">${place.significance.slice(0, 100)}...</p>
            </div>
          `);
          infoWindowRef.current.open(mapInstanceRef.current, marker);
        }
      });

      markersRef.current.push(marker);
      bounds.extend(place.coordinates);
    });

    if (places.length > 0 && mapInstanceRef.current) {
      mapInstanceRef.current.fitBounds(bounds, { top: 40, bottom: 40, left: 40, right: 40 });
    }
  }, [mapsLoaded, places]);

  const handleSelectPlace = (place: SacredPlace) => {
    setSelectedPlace(place);
    trackSacredPlaceVisited(place.id, place.tradition);

    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo(place.coordinates);
      mapInstanceRef.current.setZoom(10);
    }
  };

  const traditions = [
    { id: "all", label: "All Sacred Sites" },
    { id: "Hindu", label: "Hindu" },
    { id: "Buddhist", label: "Buddhist" },
    { id: "Sikh", label: "Sikh" },
    { id: "Jain", label: "Jain" },
    { id: "Islamic", label: "Sufi & Islamic" },
    { id: "Christian", label: "Christian" },
  ];

  return (
    <div
      className={`rounded-3xl border border-border/80 bg-card p-5 shadow-calm sm:p-7 ${className}`}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-terracotta/10 text-terracotta">
              <Compass className="size-4" aria-hidden />
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
              Sacred Geography
            </span>
            <Badge variant="outline" className="text-[11px] font-normal">
              Google Maps Platform
            </Badge>
          </div>
          <h2 className="mt-1 font-display text-xl sm:text-2xl">
            Pilgrim Paths, Shrines & Sacred Geographies
          </h2>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Explore sanctums, guidelines, and living lineages anchored in the physical earth.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 rounded-full border border-border bg-background/60 p-1">
          <Button
            size="sm"
            variant={viewMode === "map" ? "secondary" : "ghost"}
            onClick={() => setViewMode("map")}
            className="h-7 rounded-full px-3 text-xs"
          >
            <Compass className="mr-1.5 size-3.5" />
            Interactive Map
          </Button>
          <Button
            size="sm"
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            onClick={() => setViewMode("grid")}
            className="h-7 rounded-full px-3 text-xs"
          >
            <Layers className="mr-1.5 size-3.5" />
            Sanctum Cards
          </Button>
        </div>
      </div>

      {/* Tradition Filter Tabs */}
      <div className="mt-4 flex flex-wrap gap-2">
        {traditions.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setSelectedTradition(t.id)}
            className={`rounded-full px-3.5 py-1 text-xs transition-colors ${
              selectedTradition === t.id
                ? "bg-terracotta text-white shadow-sm"
                : "border border-border/70 bg-card text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Main Map or Grid Body */}
      {viewMode === "map" ? (
        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          {/* Map Canvas */}
          <div className="relative min-h-[380px] overflow-hidden rounded-2xl border border-border bg-[#f8f5f0] lg:col-span-2">
            <div ref={mapContainerRef} className="size-full min-h-[380px]" />

            {/* Offline or Loading Fallback Banner */}
            {!mapsLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-card/90 p-6 text-center backdrop-blur-xs">
                <Compass className="size-10 animate-spin text-terracotta opacity-80" />
                <p className="mt-3 font-display text-base">Initializing Sacred Geography Map…</p>
                <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                  Connecting to Google Maps Platform coordinates. If offline, place coordinates and
                  pilgrimage directions remain fully accessible below.
                </p>
              </div>
            )}
          </div>

          {/* Selected Place Detail Panel */}
          {selectedPlace && (
            <div className="flex flex-col justify-between rounded-2xl border border-border/70 bg-background/50 p-5">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <Badge
                      style={{
                        backgroundColor: `${TRADITION_COLORS[selectedPlace.tradition]}15`,
                        color: TRADITION_COLORS[selectedPlace.tradition],
                        borderColor: `${TRADITION_COLORS[selectedPlace.tradition]}40`,
                      }}
                      className="border text-[11px] font-medium"
                    >
                      {selectedPlace.tradition} Lineage
                    </Badge>
                    {userLocation && (
                      <span className="flex items-center text-[11px] text-muted-foreground">
                        <Navigation className="mr-1 size-3 text-terracotta" />
                        {calculatePilgrimageDistance(
                          userLocation,
                          selectedPlace.coordinates,
                        ).toLocaleString()}{" "}
                        km away
                      </span>
                    )}
                  </div>
                  <h3 className="mt-2 font-display text-xl">{selectedPlace.name}</h3>
                  {selectedPlace.vernacularName && (
                    <p className="text-xs font-serif text-terracotta">
                      {selectedPlace.vernacularName}
                    </p>
                  )}
                  <p className="mt-0.5 flex items-center text-xs text-muted-foreground">
                    <MapPin className="mr-1 size-3.5 text-terracotta" />
                    {selectedPlace.location}, {selectedPlace.state}, {selectedPlace.country}
                  </p>
                </div>

                <div className="rounded-xl border border-border/60 bg-card p-3.5 text-xs leading-relaxed text-foreground/90">
                  <p className="font-medium text-foreground">Civilizational Significance:</p>
                  <p className="mt-1 text-muted-foreground">{selectedPlace.significance}</p>
                </div>

                {selectedPlace.bestTimeToVisit && (
                  <div className="flex items-start gap-2.5 text-xs text-muted-foreground">
                    <Calendar className="mt-0.5 size-3.5 shrink-0 text-terracotta" />
                    <div>
                      <span className="font-medium text-foreground">Pilgrimage Timing: </span>
                      {selectedPlace.bestTimeToVisit}
                    </div>
                  </div>
                )}

                {selectedPlace.visitingGuidelines && (
                  <div className="flex items-start gap-2.5 text-xs text-muted-foreground">
                    <Shield className="mt-0.5 size-3.5 shrink-0 text-terracotta" />
                    <div>
                      <span className="font-medium text-foreground">Sanctum Conduct: </span>
                      {selectedPlace.visitingGuidelines}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-border/60 flex items-center gap-2">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPlace.coordinates.lat},${selectedPlace.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-3.5 py-2 text-xs font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
                >
                  <Navigation className="size-3.5" />
                  Pilgrimage Directions
                  <ExternalLink className="size-3 opacity-70" />
                </a>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Sanctum Cards Grid */
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {places.map((place) => (
            <div
              key={place.id}
              onClick={() => handleSelectPlace(place)}
              className={`cursor-pointer rounded-2xl border p-4 transition-all duration-300 ${
                selectedPlace?.id === place.id
                  ? "border-terracotta bg-terracotta/5 shadow-md"
                  : "border-border/70 bg-card hover:border-terracotta/50 hover:shadow-calm"
              }`}
            >
              <div className="flex items-center justify-between">
                <Badge
                  variant="outline"
                  style={{ color: TRADITION_COLORS[place.tradition] }}
                  className="text-[10px]"
                >
                  {place.tradition}
                </Badge>
                {userLocation && (
                  <span className="text-[10px] text-muted-foreground">
                    {calculatePilgrimageDistance(
                      userLocation,
                      place.coordinates,
                    ).toLocaleString()}{" "}
                    km
                  </span>
                )}
              </div>
              <h3 className="mt-2 font-display text-base font-medium">{place.name}</h3>
              {place.vernacularName && (
                <p className="text-[11px] font-serif text-terracotta">{place.vernacularName}</p>
              )}
              <p className="mt-1 flex items-center text-xs text-muted-foreground">
                <MapPin className="mr-1 size-3 text-terracotta" />
                {place.location}, {place.state}
              </p>
              <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                {place.significance}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
