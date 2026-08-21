"use client";

import { useMemo, useState } from "react";
import {
  MapPin,
  Search,
  Star,
  Plane,
  TrendingUp,
} from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import {
  RealWorldMap,
  type RealMapLocation,
} from "@/components/RealWorldMap";

const visitedLocations: RealMapLocation[] = [
  {
    id: "fortaleza",
    city: "Fortaleza",
    country: "Brasil",
    coordinates: [-38.5267, -3.7319],
    visits: 7,
    nights: 31,
    places: 24,
    returnRate: 74,
    localScore: 92,
    period: "Última visita em julho de 2026",
    color: "#128c92",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=500&q=80",
    modes: ["visited"],
  },
  {
    id: "rio",
    city: "Rio de Janeiro",
    country: "Brasil",
    coordinates: [-43.1729, -22.9068],
    visits: 4,
    nights: 15,
    places: 17,
    returnRate: 76,
    localScore: 88,
    period: "4 visitas registradas",
    color: "#20b5bb",
    image:
      "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=500&q=80",
    modes: ["visited"],
  },
  {
    id: "lisboa",
    city: "Lisboa",
    country: "Portugal",
    coordinates: [-9.1393, 38.7223],
    visits: 3,
    nights: 12,
    places: 18,
    returnRate: 71,
    localScore: 89,
    period: "3 visitas · quer voltar",
    color: "#4fc8c8",
    image:
      "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=500&q=80",
    modes: ["visited"],
  },
  {
    id: "paris",
    city: "Paris",
    country: "França",
    coordinates: [2.3522, 48.8566],
    visits: 2,
    nights: 9,
    places: 21,
    returnRate: 64,
    localScore: 81,
    period: "2 visitas registradas",
    color: "#8edddd",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=500&q=80",
    modes: ["visited"],
  },
  {
    id: "taiba",
    city: "Taíba",
    country: "Brasil",
    coordinates: [-38.9206, -3.5068],
    visits: 1,
    nights: 0,
    places: 6,
    returnRate: 68,
    localScore: 94,
    period: "1 visita de um dia",
    color: "#c9efec",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=500&q=80",
    modes: ["visited"],
  },
];

function visitTone(visits: number) {
  if (visits >= 6) return "#128c92";
  if (visits >= 4) return "#20b5bb";
  if (visits >= 2) return "#63cecc";
  return "#bfeae7";
}

export function MapDashboard() {
  const [selectedLocation, setSelectedLocation] =
    useState<RealMapLocation>(visitedLocations[0]);
  const [query, setQuery] = useState("");

  const cities = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("pt-BR");
    if (!normalized) return visitedLocations;

    return visitedLocations.filter((location) =>
      `${location.city} ${location.country}`
        .toLocaleLowerCase("pt-BR")
        .includes(normalized),
    );
  }, [query]);

  const countryCount = new Set(
    visitedLocations.map((location) => location.country),
  ).size;

  const totalVisits = visitedLocations.reduce(
    (sum, location) => sum + location.visits,
    0,
  );

  return (
    <div className="travel-app-shell atlas-map-page-shell">
      <AppHeader />

      <main className="atlas-map-page">
        <section className="atlas-map-panel" aria-label="Mapa de cidades visitadas">
          <RealWorldMap
            locations={visitedLocations.map((location) => ({
              ...location,
              color: visitTone(location.visits),
            }))}
            mode="visited"
            onSelect={setSelectedLocation}
            selectedId={selectedLocation.id}
            areaMode
          />

          <div className="atlas-map-summary">
            <span>SEU MUNDO</span>
            <strong>
              {visitedLocations.length} cidades · {countryCount} países
            </strong>
          </div>

          <div className="atlas-map-legend" aria-label="Legenda do número de visitas">
            <span>Nº DE VISITAS</span>
            <div>
              <i style={{ background: "#bfeae7" }} />
              <small>1 visita</small>
            </div>
            <div>
              <i style={{ background: "#63cecc" }} />
              <small>2–3 visitas</small>
            </div>
            <div>
              <i style={{ background: "#20b5bb" }} />
              <small>4–5 visitas</small>
            </div>
            <div>
              <i style={{ background: "#128c92" }} />
              <small>6+ visitas</small>
            </div>
          </div>
        </section>

        <aside className="atlas-map-sidebar">
          <label className="atlas-map-search">
            <Search size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar cidade ou país..."
              aria-label="Buscar cidade ou país"
            />
          </label>

          <div className="atlas-map-stats">
            <div>
              <MapPin size={20} />
              <strong>{visitedLocations.length}</strong>
              <span>Cidades</span>
            </div>
            <div>
              <Plane size={20} />
              <strong>{countryCount}</strong>
              <span>Países</span>
            </div>
            <div>
              <TrendingUp size={20} />
              <strong>{totalVisits}</strong>
              <span>Visitas</span>
            </div>
          </div>

          <div className="atlas-map-diary-heading">
            <div>
              <span>HISTÓRICO</span>
              <h1>Diário de viagens</h1>
            </div>
            <TrendingUp size={20} />
          </div>

          <div className="atlas-map-city-list">
            {cities.map((location) => (
              <button
                className={
                  selectedLocation.id === location.id
                    ? "atlas-map-city-row is-selected"
                    : "atlas-map-city-row"
                }
                key={location.id}
                onClick={() => setSelectedLocation(location)}
                type="button"
              >
                <span
                  className="atlas-map-city-photo"
                  style={{ backgroundImage: `url(${location.image})` }}
                />
                <span className="atlas-map-city-copy">
                  <strong>{location.city}</strong>
                  <small>{location.country}</small>
                  <em>{location.period}</em>
                </span>
                <span className="atlas-map-city-metrics">
                  <strong>{location.visits}×</strong>
                  <small>
                    <Star size={13} fill="currentColor" />
                    {(location.localScore / 20).toFixed(1)}
                  </small>
                </span>
              </button>
            ))}
          </div>

          <div className="atlas-map-selected-card">
            <span>SELECIONADA</span>
            <strong>{selectedLocation.city}</strong>
            <p>
              {selectedLocation.visits} {selectedLocation.visits === 1 ? "visita" : "visitas"} · {selectedLocation.nights} noites · {selectedLocation.places} lugares registrados
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}
