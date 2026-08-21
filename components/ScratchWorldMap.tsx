"use client";

import { useMemo, useState } from "react";
import { Minus, Plus, RotateCcw, Sparkles } from "lucide-react";
import type { CSSProperties, MouseEvent } from "react";
import type {
  MapLayer,
  MapLocation,
  MapMetric,
} from "@/types/travel";

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

function getValue(
  location: MapLocation,
  metric: MapMetric,
) {
  if (metric === "visits") return location.visits;
  if (metric === "days") return location.days;

  return (
    location.visits * 4 +
    location.days +
    location.returnRate / 2
  );
}

function revealColor(intensity: number) {
  const lightness = 76 - intensity * 29;
  return `hsl(4 82% ${lightness}%)`;
}

export function ScratchWorldMap({
  locations,
  layer,
  metric,
  selectedId,
  onSelect,
  summary,
}: ScratchWorldMapProps) {
  const [hoveredId, setHoveredId] =
    useState<string | null>(null);

  const [zoom, setZoom] = useState(1);

  const [focus, setFocus] = useState({
    x: 50,
    y: 50,
  });

  const maxValue = useMemo(
    () =>
      Math.max(
        ...locations.map((location) =>
          getValue(location, metric),
        ),
        1,
      ),
    [locations, metric],
  );

  const hovered =
    locations.find(
      (location) => location.id === hoveredId,
    ) ?? null;

  function updateFocus(
    event: MouseEvent<HTMLDivElement>,
  ) {
    if (zoom === 1) return;

    const rect =
      event.currentTarget.getBoundingClientRect();

    setFocus({
      x:
        ((event.clientX - rect.left) /
          rect.width) *
        100,
      y:
        ((event.clientY - rect.top) /
          rect.height) *
        100,
    });
  }

  function focusLocation(location: MapLocation) {
    setHoveredId(location.id);

    setFocus({
      x: (location.x / 1000) * 100,
      y: (location.y / 520) * 100,
    });

    setZoom((currentZoom) =>
      Math.max(currentZoom, 1.14),
    );
  }

  function resetMap() {
    setZoom(1);
    setFocus({ x: 50, y: 50 });
    setHoveredId(null);
  }

  const canvasStyle = {
    "--poster-scale": zoom,
    "--poster-origin-x": `${focus.x}%`,
    "--poster-origin-y": `${focus.y}%`,
  } as CSSProperties;

  return (
    <div className="poster-map">
      <div
        className="poster-map__viewport"
        onMouseLeave={() => setHoveredId(null)}
        onMouseMove={updateFocus}
      >
        <div
          className="poster-map__canvas"
          style={canvasStyle}
        >
          <svg
            aria-label={`Mapa-múndi pessoal aberto com ${locations.length} cidades em destaque`}
            role="img"
            viewBox="0 0 1000 520"
          >
            <defs>
              <linearGradient
                id="posterPaper"
                x1="0"
                x2="1"
                y1="0"
                y2="1"
              >
                <stop
                  offset="0"
                  stopColor="#f4ead8"
                />
                <stop
                  offset="0.48"
                  stopColor="#fffaf0"
                />
                <stop
                  offset="1"
                  stopColor="#eadbc3"
                />
              </linearGradient>

              <linearGradient
                id="posterFoil"
                x1="0"
                x2="1"
                y1="0"
                y2="1"
              >
                <stop
                  offset="0"
                  stopColor="#8b6530"
                />
                <stop
                  offset="0.2"
                  stopColor="#dec27f"
                />
                <stop
                  offset="0.42"
                  stopColor="#aa7c36"
                />
                <stop
                  offset="0.7"
                  stopColor="#f2dda3"
                />
                <stop
                  offset="1"
                  stopColor="#8d642d"
                />
              </linearGradient>

              <pattern
                height="12"
                id="posterHatch"
                patternTransform="rotate(24)"
                patternUnits="userSpaceOnUse"
                width="12"
              >
                <rect
                  fill="url(#posterFoil)"
                  height="12"
                  width="12"
                />

                <line
                  stroke="#fff6ce"
                  strokeOpacity=".24"
                  strokeWidth="2"
                  x1="0"
                  x2="0"
                  y1="0"
                  y2="12"
                />
              </pattern>

              <pattern
                height="7"
                id="paperGrain"
                patternUnits="userSpaceOnUse"
                width="7"
              >
                <circle
                  cx="1"
                  cy="2"
                  fill="#6f5735"
                  opacity=".055"
                  r=".8"
                />

                <circle
                  cx="5"
                  cy="5"
                  fill="#ffffff"
                  opacity=".32"
                  r=".7"
                />
              </pattern>

              <filter
                id="posterRough"
                height="170%"
                width="170%"
                x="-35%"
                y="-35%"
              >
                <feTurbulence
                  baseFrequency="0.045"
                  numOctaves="3"
                  result="noise"
                  seed="18"
                  type="fractalNoise"
                />

                <feDisplacementMap
                  in="SourceGraphic"
                  in2="noise"
                  scale="6"
                />
              </filter>

              <filter
                id="posterShadow"
                height="180%"
                width="180%"
                x="-40%"
                y="-40%"
              >
                <feDropShadow
                  dx="0"
                  dy="5"
                  floodColor="#594222"
                  floodOpacity=".24"
                  stdDeviation="6"
                />
              </filter>
            </defs>

            <rect
              fill="url(#posterPaper)"
              height="520"
              width="1000"
            />

            <rect
              fill="url(#paperGrain)"
              height="520"
              width="1000"
            />

            <g
              aria-hidden="true"
              className="poster-map__grid"
            >
              {[95, 175, 255, 335, 415].map(
                (y) => (
                  <line
                    key={y}
                    x1="45"
                    x2="955"
                    y1={y}
                    y2={y}
                  />
                ),
              )}

              {[130, 290, 450, 610, 770, 930].map(
                (x) => (
                  <path
                    d={`M${x} 46 Q${x - 35} 260 ${x} 474`}
                    key={x}
                  />
                ),
              )}
            </g>

            <g
              aria-hidden="true"
              className="poster-map__continents"
            >
              {continentPaths.map(
                (path, index) => (
                  <path
                    d={path}
                    key={index}
                  />
                ),
              )}

              {countryLines.map(
                (path, index) => (
                  <path
                    className="poster-map__country-lines"
                    d={path}
                    key={index}
                  />
                ),
              )}
            </g>

            <g
              aria-hidden="true"
              className="poster-map__ocean-labels"
            >
              <text x="92" y="278">
                OCEANO PACÍFICO
              </text>

              <text x="375" y="276">
                ATLÂNTICO
              </text>

              <text x="665" y="320">
                OCEANO ÍNDICO
              </text>

              <text x="735" y="83">
                ÁRTICO
              </text>
            </g>

            <g
              aria-hidden="true"
              className="poster-map__compass"
              transform="translate(91 401)"
            >
              <circle r="30" />

              <path d="M0-27 6-6 0 0-6-6ZM0 27 5 7 0 2-5 7ZM-27 0-6-6 0 0-6 6ZM27 0 6-6 0 0 6 6Z" />

              <text x="0" y="-37">
                N
              </text>
            </g>

            <g className="poster-map__reveals">
              {locations.map((location) => {
                const intensity =
                  getValue(location, metric) /
                  maxValue;

                const isSelected =
                  selectedId === location.id;

                const isHovered =
                  hoveredId === location.id;

                const baseRadius =
                  layer === "wishlist" ? 10 : 12;

                const radius =
                  baseRadius + intensity * 14;

                const fill =
                  layer === "wishlist"
                    ? "#fffaf0"
                    : revealColor(intensity);

                const stroke =
                  layer === "wishlist"
                    ? "#20aeb4"
                    : revealColor(
                        Math.min(
                          1,
                          intensity + 0.15,
                        ),
                      );

                return (
                  <g
                    aria-hidden="true"
                    className={[
                      "poster-reveal",
                      `poster-reveal--${layer}`,
                      isSelected
                        ? "is-selected"
                        : "",
                      isHovered
                        ? "is-hovered"
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    key={location.id}
                  >
                    <circle
                      className="poster-reveal__fringe"
                      cx={location.x}
                      cy={location.y}
                      fill="none"
                      r={radius + 6}
                      stroke={stroke}
                    />

                    <circle
                      className="poster-reveal__area"
                      cx={location.x}
                      cy={location.y}
                      fill={fill}
                      filter="url(#posterRough)"
                      r={radius}
                      stroke={stroke}
                    />

                    <circle
                      className="poster-reveal__pin"
                      cx={location.x}
                      cy={location.y}
                      r={
                        isSelected || isHovered
                          ? 4.8
                          : 3.4
                      }
                    />

                    {(isSelected || isHovered) && (
                      <g
                        className="poster-reveal__label"
                        filter="url(#posterShadow)"
                        transform={`translate(${location.x + 13} ${
                          location.y -
                          radius -
                          10
                        })`}
                      >
                        <rect
                          height="36"
                          rx="9"
                          width={Math.max(
                            116,
                            location.city.length *
                              8 +
                              30,
                          )}
                          x="0"
                          y="-25"
                        />

                        <text x="12" y="-8">
                          {location.city}
                        </text>

                        <text
                          className="poster-reveal__country"
                          x="12"
                          y="4"
                        >
                          {location.country}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </g>
          </svg>

          <div
            aria-label="Cidades disponíveis no mapa"
            className="poster-map__hotspots"
          >
            {locations.map((location) => (
              <button
                aria-label={`${location.city}, ${location.country}`}
                className={
                  selectedId === location.id
                    ? "is-selected"
                    : ""
                }
                key={location.id}
                onClick={() =>
                  onSelect(location)
                }
                onFocus={() =>
                  focusLocation(location)
                }
                onMouseEnter={() =>
                  focusLocation(location)
                }
                onMouseLeave={() =>
                  setHoveredId(null)
                }
                style={{
                  left: `${
                    (location.x / 1000) * 100
                  }%`,
                  top: `${
                    (location.y / 520) * 100
                  }%`,
                }}
                type="button"
              />
            ))}
          </div>
        </div>

        <div className="poster-map__hint">
          <Sparkles size={14} />
          Passe o cursor para aproximar
        </div>

        <div
          aria-label="Controles de zoom"
          className="poster-map__zoom"
        >
          <button
            aria-label="Aumentar zoom"
            onClick={() =>
              setZoom((value) =>
                Math.min(1.7, value + 0.15),
              )
            }
            type="button"
          >
            <Plus size={16} />
          </button>

          <button
            aria-label="Diminuir zoom"
            onClick={() =>
              setZoom((value) =>
                Math.max(1, value - 0.15),
              )
            }
            type="button"
          >
            <Minus size={16} />
          </button>

          <button
            aria-label="Redefinir zoom"
            onClick={resetMap}
            type="button"
          >
            <RotateCcw size={15} />
          </button>
        </div>

        <div
          className={
            hovered
              ? "poster-map__hover is-visible"
              : "poster-map__hover"
          }
        >
          {hovered && (
            <>
              <span>{hovered.country}</span>
              <strong>{hovered.city}</strong>
              <small>
                {hovered.lastActivity}
              </small>
            </>
          )}
        </div>
      </div>

      <div className="poster-map__footer">
        <span className="poster-map__key poster-map__key--foil">
          <i />
          Ainda não revelado
        </span>

        <span className="poster-map__key poster-map__key--visited">
          <i />
          Cidade visitada
        </span>

        <span className="poster-map__key poster-map__key--wishlist">
          <i />
          Quero visitar
        </span>

        <strong>{summary}</strong>
      </div>
    </div>
  );
}