"use client";

import { useMemo, useState } from "react";
import { Minus, Plus, RotateCcw, Sparkles } from "lucide-react";
import type { CSSProperties, MouseEvent } from "react";
import type { MapLayer, MapLocation, MapMetric } from "@/types/travel";

type ScratchWorldMapProps = {
  locations: MapLocation[];
  layer: MapLayer;
  metric: MapMetric;
  selectedId: string;
  onSelect: (location: MapLocation) => void;
  summary: string;
};

const continentPaths = [
  "M74 116 111 83 177 68 240 85 284 120 271 153 238 169 220 202 180 216 151 188 117 184 91 153Z",
  "M229 224 272 239 304 278 320 326 307 375 286 425 264 445 251 401 236 356 217 311 208 267Z",
  "M432 80 470 62 505 76 504 107 470 116 438 101Z",
  "M450 137 500 127 548 145 566 177 541 208 506 211 478 190 450 177Z",
  "M476 213 530 215 568 248 579 304 558 360 532 406 501 375 483 332 463 278Z",
  "M548 133 606 105 685 101 752 121 815 144 889 169 910 211 867 231 817 221 781 244 732 222 690 237 653 206 608 193 570 170Z",
  "M763 345 812 326 860 340 883 376 858 408 808 417 775 390Z",
  "M882 248 895 258 889 278 879 265Z",
  "M578 419 600 430 591 448 571 439Z",
];

const countryLines = [
  "M121 93 138 145 179 214M178 69 181 126 237 169M234 87 220 126 270 153",
  "M232 250 275 275 300 325M245 315 307 374M263 374 286 425",
  "M455 145 492 169 541 146M479 190 512 158 548 177M492 213 519 249 568 248",
  "M481 273 534 283 575 302M495 332 558 360M520 216 532 406",
  "M573 137 618 192 652 108M624 118 690 236M686 104 732 222M745 122 781 244M816 145 817 221M861 159 867 231",
  "M775 355 812 416M821 332 858 407",
];

function getValue(location: MapLocation, metric: MapMetric) {
  if (metric === "visits") return location.visits;
  if (metric === "days") return location.days;
  return location.visits * 4 + location.days + location.returnRate / 2;
}

export function ScratchWorldMap({ locations, layer, metric, selectedId, onSelect, summary }: ScratchWorldMapProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [focus, setFocus] = useState({ x: 50, y: 50 });

  const maxValue = useMemo(() => Math.max(...locations.map((location) => getValue(location, metric)), 1), [locations, metric]);
  const hovered = locations.find((location) => location.id === hoveredId) ?? null;

  function updateFocus(event: MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    setFocus({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    });
  }

  function focusLocation(location: MapLocation) {
    setHoveredId(location.id);
    setFocus({ x: (location.x / 1000) * 100, y: (location.y / 520) * 100 });
  }

  const canvasStyle = {
    "--map-scale": zoom,
    "--map-origin-x": `${focus.x}%`,
    "--map-origin-y": `${focus.y}%`,
  } as CSSProperties;

  return (
    <div className="scratch-map">
      <div
        className="scratch-map__viewport"
        onMouseLeave={() => setHoveredId(null)}
        onMouseMove={updateFocus}
      >
        <div className="scratch-map__canvas" style={canvasStyle}>
          <svg viewBox="0 0 1000 520" role="img" aria-label={`Mapa-múndi interativo com ${locations.length} cidades em destaque`}>
            <defs>
              <linearGradient id="goldFoil" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0" stopColor="#8f6423" />
                <stop offset="0.24" stopColor="#f8e39b" />
                <stop offset="0.45" stopColor="#b98029" />
                <stop offset="0.72" stopColor="#f5d77c" />
                <stop offset="1" stopColor="#7a501b" />
              </linearGradient>
              <pattern id="foilHatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(28)">
                <rect width="10" height="10" fill="url(#goldFoil)" />
                <line x1="0" x2="0" y1="0" y2="10" stroke="#fff4be" strokeOpacity=".16" strokeWidth="2" />
              </pattern>
              <filter id="roughReveal" x="-30%" y="-30%" width="160%" height="160%">
                <feTurbulence baseFrequency="0.035" numOctaves="3" seed="12" type="fractalNoise" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="7" />
              </filter>
              <filter id="mapGlow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="7" />
              </filter>
              <radialGradient id="oceanLight">
                <stop offset="0" stopColor="#19334a" stopOpacity=".72" />
                <stop offset="1" stopColor="#07111f" stopOpacity="0" />
              </radialGradient>
            </defs>

            <rect width="1000" height="520" fill="#07111f" />
            <circle cx="500" cy="250" r="400" fill="url(#oceanLight)" />

            <g className="map-grid" aria-hidden="true">
              {[95, 175, 255, 335, 415].map((y) => <line key={y} x1="45" y1={y} x2="955" y2={y} />)}
              {[130, 290, 450, 610, 770, 930].map((x) => <path key={x} d={`M${x} 46 Q${x - 35} 260 ${x} 474`} />)}
            </g>

            <g className="foil-continents" aria-hidden="true">
              {continentPaths.map((path, index) => <path d={path} key={index} />)}
              {countryLines.map((path, index) => <path className="country-lines" d={path} key={index} />)}
            </g>

            <g className="ocean-labels" aria-hidden="true">
              <text x="105" y="278">OCEANO PACÍFICO</text>
              <text x="380" y="275">ATLÂNTICO</text>
              <text x="660" y="318">OCEANO ÍNDICO</text>
              <text x="742" y="88">ÁRTICO</text>
            </g>

            <g className="compass" transform="translate(91 390)" aria-hidden="true">
              <circle r="31" />
              <path d="M0-27 6-6 0 0-6-6ZM0 27 5 7 0 2-5 7ZM-27 0-6-6 0 0-6 6ZM27 0 6-6 0 0 6 6Z" />
              <text x="0" y="-37">N</text>
            </g>

            <g className="revealed-locations">
              {locations.map((location) => {
                const intensity = getValue(location, metric) / maxValue;
                const isSelected = selectedId === location.id;
                const isHovered = hoveredId === location.id;
                const baseRadius = layer === "wishlist" ? 11 : layer === "community" ? 13 : 10;
                const radius = baseRadius + intensity * (layer === "community" ? 18 : 14);
                return (
                  <g
                    className={`scratch-location scratch-location--${layer} ${isSelected ? "is-selected" : ""} ${isHovered ? "is-hovered" : ""}`}
                    key={location.id}
                    aria-hidden="true"
                  >
                    {layer !== "wishlist" && <circle className="location-glow" cx={location.x} cy={location.y} fill={location.color} r={radius * 2.15} filter="url(#mapGlow)" />}
                    <circle className="scratch-fringe" cx={location.x} cy={location.y} r={radius + 5} stroke={location.color} />
                    <circle className="scratch-reveal" cx={location.x} cy={location.y} fill={layer === "wishlist" ? "transparent" : location.color} r={radius} filter="url(#roughReveal)" />
                    <circle className="location-pin" cx={location.x} cy={location.y} r={isSelected || isHovered ? 4.8 : 3.4} />
                    {(isSelected || isHovered) && (
                      <g className="map-label" transform={`translate(${location.x + 12} ${location.y - radius - 10})`}>
                        <rect x="0" y="-24" width={Math.max(112, location.city.length * 8 + 28)} height="34" rx="8" />
                        <text x="12" y="-8">{location.city}</text>
                        <text className="map-label__country" x="12" y="3">{location.country}</text>
                      </g>
                    )}
                  </g>
                );
              })}
            </g>
          </svg>
          <div className="map-hotspots" aria-label="Cidades disponíveis no mapa">
            {locations.map((location) => (
              <button
                aria-label={`${location.city}, ${location.country}`}
                className={selectedId === location.id ? "map-hotspot is-selected" : "map-hotspot"}
                key={location.id}
                onClick={() => onSelect(location)}
                onFocus={() => focusLocation(location)}
                onMouseEnter={() => focusLocation(location)}
                onMouseLeave={() => setHoveredId(null)}
                style={{ left: `${(location.x / 1000) * 100}%`, top: `${(location.y / 520) * 100}%` }}
                type="button"
              />
            ))}
          </div>
        </div>

        <div className="scratch-map__top-label"><Sparkles size={14} /> Passe o cursor para explorar</div>
        <div className="scratch-map__zoom" aria-label="Controles de zoom">
          <button type="button" onClick={() => setZoom((value) => Math.min(1.7, value + 0.15))} aria-label="Aumentar zoom"><Plus size={16} /></button>
          <button type="button" onClick={() => setZoom((value) => Math.max(1, value - 0.15))} aria-label="Diminuir zoom"><Minus size={16} /></button>
          <button type="button" onClick={() => { setZoom(1); setFocus({ x: 50, y: 50 }); }} aria-label="Redefinir zoom"><RotateCcw size={15} /></button>
        </div>

        <div className={hovered ? "map-hover-card is-visible" : "map-hover-card"}>
          {hovered && (
            <>
              <span>{hovered.country}</span>
              <strong>{hovered.city}</strong>
              <small>{hovered.lastActivity}</small>
            </>
          )}
        </div>
      </div>

      <div className="scratch-map__footer">
        <span className="foil-key"><i /> ainda não revelado</span>
        <span className="color-key"><i /> cidade revelada</span>
        <strong>{summary}</strong>
      </div>
    </div>
  );
}
