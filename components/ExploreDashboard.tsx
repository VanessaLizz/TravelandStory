"use client";

import {
  useCallback,
  useMemo,
  useState,
} from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bookmark,
  Camera,
  Compass,
  Heart,
  MapPin,
  Navigation,
  Plus,
  Repeat2,
  Sparkles,
  Star,
  UsersRound,
} from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import {
  RealWorldMap,
  type RealMapLocation,
  type RealMapMode,
} from "@/components/RealWorldMap";

type DestinationFilter =
  | "discover"
  | "nearby"
  | "locals"
  | "profile";

type Destination = {
  id: string;
  city: string;
  country: string;
  title: string;
  image: string;
  rating: number;
  recommendations: number;
  label: string;
  filters: DestinationFilter[];
};

const mapLocations: RealMapLocation[] = [
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
    color: "#ff6b63",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=82",
    modes: ["visited", "community"],
  },
  {
    id: "taiba",
    city: "Taíba",
    country: "Brasil",
    coordinates: [-38.9206, -3.5068],
    visits: 2,
    nights: 0,
    places: 6,
    returnRate: 68,
    localScore: 94,
    period:
      "2 visitas de um dia, sem criar viagem",
    color: "#f58c72",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=82",
    modes: ["visited", "community"],
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
    color: "#ff6b63",
    image:
      "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=1200&q=82",
    modes: ["visited", "community"],
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
    period: "Tempo líquido: 9 dias",
    color: "#e56b70",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=82",
    modes: ["visited", "community"],
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
    color: "#ee7866",
    image:
      "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1200&q=82",
    modes: ["visited", "community"],
  },
  {
    id: "tokyo",
    city: "Tóquio",
    country: "Japão",
    coordinates: [139.6917, 35.6895],
    visits: 9824,
    nights: 0,
    places: 346,
    returnRate: 62,
    localScore: 91,
    period:
      "Na sua lista desde março de 2025",
    color: "#27b6bd",
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=82",
    modes: ["wishlist", "community"],
  },
  {
    id: "reykjavik",
    city: "Reykjavík",
    country: "Islândia",
    coordinates: [-21.9426, 64.1466],
    visits: 3618,
    nights: 0,
    places: 92,
    returnRate: 58,
    localScore: 93,
    period:
      "Melhor aderência: natureza e fotografia",
    color: "#27b6bd",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=82",
    modes: ["wishlist", "community"],
  },
  {
    id: "cape-town",
    city: "Cidade do Cabo",
    country: "África do Sul",
    coordinates: [18.4241, -33.9249],
    visits: 5470,
    nights: 0,
    places: 128,
    returnRate: 69,
    localScore: 90,
    period:
      "Desejada por 1.840 pessoas da rede",
    color: "#27b6bd",
    image:
      "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=1200&q=82",
    modes: ["wishlist", "community"],
  },
  {
    id: "cusco",
    city: "Cusco",
    country: "Peru",
    coordinates: [-71.9675, -13.5319],
    visits: 4215,
    nights: 0,
    places: 104,
    returnRate: 66,
    localScore: 87,
    period:
      "Em crescimento nos últimos 30 dias",
    color: "#27b6bd",
    image:
      "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1200&q=82",
    modes: ["wishlist", "community"],
  },
];

const destinations: Destination[] = [
  {
    id: "kyoto-temples",
    city: "Kyoto",
    country: "Japão",
    title:
      "Templos, jardins e ruas históricas",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=82",
    rating: 4.8,
    recommendations: 286,
    label: "Escolha dos moradores",
    filters: ["discover", "locals", "profile"],
  },
  {
    id: "taiba-day",
    city: "Taíba",
    country: "Brasil",
    title: "Praia, lagoa e um dia sem roteiro",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=82",
    rating: 4.7,
    recommendations: 94,
    label: "Perto de você",
    filters: [
      "discover",
      "nearby",
      "locals",
      "profile",
    ],
  },
  {
    id: "lisbon-viewpoints",
    city: "Lisboa",
    country: "Portugal",
    title:
      "Miradouros e bairros para caminhar",
    image:
      "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=1200&q=82",
    rating: 4.9,
    recommendations: 418,
    label: "Viajantes que retornam",
    filters: ["discover", "locals", "profile"],
  },
  {
    id: "tokyo-night",
    city: "Tóquio",
    country: "Japão",
    title:
      "Bairros de Tóquio depois do pôr do sol",
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=82",
    rating: 4.8,
    recommendations: 530,
    label: "Em alta na comunidade",
    filters: ["discover", "profile"],
  },
  {
    id: "paris-local",
    city: "Paris",
    country: "França",
    title: "Paris além dos cartões-postais",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=82",
    rating: 4.6,
    recommendations: 351,
    label: "Preferido dos locais",
    filters: ["discover", "locals"],
  },
  {
    id: "rio-trails",
    city: "Rio de Janeiro",
    country: "Brasil",
    title:
      "Trilhas com a cidade aos seus pés",
    image:
      "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1200&q=82",
    rating: 4.8,
    recommendations: 276,
    label: "Natureza perto de você",
    filters: ["discover", "nearby", "profile"],
  },
];

const mapModes: Array<{
  id: RealMapMode;
  label: string;
  shortLabel: string;
  icon: typeof MapPin;
}> = [
  {
    id: "visited",
    label: "Lugares que visitei",
    shortLabel: "Já visitei",
    icon: MapPin,
  },
  {
    id: "wishlist",
    label: "Lugares que quero conhecer",
    shortLabel: "Quero visitar",
    icon: Bookmark,
  },
  {
    id: "community",
    label: "Movimento da comunidade",
    shortLabel: "Comunidade",
    icon: UsersRound,
  },
];

const destinationFilters: Array<{
  id: DestinationFilter;
  label: string;
}> = [
  { id: "discover", label: "Descobrir" },
  { id: "nearby", label: "Perto de mim" },
  { id: "locals", label: "Escolhas locais" },
  {
    id: "profile",
    label: "Para o meu perfil",
  },
];

export function ExploreDashboard() {
  const [mapMode, setMapMode] =
    useState<RealMapMode>("visited");

  const [selectedLocation, setSelectedLocation] =
    useState<RealMapLocation>(mapLocations[0]);

  const [destinationFilter, setDestinationFilter] =
    useState<DestinationFilter>("discover");

  const [favorites, setFavorites] = useState<
    Set<string>
  >(new Set(["lisbon-viewpoints"]));

  const visibleDestinations = useMemo(
    () =>
      destinations.filter((destination) =>
        destination.filters.includes(
          destinationFilter,
        ),
      ),
    [destinationFilter],
  );

  const selectLocation = useCallback(
    (location: RealMapLocation) => {
      setSelectedLocation(location);
    },
    [],
  );

  function changeMapMode(mode: RealMapMode) {
    const firstLocation = mapLocations.find(
      (location) => location.modes.includes(mode),
    );

    setMapMode(mode);

    if (firstLocation) {
      setSelectedLocation(firstLocation);
    }
  }

  function toggleFavorite(destinationId: string) {
    setFavorites((currentFavorites) => {
      const nextFavorites = new Set(
        currentFavorites,
      );

      if (nextFavorites.has(destinationId)) {
        nextFavorites.delete(destinationId);
      } else {
        nextFavorites.add(destinationId);
      }

      return nextFavorites;
    });
  }

  const selectedModeLabel =
    mapModes.find((mode) => mode.id === mapMode)
      ?.label ?? "Lugares no mapa";

  const selectedMetric =
    mapMode === "community"
      ? `${selectedLocation.visits.toLocaleString(
          "pt-BR",
        )} registros públicos`
      : mapMode === "wishlist"
        ? "Na sua lista de desejos"
        : `${selectedLocation.visits} ${
            selectedLocation.visits === 1
              ? "visita"
              : "visitas"
          }`;

  return (
    <div className="travel-app-shell">
      <AppHeader />

      <main className="travel-explore-page">
        <section
          className="travel-map-hero"
          aria-labelledby="map-hero-title"
        >
          <RealWorldMap
            locations={mapLocations}
            mode={mapMode}
            onSelect={selectLocation}
            selectedId={selectedLocation.id}
          />

          <div className="map-story-card">
            <span className="travel-overline">
              <Compass size={15} />
              Atlas vivo
            </span>

            <h1 id="map-hero-title">
              Seu mundo começa pelo mapa.
            </h1>

            <p>
              Aproxime, explore e registre cada
              cidade — mesmo quando foi apenas uma
              visita de um dia.
            </p>

            <Link
              className="travel-primary-action"
              href="/perfil"
            >
              Abrir meu mapa
              <ArrowRight size={17} />
            </Link>
          </div>

          <div
            className="map-layer-switcher"
            aria-label="Camadas do mapa"
          >
            {mapModes.map(
              ({
                id,
                shortLabel,
                icon: Icon,
              }) => (
                <button
                  aria-pressed={mapMode === id}
                  className={
                    mapMode === id
                      ? "is-active"
                      : ""
                  }
                  key={id}
                  onClick={() => changeMapMode(id)}
                  type="button"
                >
                  <Icon size={16} />
                  <span>{shortLabel}</span>
                </button>
              ),
            )}
          </div>

          <aside
            className="map-location-card"
            aria-live="polite"
          >
            <div
              aria-label={`Fotografia de ${selectedLocation.city}`}
              className="map-location-card__photo"
              role="img"
              style={{
                backgroundImage: `url(${selectedLocation.image})`,
              }}
            >
              <span>{selectedModeLabel}</span>

              <button
                aria-label="Salvar cidade"
                type="button"
              >
                <Heart size={18} />
              </button>
            </div>

            <div className="map-location-card__body">
              <span className="map-location-card__country">
                <MapPin size={13} />
                {selectedLocation.country}
              </span>

              <h2>{selectedLocation.city}</h2>
              <p>{selectedLocation.period}</p>

              <div className="map-location-card__metrics">
                <div>
                  <strong>{selectedMetric}</strong>
                  <span>no mapa</span>
                </div>

                <div>
                  <strong>
                    {selectedLocation.returnRate}%
                  </strong>
                  <span>taxa de retorno</span>
                </div>

                <div>
                  <strong>
                    {selectedLocation.localScore}%
                  </strong>
                  <span>aprovação local</span>
                </div>
              </div>

              <button
                className="map-location-card__action"
                type="button"
              >
                Explorar {selectedLocation.city}
                <ArrowRight size={16} />
              </button>
            </div>
          </aside>
        </section>

        <section
          className="destination-explore-section"
          id="destinos"
        >
          <div className="travel-section-heading">
            <div>
              <span className="travel-overline">
                <Camera size={15} />
                Fotos e destinos
              </span>

              <h2>
                Encontre o próximo lugar que combina
                com você.
              </h2>

              <p>
                Recomendações de moradores,
                viajantes recorrentes e pessoas que
                você segue.
              </p>
            </div>

            <Link href="/perfil">
              Ver minha lista
              <ArrowRight size={16} />
            </Link>
          </div>

          <div
            className="destination-filter-row"
            aria-label="Filtros de destinos"
          >
            {destinationFilters.map((filter) => (
              <button
                aria-pressed={
                  destinationFilter === filter.id
                }
                className={
                  destinationFilter === filter.id
                    ? "is-active"
                    : ""
                }
                key={filter.id}
                onClick={() =>
                  setDestinationFilter(filter.id)
                }
                type="button"
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="destination-photo-grid">
            {visibleDestinations.map(
              (destination) => {
                const isFavorite = favorites.has(
                  destination.id,
                );

                return (
                  <article
                    className="destination-photo-card"
                    key={destination.id}
                  >
                    <div
                      aria-label={`Fotografia de ${destination.city}`}
                      className="destination-photo-card__image"
                      role="img"
                      style={{
                        backgroundImage: `url(${destination.image})`,
                      }}
                    >
                      <span>
                        {destination.label}
                      </span>

                      <button
                        aria-label={
                          isFavorite
                            ? "Remover dos desejos"
                            : "Adicionar aos desejos"
                        }
                        aria-pressed={isFavorite}
                        className={
                          isFavorite
                            ? "is-favorite"
                            : ""
                        }
                        onClick={() =>
                          toggleFavorite(
                            destination.id,
                          )
                        }
                        type="button"
                      >
                        <Heart
                          fill={
                            isFavorite
                              ? "currentColor"
                              : "none"
                          }
                          size={19}
                        />
                      </button>
                    </div>

                    <div className="destination-photo-card__content">
                      <span className="destination-photo-card__place">
                        {destination.city} ·{" "}
                        {destination.country}
                      </span>

                      <h3>{destination.title}</h3>

                      <div className="destination-photo-card__meta">
                        <span>
                          <Star
                            fill="currentColor"
                            size={14}
                          />
                          {destination.rating.toFixed(
                            1,
                          )}
                        </span>

                        <span>
                          {
                            destination.recommendations
                          }{" "}
                          recomendações
                        </span>
                      </div>
                    </div>
                  </article>
                );
              },
            )}
          </div>
        </section>

        <section
          className="community-travel-section"
          id="comunidade"
        >
          <article className="local-discovery-card">
            <div
              aria-label="Rua com cafés frequentados por moradores"
              className="local-discovery-card__photo"
              role="img"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1400&q=82)",
              }}
            />

            <div className="local-discovery-card__content">
              <span className="travel-overline">
                <UsersRound size={15} />
                Vivido por quem mora
              </span>

              <h2>
                Turístico ou escolha dos locais? Veja
                os dois lados.
              </h2>

              <p>
                Separe recomendações de moradores
                das atividades do dia a dia e
                descubra onde eles realmente
                levariam uma visita.
              </p>

              <button type="button">
                Explorar escolhas locais
                <ArrowRight size={16} />
              </button>
            </div>
          </article>

          <article className="open-wishlist-card">
            <span className="open-wishlist-card__icon">
              <Sparkles size={22} />
            </span>

            <span className="travel-overline">
              Sem viagem marcada
            </span>

            <h2>
              Guarde vontades sem inventar um
              roteiro.
            </h2>

            <p>
              Adicione cidades e lugares agora.
              Quando a viagem existir, você decide o
              que entra no plano.
            </p>

            <div className="open-wishlist-card__items">
              <span>
                <Navigation size={15} />
                Reykjavík
                <small>natureza</small>
              </span>

              <span>
                <Navigation size={15} />
                Kyoto
                <small>cultura</small>
              </span>

              <span>
                <Navigation size={15} />
                Cusco
                <small>história</small>
              </span>
            </div>

            <button type="button">
              <Plus size={16} />
              Adicionar um desejo
            </button>
          </article>
        </section>

        <section className="travel-return-note">
          <Repeat2 size={18} />

          <p>
            <strong>
              Voltar também conta uma história.
            </strong>{" "}
            A recorrência ajuda o mapa a mostrar os
            lugares com os quais você criou vínculo.
          </p>
        </section>
      </main>
    </div>
  );
}