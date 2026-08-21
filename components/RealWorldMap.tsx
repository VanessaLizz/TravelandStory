"use client";

import { useEffect, useRef, useState } from "react";
import { Globe2, LoaderCircle } from "lucide-react";
import type {
  Map as MapLibreMap,
  Marker as MapLibreMarker,
} from "maplibre-gl";

export type RealMapMode = "visited" | "wishlist" | "community";

export type RealMapLocation = {
  id: string;
  city: string;
  country: string;
  coordinates: [number, number];
  visits: number;
  nights: number;
  places: number;
  returnRate: number;
  localScore: number;
  period: string;
  color: string;
  image: string;
  modes: RealMapMode[];
};

type RealWorldMapProps = {
  locations: RealMapLocation[];
  mode: RealMapMode;
  selectedId: string;
  onSelect: (location: RealMapLocation) => void;
  areaMode?: boolean;
};

const initialCenter: [number, number] = [2, 18];
const initialZoom = 1.35;

function circlePolygon(
  coordinates: [number, number],
  visits: number,
) {
  const [lng, lat] = coordinates;
  const radiusKm = 24 + Math.min(visits, 8) * 3;
  const points = 56;
  const latRadius = radiusKm / 111.32;
  const lngRadius = radiusKm /
    (111.32 * Math.max(0.2, Math.cos((lat * Math.PI) / 180)));

  const ring: [number, number][] = [];
  for (let index = 0; index <= points; index += 1) {
    const angle = (index / points) * Math.PI * 2;
    ring.push([
      lng + Math.cos(angle) * lngRadius,
      lat + Math.sin(angle) * latRadius,
    ]);
  }

  return ring;
}

export function RealWorldMap({
  locations,
  mode,
  selectedId,
  onSelect,
  areaMode = false,
}: RealWorldMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<MapLibreMarker[]>([]);
  const mapLibreRef = useRef<typeof import("maplibre-gl") | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function createMap() {
      if (!containerRef.current || mapRef.current) return;

      try {
        const maplibre = await import("maplibre-gl");
        if (cancelled || !containerRef.current) return;

        maplibre.setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");
        mapLibreRef.current = maplibre;

        const map = new maplibre.Map({
          container: containerRef.current,
          style: "https://demotiles.maplibre.org/globe.json",
          center: initialCenter,
          zoom: initialZoom,
          minZoom: 0.8,
          maxZoom: 16,
          renderWorldCopies: false,
        });

        map.dragRotate.disable();
        map.touchZoomRotate.disableRotation();
        map.addControl(new maplibre.NavigationControl({ showCompass: false }), "bottom-right");
        map.addControl(new maplibre.FullscreenControl(), "bottom-right");

        map.on("load", () => {
          if (!cancelled) setMapReady(true);
        });

        mapRef.current = map;
      } catch {
        if (!cancelled) {
          setMapError("Não foi possível carregar o mapa interativo neste navegador.");
        }
      }
    }

    createMap();

    return () => {
      cancelled = true;
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      mapRef.current?.remove();
      mapRef.current = null;
      mapLibreRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const maplibre = mapLibreRef.current;
    if (!map || !maplibre || !mapReady) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    const sourceId = "atlas-visited-city-areas";
    const fillLayerId = "atlas-visited-city-fill";
    const lineLayerId = "atlas-visited-city-line";

    if (map.getLayer(lineLayerId)) map.removeLayer(lineLayerId);
    if (map.getLayer(fillLayerId)) map.removeLayer(fillLayerId);
    if (map.getSource(sourceId)) map.removeSource(sourceId);

    const visibleLocations = locations.filter((location) =>
      location.modes.includes(mode),
    );

    if (areaMode && mode === "visited") {
      const geojson = {
        type: "FeatureCollection" as const,
        features: visibleLocations.map((location) => ({
          type: "Feature" as const,
          properties: {
            id: location.id,
            color: location.color,
            selected: location.id === selectedId ? 1 : 0,
          },
          geometry: {
            type: "Polygon" as const,
            coordinates: [circlePolygon(location.coordinates, location.visits)],
          },
        })),
      };

      map.addSource(sourceId, { type: "geojson", data: geojson });
      map.addLayer({
        id: fillLayerId,
        type: "fill",
        source: sourceId,
        paint: {
          "fill-color": ["get", "color"],
          "fill-opacity": ["case", ["==", ["get", "selected"], 1], 0.92, 0.76],
        },
      });
      map.addLayer({
        id: lineLayerId,
        type: "line",
        source: sourceId,
        paint: {
          "line-color": ["get", "color"],
          "line-width": ["case", ["==", ["get", "selected"], 1], 3, 1.5],
          "line-opacity": 0.95,
        },
      });

      map.on("click", fillLayerId, (event) => {
        const id = event.features?.[0]?.properties?.id;
        const location = visibleLocations.find((item) => item.id === id);
        if (!location) return;
        onSelect(location);
        map.flyTo({
          center: location.coordinates,
          zoom: Math.max(map.getZoom(), 6),
          duration: 850,
          essential: true,
        });
      });

      map.on("mouseenter", fillLayerId, () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", fillLayerId, () => {
        map.getCanvas().style.cursor = "";
      });

      return;
    }

    for (const location of visibleLocations) {
      const markerElement = document.createElement("button");
      const markerDot = document.createElement("span");
      const markerCore = document.createElement("span");
      const markerLabel = document.createElement("span");
      const markerSize = 16 + Math.min(14, Math.sqrt(Math.max(1, location.visits)) * 2.4);

      markerElement.type = "button";
      markerElement.className = [
        "real-map-marker",
        `real-map-marker--${mode}`,
        selectedId === location.id ? "is-selected" : "",
      ].filter(Boolean).join(" ");
      markerElement.setAttribute(
        "aria-label",
        `${location.city}, ${location.country}: ${location.visits} visitas`,
      );
      markerElement.style.setProperty("--marker-color", location.color);
      markerElement.style.setProperty("--marker-size", `${markerSize}px`);
      markerDot.className = "real-map-marker__dot";
      markerCore.className = "real-map-marker__core";
      markerLabel.className = "real-map-marker__label";
      markerLabel.textContent = location.city;
      markerDot.appendChild(markerCore);
      markerElement.append(markerDot, markerLabel);
      markerElement.addEventListener("focus", () => onSelect(location));
      markerElement.addEventListener("click", () => {
        onSelect(location);
        map.flyTo({
          center: location.coordinates,
          zoom: Math.max(map.getZoom(), 5),
          duration: 900,
          essential: true,
        });
      });

      const marker = new maplibre.Marker({
        element: markerElement,
        anchor: "center",
      }).setLngLat(location.coordinates).addTo(map);

      markersRef.current.push(marker);
    }
  }, [locations, mapReady, mode, onSelect, selectedId, areaMode]);

  function resetMap() {
    mapRef.current?.flyTo({
      center: initialCenter,
      zoom: initialZoom,
      duration: 900,
      essential: true,
    });
  }

  return (
    <div className="real-map-shell">
      <div className="real-map-canvas" ref={containerRef} />

      {!mapReady && !mapError && (
        <div className="real-map-loading">
          <LoaderCircle size={22} />
          <span>Carregando o seu mundo...</span>
        </div>
      )}

      {mapError && <div className="real-map-error">{mapError}</div>}

      <button className="real-map-reset" onClick={resetMap} type="button">
        <Globe2 size={15} />
        Ver o mundo inteiro
      </button>
    </div>
  );
}
