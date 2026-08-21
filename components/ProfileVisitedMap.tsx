"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type {
  Feature,
  FeatureCollection,
  MultiPolygon,
  Polygon,
} from "geojson";

import type {
  GeoJSONSource,
  Map as MapLibreMap,
} from "maplibre-gl";

import {
  CalendarDays,
  Clock3,
  Globe2,
  MapPin,
  Plane,
  Search,
  Star,
  TrendingUp,
} from "lucide-react";

type CityGeometry =
  | Polygon
  | MultiPolygon;

type VisitedCity = {
  id: string;
  city: string;
  country: string;
  searchName: string;

  coordinates: [
    number,
    number,
  ];

  visits: number;
  nights: number;
  places: number;
  rating: number;
  lastActivity: string;
  image: string;
  isResidence?: boolean;
};

type BoundaryProperties = {
  id: string;
  color: string;
  selected: number;
  residence: number;
};

const visitedCities: VisitedCity[] =
  [
    {
      id: "fortaleza",
      city: "Fortaleza",
      country: "Brasil",
      searchName:
        "Fortaleza, Ceará, Brasil",
      coordinates: [
        -38.5267,
        -3.7319,
      ],
      visits: 7,
      nights: 46,
      places: 18,
      rating: 4.8,
      lastActivity:
        "Julho de 2026",
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=82",
      isResidence: true,
    },

    {
      id: "paris",
      city: "Paris",
      country: "França",
      searchName:
        "Paris, France",
      coordinates: [
        2.3522,
        48.8566,
      ],
      visits: 4,
      nights: 24,
      places: 21,
      rating: 4.9,
      lastActivity:
        "Janeiro de 2026",
      image:
        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=700&q=82",
    },

    {
      id: "lisboa",
      city: "Lisboa",
      country: "Portugal",
      searchName:
        "Lisboa, Portugal",
      coordinates: [
        -9.1393,
        38.7223,
      ],
      visits: 3,
      nights: 19,
      places: 12,
      rating: 4.8,
      lastActivity:
        "Maio de 2026",
      image:
        "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=700&q=82",
    },

    {
      id: "lyon",
      city: "Lyon",
      country: "França",
      searchName:
        "Lyon, France",
      coordinates: [
        4.8357,
        45.764,
      ],
      visits: 2,
      nights: 3,
      places: 7,
      rating: 4.4,
      lastActivity:
        "Janeiro de 2026",
      image:
        "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=700&q=82",
    },

    {
      id: "buenos-aires",
      city:
        "Buenos Aires",
      country:
        "Argentina",
      searchName:
        "Buenos Aires, Argentina",
      coordinates: [
        -58.3816,
        -34.6037,
      ],
      visits: 2,
      nights: 11,
      places: 9,
      rating: 4.5,
      lastActivity:
        "Outubro de 2025",
      image:
        "https://images.unsplash.com/photo-1589909202802-8f4aadce1849?auto=format&fit=crop&w=700&q=82",
    },

    {
      id: "rio",
      city:
        "Rio de Janeiro",
      country: "Brasil",
      searchName:
        "Rio de Janeiro, Brasil",
      coordinates: [
        -43.1729,
        -22.9068,
      ],
      visits: 2,
      nights: 9,
      places: 13,
      rating: 4.7,
      lastActivity:
        "Fevereiro de 2025",
      image:
        "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=700&q=82",
    },

    {
      id: "nova-york",
      city: "Nova York",
      country:
        "Estados Unidos",
      searchName:
        "New York City, New York, USA",
      coordinates: [
        -74.006,
        40.7128,
      ],
      visits: 1,
      nights: 8,
      places: 14,
      rating: 4.4,
      lastActivity:
        "Abril de 2025",
      image:
        "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&w=700&q=82",
    },
  ];

function visitColor(
  city: VisitedCity,
) {
  if (city.isResidence) {
    return "#8b78d1";
  }

  if (city.visits >= 6) {
    return "#128c92";
  }

  if (city.visits >= 4) {
    return "#20b5bb";
  }

  if (city.visits >= 2) {
    return "#72d0cf";
  }

  return "#c9eeeb";
}

function validGeometry(
  geometry:
    | GeoJSON.Geometry
    | null,
): geometry is CityGeometry {
  return (
    geometry?.type ===
      "Polygon" ||
    geometry?.type ===
      "MultiPolygon"
  );
}

function wait(
  milliseconds: number,
) {
  return new Promise<void>(
    (resolve) =>
      window.setTimeout(
        resolve,
        milliseconds,
      ),
  );
}

async function loadBoundary(
  city: VisitedCity,
): Promise<CityGeometry | null> {
  const key =
    `atlas-boundary-${city.id}-v3`;

  const cached =
    window.localStorage.getItem(
      key,
    );

  if (cached) {
    try {
      return JSON.parse(
        cached,
      ) as CityGeometry;
    } catch {
      window.localStorage.removeItem(
        key,
      );
    }
  }

  const url =
    new URL(
      "https://nominatim.openstreetmap.org/search",
    );

  url.searchParams.set(
    "format",
    "geojson",
  );

  url.searchParams.set(
    "polygon_geojson",
    "1",
  );

  url.searchParams.set(
    "limit",
    "1",
  );

  url.searchParams.set(
    "q",
    city.searchName,
  );

  try {
    const response =
      await fetch(
        url.toString(),
        {
          headers: {
            Accept:
              "application/geo+json, application/json",
          },
        },
      );

    if (!response.ok) {
      return null;
    }

    const collection =
      (await response.json()) as
        FeatureCollection;

    const geometry =
      collection.features[0]
        ?.geometry ?? null;

    if (
      !validGeometry(
        geometry,
      )
    ) {
      return null;
    }

    window.localStorage.setItem(
      key,
      JSON.stringify(
        geometry,
      ),
    );

    return geometry;
  } catch {
    return null;
  }
}

function createCollection(
  geometries: Map<
    string,
    CityGeometry
  >,
  selectedId: string,
): FeatureCollection<
  CityGeometry,
  BoundaryProperties
> {
  const features: Feature<
    CityGeometry,
    BoundaryProperties
  >[] = [];

  visitedCities.forEach(
    (city) => {
      const geometry =
        geometries.get(
          city.id,
        );

      if (!geometry) {
        return;
      }

      features.push({
        type: "Feature",

        geometry,

        properties: {
          id: city.id,

          color:
            visitColor(city),

          selected:
            city.id ===
            selectedId
              ? 1
              : 0,

          residence:
            city.isResidence
              ? 1
              : 0,
        },
      });
    },
  );

  return {
    type:
      "FeatureCollection",

    features,
  };
}

function geometryBounds(
  geometry: CityGeometry,
): [
  [number, number],
  [number, number],
] | null {
  const points: [
    number,
    number,
  ][] = [];

  if (
    geometry.type ===
    "Polygon"
  ) {
    geometry.coordinates.forEach(
      (ring) =>
        ring.forEach(
          (point) =>
            points.push([
              point[0],
              point[1],
            ]),
        ),
    );
  } else {
    geometry.coordinates.forEach(
      (polygon) =>
        polygon.forEach(
          (ring) =>
            ring.forEach(
              (point) =>
                points.push([
                  point[0],
                  point[1],
                ]),
            ),
        ),
    );
  }

  if (!points.length) {
    return null;
  }

  let minLng =
    points[0][0];

  let maxLng =
    points[0][0];

  let minLat =
    points[0][1];

  let maxLat =
    points[0][1];

  points.forEach(
    ([lng, lat]) => {
      minLng =
        Math.min(
          minLng,
          lng,
        );

      maxLng =
        Math.max(
          maxLng,
          lng,
        );

      minLat =
        Math.min(
          minLat,
          lat,
        );

      maxLat =
        Math.max(
          maxLat,
          lat,
        );
    },
  );

  return [
    [minLng, minLat],
    [maxLng, maxLat],
  ];
}

export function ProfileVisitedMap() {
  const containerRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const mapRef =
    useRef<MapLibreMap | null>(
      null,
    );

  const boundariesRef =
    useRef<
      Map<
        string,
        CityGeometry
      >
    >(new Map());

  const [
    mapReady,
    setMapReady,
  ] =
    useState(false);

  const [
    version,
    setVersion,
  ] =
    useState(0);

  const [
    selectedId,
    setSelectedId,
  ] =
    useState(
      visitedCities[0].id,
    );

  const [
    query,
    setQuery,
  ] =
    useState("");

  const selectedCity =
    visitedCities.find(
      (city) =>
        city.id ===
        selectedId,
    ) ??
    visitedCities[0];

  const countries =
    useMemo(
      () =>
        new Set(
          visitedCities.map(
            (city) =>
              city.country,
          ),
        ).size,
      [],
    );

  const totalVisits =
    useMemo(
      () =>
        visitedCities.reduce(
          (
            total,
            city,
          ) =>
            total +
            city.visits,
          0,
        ),
      [],
    );

  const filtered =
    useMemo(() => {
      const value =
        query
          .trim()
          .toLocaleLowerCase(
            "pt-BR",
          );

      if (!value) {
        return visitedCities;
      }

      return visitedCities.filter(
        (city) =>
          `${city.city} ${city.country}`
            .toLocaleLowerCase(
              "pt-BR",
            )
            .includes(value),
      );
    }, [query]);

  function selectCity(
    city: VisitedCity,
  ) {
    setSelectedId(
      city.id,
    );

    const geometry =
      boundariesRef.current.get(
        city.id,
      );

    const bounds =
      geometry
        ? geometryBounds(
            geometry,
          )
        : null;

    if (
      bounds &&
      mapRef.current
    ) {
      mapRef.current.fitBounds(
        bounds,
        {
          padding: 90,
          maxZoom: 11,
          duration: 900,
        },
      );

      return;
    }

    mapRef.current?.flyTo(
      {
        center:
          city.coordinates,
        zoom: 7,
        duration: 900,
        essential: true,
      },
    );
  }

  useEffect(() => {
    let cancelled = false;

    async function createMap() {
      if (
        !containerRef.current ||
        mapRef.current
      ) {
        return;
      }

      const maplibre =
        await import(
          "maplibre-gl"
        );

      if (
        cancelled ||
        !containerRef.current
      ) {
        return;
      }

      maplibre.setWorkerUrl(
        "/maplibre/maplibre-gl-worker.mjs",
      );

      const map =
        new maplibre.Map({
          container:
            containerRef.current,

          style:
            "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",

          center: [-8, 18],

          zoom: 1.2,

          minZoom: 0.7,

          maxZoom: 15,

          renderWorldCopies:
            false,
        });

      map.dragRotate.disable();

      map.touchZoomRotate.disableRotation();

      map.addControl(
        new maplibre.NavigationControl(
          {
            showCompass:
              false,
          },
        ),

        "bottom-right",
      );

      map.on(
        "load",
        () => {
          map.addSource(
            "profile-city-boundaries",
            {
              type: "geojson",

              data: {
                type:
                  "FeatureCollection",

                features: [],
              },
            },
          );

          map.addLayer({
            id:
              "profile-city-fill",

            type: "fill",

            source:
              "profile-city-boundaries",

            paint: {
              "fill-color": [
                "get",
                "color",
              ],

              "fill-opacity": [
                "case",

                [
                  "==",
                  [
                    "get",
                    "selected",
                  ],
                  1,
                ],

                0.96,

                0.8,
              ],
            },
          });

          map.addLayer({
            id:
              "profile-city-outline",

            type: "line",

            source:
              "profile-city-boundaries",

            paint: {
              "line-color": [
                "get",
                "color",
              ],

              "line-width": [
                "case",

                [
                  "==",
                  [
                    "get",
                    "selected",
                  ],
                  1,
                ],

                2.8,

                1.2,
              ],
            },
          });

          map.on(
            "mouseenter",
            "profile-city-fill",
            () => {
              map.getCanvas().style.cursor =
                "pointer";
            },
          );

          map.on(
            "mouseleave",
            "profile-city-fill",
            () => {
              map.getCanvas().style.cursor =
                "";
            },
          );

          map.on(
            "click",
            "profile-city-fill",
            (event) => {
              const id =
                event
                  .features?.[0]
                  ?.properties?.id;

              const city =
                visitedCities.find(
                  (item) =>
                    item.id ===
                    id,
                );

              if (city) {
                selectCity(
                  city,
                );
              }
            },
          );

          setMapReady(
            true,
          );
        },
      );

      mapRef.current =
        map;
    }

    createMap();

    return () => {
      cancelled = true;

      mapRef.current?.remove();

      mapRef.current =
        null;
    };
  }, []);

  useEffect(() => {
    if (!mapReady) {
      return;
    }

    let cancelled = false;

    async function fetchCities() {
      for (
        const city of
        visitedCities
      ) {
        if (
          cancelled ||
          boundariesRef.current.has(
            city.id,
          )
        ) {
          continue;
        }

        const geometry =
          await loadBoundary(
            city,
          );

        if (cancelled) {
          return;
        }

        if (geometry) {
          boundariesRef.current.set(
            city.id,
            geometry,
          );

          setVersion(
            (value) =>
              value + 1,
          );
        }

        await wait(
          1100,
        );
      }
    }

    fetchCities();

    return () => {
      cancelled = true;
    };
  }, [mapReady]);

  useEffect(() => {
    if (!mapReady) {
      return;
    }

    const source =
      mapRef.current?.getSource(
        "profile-city-boundaries",
      ) as
        | GeoJSONSource
        | undefined;

    source?.setData(
      createCollection(
        boundariesRef.current,
        selectedId,
      ),
    );
  }, [
    mapReady,
    selectedId,
    version,
  ]);

  function showWorld() {
    mapRef.current?.flyTo(
      {
        center: [-8, 18],
        zoom: 1.2,
        duration: 900,
        essential: true,
      },
    );
  }

  return (
    <section className="profile-map-refresh">
      <div className="profile-map-refresh__main">
        <header className="profile-map-refresh__header">
          <div>
            <span className="profile-map-refresh__eyebrow">
              MEU ATLAS
            </span>

            <h2>
              Explore o seu
              mundo cidade por
              cidade.
            </h2>

            <p>
              Somente cidades
              realmente
              visitadas aparecem
              coloridas.
            </p>
          </div>

          <label className="profile-map-refresh__search">
            <Search
              size={17}
            />

            <input
              value={query}
              onChange={(
                event,
              ) =>
                setQuery(
                  event.target
                    .value,
                )
              }
              placeholder="Buscar cidade ou país..."
            />
          </label>
        </header>

        <div className="profile-map-refresh__map">
          <div
            className="profile-map-refresh__canvas"
            ref={containerRef}
          />

          <div className="profile-map-refresh__world-card">
            <span>
              SEU MUNDO
            </span>

            <strong>
              {
                visitedCities.length
              }{" "}
              cidades ·{" "}
              {countries} países
            </strong>
          </div>

          <div className="profile-map-refresh__legend">
            <span>
              Nº DE VISITAS
            </span>

            <div>
              <i className="visit-level visit-level--1" />
              <small>
                1 visita
              </small>
            </div>

            <div>
              <i className="visit-level visit-level--2" />
              <small>
                2–3 visitas
              </small>
            </div>

            <div>
              <i className="visit-level visit-level--3" />
              <small>
                4–5 visitas
              </small>
            </div>

            <div>
              <i className="visit-level visit-level--4" />
              <small>
                6+ visitas
              </small>
            </div>

            <div className="profile-map-refresh__residence-legend">
              <i className="visit-level visit-level--residence" />

              <small>
                Local de moradia
              </small>
            </div>
          </div>

          <button
            className="profile-map-refresh__world-button"
            onClick={
              showWorld
            }
            type="button"
          >
            <Globe2
              size={15}
            />
            Ver mundo inteiro
          </button>
        </div>

        <article className="profile-selected-city">
          <div
            className="profile-selected-city__photo"
            style={{
              backgroundImage:
                `url(${selectedCity.image})`,
            }}
          >
            <span>
              <MapPin
                size={13}
              />

              {selectedCity.isResidence
                ? "Minha cidade"
                : "Já visitei"}
            </span>
          </div>

          <div className="profile-selected-city__identity">
            <small>
              {
                selectedCity.country
              }
            </small>

            <h3>
              {
                selectedCity.city
              }
            </h3>

            <p>
              <CalendarDays
                size={14}
              />

              Última visita em{" "}
              {
                selectedCity.lastActivity
              }
            </p>
          </div>

          <div className="profile-selected-city__numbers">
            <div>
              <strong>
                {
                  selectedCity.visits
                }
              </strong>
              <span>
                visitas
              </span>
            </div>

            <div>
              <strong>
                {
                  selectedCity.nights
                }
              </strong>
              <span>
                noites
              </span>
            </div>

            <div>
              <strong>
                {
                  selectedCity.places
                }
              </strong>
              <span>
                lugares
              </span>
            </div>
          </div>

          <button
            className="profile-selected-city__button"
            type="button"
          >
            Ver detalhes
          </button>
        </article>
      </div>

      <aside className="profile-travel-diary">
        <div className="profile-travel-diary__stats">
          <div>
            <MapPin
              size={18}
            />
            <strong>
              {
                visitedCities.length
              }
            </strong>
            <span>
              cidades
            </span>
          </div>

          <div>
            <Plane
              size={18}
            />
            <strong>
              {countries}
            </strong>
            <span>
              países
            </span>
          </div>

          <div>
            <TrendingUp
              size={18}
            />
            <strong>
              {totalVisits}
            </strong>
            <span>
              visitas
            </span>
          </div>
        </div>

        <div className="profile-travel-diary__heading">
          <div>
            <span>
              HISTÓRICO
            </span>

            <h3>
              Diário de
              viagens
            </h3>
          </div>

          <TrendingUp
            size={18}
          />
        </div>

        <div className="profile-travel-diary__list">
          {filtered.map(
            (city) => (
              <button
                className={
                  selectedId ===
                  city.id
                    ? "profile-travel-city is-selected"
                    : "profile-travel-city"
                }
                key={city.id}
                onClick={() =>
                  selectCity(
                    city,
                  )
                }
                type="button"
              >
                <span
                  className="profile-travel-city__photo"
                  style={{
                    backgroundImage:
                      `url(${city.image})`,
                  }}
                />

                <span className="profile-travel-city__name">
                  <strong>
                    {city.city}
                  </strong>

                  <small>
                    {
                      city.country
                    }
                  </small>
                </span>

                <span className="profile-travel-city__rating">
                  <strong>
                    {
                      city.visits
                    }
                    ×
                  </strong>

                  <small>
                    <Star
                      fill="currentColor"
                      size={11}
                    />
                    {
                      city.rating
                    }
                  </small>
                </span>
              </button>
            ),
          )}
        </div>

        <section className="profile-journey-summary">
          <h4>
            Resumo da sua
            jornada
          </h4>

          <div>
            <article>
              <Clock3
                size={17}
              />
              <span>
                Tempo viajando
              </span>
              <strong>
                2 anos, 4 meses
              </strong>
            </article>

            <article>
              <Plane
                size={17}
              />
              <span>
                Primeira viagem
              </span>
              <strong>
                Abr 2022
              </strong>
            </article>

            <article>
              <CalendarDays
                size={17}
              />
              <span>
                Última viagem
              </span>
              <strong>
                Jul 2026
              </strong>
            </article>
          </div>
        </section>
      </aside>
    </section>
  );
}