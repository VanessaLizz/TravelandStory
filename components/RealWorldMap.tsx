"use client";

import { useEffect, useRef, useState } from "react";
import {
  Globe2,
  LoaderCircle,
} from "lucide-react";
import type {
  Map as MapLibreMap,
  Marker as MapLibreMarker,
} from "maplibre-gl";

export type RealMapMode =
  | "visited"
  | "wishlist"
  | "community";

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
  onSelect: (
    location: RealMapLocation,
  ) => void;
};

const initialCenter: [number, number] = [
  2,
  18,
];

const initialZoom = 1.35;

export function RealWorldMap({
  locations,
  mode,
  selectedId,
  onSelect,
}: RealWorldMapProps) {
  const containerRef =
    useRef<HTMLDivElement | null>(null);

  const mapRef =
    useRef<MapLibreMap | null>(null);

  const markersRef =
    useRef<MapLibreMarker[]>([]);

  const mapLibreRef =
    useRef<
      typeof import("maplibre-gl") | null
    >(null);

  const [mapReady, setMapReady] =
    useState(false);

  const [mapError, setMapError] =
    useState("");

  useEffect(() => {
    let cancelled = false;

    async function createMap() {
      if (
        !containerRef.current ||
        mapRef.current
      ) {
        return;
      }

      try {
        const maplibre =
          await import("maplibre-gl");

        if (
          cancelled ||
          !containerRef.current
        ) {
          return;
        }

        maplibre.setWorkerUrl(
          "/maplibre/maplibre-gl-worker.mjs",
        );

        mapLibreRef.current = maplibre;

        const map = new maplibre.Map({
          container: containerRef.current,
          style:
            "https://demotiles.maplibre.org/globe.json",
          center: initialCenter,
          zoom: initialZoom,
          minZoom: 0.8,
          maxZoom: 16,
          renderWorldCopies: false,
        });

        map.dragRotate.disable();

        map.touchZoomRotate.disableRotation();

        map.addControl(
          new maplibre.NavigationControl({
            showCompass: false,
          }),
          "bottom-right",
        );

        map.addControl(
          new maplibre.FullscreenControl(),
          "bottom-right",
        );

        map.on("load", () => {
          if (!cancelled) {
            setMapReady(true);
          }
        });

        mapRef.current = map;
      } catch {
        if (!cancelled) {
          setMapError(
            "Não foi possível carregar o mapa interativo neste navegador.",
          );
        }
      }
    }

    createMap();

    return () => {
      cancelled = true;

      markersRef.current.forEach(
        (marker) => marker.remove(),
      );

      markersRef.current = [];

      mapRef.current?.remove();
      mapRef.current = null;
      mapLibreRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const maplibre =
      mapLibreRef.current;

    if (
      !map ||
      !maplibre ||
      !mapReady
    ) {
      return;
    }

    markersRef.current.forEach(
      (marker) => marker.remove(),
    );

    markersRef.current = [];

    const visibleLocations =
      locations.filter((location) =>
        location.modes.includes(mode),
      );

    for (
      const location of visibleLocations
    ) {
      const markerElement =
        document.createElement("button");

      const markerDot =
        document.createElement("span");

      const markerCore =
        document.createElement("span");

      const markerLabel =
        document.createElement("span");

      const markerSize =
        16 +
        Math.min(
          14,
          Math.sqrt(
            Math.max(
              1,
              location.visits,
            ),
          ) * 2.4,
        );

      markerElement.type = "button";

      markerElement.className = [
        "real-map-marker",
        `real-map-marker--${mode}`,
        selectedId === location.id
          ? "is-selected"
          : "",
      ]
        .filter(Boolean)
        .join(" ");

      markerElement.setAttribute(
        "aria-label",
        `${location.city}, ${location.country}: ${location.visits} visitas`,
      );

      markerElement.style.setProperty(
        "--marker-color",
        location.color,
      );

      markerElement.style.setProperty(
        "--marker-size",
        `${markerSize}px`,
      );

      markerDot.className =
        "real-map-marker__dot";

      markerCore.className =
        "real-map-marker__core";

      markerLabel.className =
        "real-map-marker__label";

      markerLabel.textContent =
        location.city;

      markerDot.appendChild(markerCore);

      markerElement.append(
        markerDot,
        markerLabel,
      );

      markerElement.addEventListener(
        "mouseenter",
        () => {
          markerElement.classList.add(
            "is-hovered",
          );

          if (map.getZoom() < 3.2) {
            map.easeTo({
              around:
                location.coordinates,
              zoom: Math.min(
                3.2,
                map.getZoom() + 0.38,
              ),
              duration: 480,
            });
          }
        },
      );

      markerElement.addEventListener(
        "mouseleave",
        () => {
          markerElement.classList.remove(
            "is-hovered",
          );
        },
      );

      markerElement.addEventListener(
        "focus",
        () => onSelect(location),
      );

      markerElement.addEventListener(
        "click",
        () => {
          onSelect(location);

          map.flyTo({
            center:
              location.coordinates,
            zoom: Math.max(
              map.getZoom(),
              5,
            ),
            duration: 900,
            essential: true,
          });
        },
      );

      const marker =
        new maplibre.Marker({
          element: markerElement,
          anchor: "center",
        })
          .setLngLat(
            location.coordinates,
          )
          .addTo(map);

      markersRef.current.push(marker);
    }
  }, [
    locations,
    mapReady,
    mode,
    onSelect,
    selectedId,
  ]);

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
      <div
        className="real-map-canvas"
        ref={containerRef}
      />

      {!mapReady && !mapError && (
        <div className="real-map-loading">
          <LoaderCircle size={22} />

          <span>
            Carregando o seu mundo...
          </span>
        </div>
      )}

      {mapError && (
        <div className="real-map-error">
          {mapError}
        </div>
      )}

      <button
        className="real-map-reset"
        onClick={resetMap}
        type="button"
      >
        <Globe2 size={15} />
        Ver o mundo inteiro
      </button>
    </div>
  );
}