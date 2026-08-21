"use client";

import {
  useRef,
  useState,
} from "react";

import {
  ChevronLeft,
  ChevronRight,
  Compass,
  Heart,
  MapPin,
  Sparkles,
  Star,
  TrendingUp,
  UsersRound,
  Waves,
} from "lucide-react";

import { AppHeader } from "@/components/AppHeader";

import {
  RealWorldMap,
  type RealMapLocation,
} from "@/components/RealWorldMap";

type Destination = {
  id: string;
  city: string;
  country: string;
  image: string;
  rating: number;
  recommendations: number;
  visits: number;
  wishes: number;
};

type DiscoverySection = {
  id: string;
  title: string;
  subtitle: string;
  icon:
    | typeof TrendingUp
    | typeof Heart
    | typeof UsersRound
    | typeof Waves
    | typeof Sparkles;
  destinations: string[];
};

const mapLocations: RealMapLocation[] = [
  {
    id: "barcelona",
    city: "Barcelona",
    country: "Espanha",
    coordinates: [
      2.1734,
      41.3851,
    ],
    visits: 512,
    nights: 0,
    places: 84,
    returnRate: 67,
    localScore: 89,
    period:
      "Muito recomendada pela comunidade",
    color: "#20b5bb",
    image:
      "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=900&q=82",
    modes: ["community"],
  },
  {
    id: "kyoto",
    city: "Kyoto",
    country: "Japão",
    coordinates: [
      135.7681,
      35.0116,
    ],
    visits: 286,
    nights: 0,
    places: 72,
    returnRate: 61,
    localScore: 94,
    period:
      "Cultura e bairros históricos",
    color: "#20b5bb",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=82",
    modes: ["community"],
  },
  {
    id: "paris",
    city: "Paris",
    country: "França",
    coordinates: [
      2.3522,
      48.8566,
    ],
    visits: 942,
    nights: 0,
    places: 126,
    returnRate: 74,
    localScore: 91,
    period:
      "Museus, bairros e gastronomia",
    color: "#20b5bb",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=82",
    modes: ["community"],
  },
  {
    id: "cusco",
    city: "Cusco",
    country: "Peru",
    coordinates: [
      -71.9675,
      -13.5319,
    ],
    visits: 318,
    nights: 0,
    places: 65,
    returnRate: 58,
    localScore: 92,
    period:
      "História e natureza",
    color: "#20b5bb",
    image:
      "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=900&q=82",
    modes: ["community"],
  },
  {
    id: "new-york",
    city: "Nova York",
    country: "Estados Unidos",
    coordinates: [
      -74.006,
      40.7128,
    ],
    visits: 795,
    nights: 0,
    places: 143,
    returnRate: 71,
    localScore: 85,
    period:
      "Cultura, museus e vida noturna",
    color: "#20b5bb",
    image:
      "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&w=900&q=82",
    modes: ["community"],
  },
  {
    id: "cape-town",
    city: "Cidade do Cabo",
    country: "África do Sul",
    coordinates: [
      18.4241,
      -33.9249,
    ],
    visits: 305,
    nights: 0,
    places: 74,
    returnRate: 62,
    localScore: 90,
    period:
      "Natureza, praia e aventura",
    color: "#20b5bb",
    image:
      "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=900&q=82",
    modes: ["community"],
  },
];

const destinations: Destination[] = [
  {
    id: "barcelona",
    city: "Barcelona",
    country: "Espanha",
    image:
      "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=900&q=82",
    rating: 4.8,
    recommendations: 512,
    visits: 18430,
    wishes: 22100,
  },
  {
    id: "kyoto",
    city: "Kyoto",
    country: "Japão",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=82",
    rating: 4.8,
    recommendations: 286,
    visits: 14820,
    wishes: 27640,
  },
  {
    id: "maldivas",
    city: "Maldivas",
    country: "Maldivas",
    image:
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=900&q=82",
    rating: 4.9,
    recommendations: 324,
    visits: 13240,
    wishes: 31200,
  },
  {
    id: "paris",
    city: "Paris",
    country: "França",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=82",
    rating: 4.9,
    recommendations: 942,
    visits: 29780,
    wishes: 24700,
  },
  {
    id: "cusco",
    city: "Cusco",
    country: "Peru",
    image:
      "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=900&q=82",
    rating: 4.7,
    recommendations: 318,
    visits: 11420,
    wishes: 18900,
  },
  {
    id: "santorini",
    city: "Santorini",
    country: "Grécia",
    image:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=82",
    rating: 4.8,
    recommendations: 412,
    visits: 12760,
    wishes: 29850,
  },
  {
    id: "new-york",
    city: "Nova York",
    country: "Estados Unidos",
    image:
      "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&w=900&q=82",
    rating: 4.6,
    recommendations: 795,
    visits: 26810,
    wishes: 21340,
  },
  {
    id: "tromso",
    city: "Tromsø",
    country: "Noruega",
    image:
      "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?auto=format&fit=crop&w=900&q=82",
    rating: 4.9,
    recommendations: 742,
    visits: 8640,
    wishes: 22460,
  },
  {
    id: "dubai",
    city: "Dubai",
    country: "Emirados Árabes",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=82",
    rating: 4.7,
    recommendations: 561,
    visits: 21570,
    wishes: 18100,
  },
  {
    id: "cape-town",
    city: "Cidade do Cabo",
    country: "África do Sul",
    image:
      "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=900&q=82",
    rating: 4.6,
    recommendations: 305,
    visits: 10830,
    wishes: 17220,
  },
];

const discoverySections: DiscoverySection[] = [
  {
    id: "most-visited",
    title:
      "Mais visitados pela comunidade",
    subtitle:
      "Destinos com mais registros de viagem no Atlas.",
    icon: TrendingUp,
    destinations: [
      "paris",
      "new-york",
      "dubai",
      "barcelona",
      "kyoto",
      "maldivas",
      "santorini",
      "cusco",
    ],
  },
  {
    id: "most-wanted",
    title:
      "Mais desejados",
    subtitle:
      "Os lugares que mais aparecem nas listas de desejos.",
    icon: Heart,
    destinations: [
      "maldivas",
      "santorini",
      "kyoto",
      "paris",
      "tromso",
      "barcelona",
      "new-york",
      "cusco",
    ],
  },
  {
    id: "locals",
    title:
      "Escolhas de moradores",
    subtitle:
      "Lugares recomendados por quem vive no destino.",
    icon: UsersRound,
    destinations: [
      "kyoto",
      "barcelona",
      "cape-town",
      "cusco",
      "paris",
      "new-york",
      "tromso",
      "dubai",
    ],
  },
  {
    id: "beaches",
    title:
      "Praias para conhecer",
    subtitle:
      "Destinos para quem quer mar, descanso e paisagens costeiras.",
    icon: Waves,
    destinations: [
      "maldivas",
      "santorini",
      "barcelona",
      "cape-town",
      "tromso",
      "dubai",
    ],
  },
  {
    id: "culture",
    title:
      "História e cultura",
    subtitle:
      "Museus, arquitetura, bairros históricos e experiências culturais.",
    icon: Sparkles,
    destinations: [
      "paris",
      "kyoto",
      "cusco",
      "barcelona",
      "new-york",
      "dubai",
    ],
  },
];

function findDestination(
  id: string,
) {
  return destinations.find(
    (destination) =>
      destination.id === id,
  );
}

export function ExploreDashboardV2() {
  const [
    selectedLocation,
    setSelectedLocation,
  ] =
    useState<RealMapLocation>(
      mapLocations[0],
    );

  const [
    favorites,
    setFavorites,
  ] =
    useState<Set<string>>(
      new Set(),
    );

  const carouselRefs =
    useRef<
      Record<
        string,
        HTMLDivElement | null
      >
    >({});

  function toggleFavorite(
    id: string,
  ) {
    setFavorites(
      (current) => {
        const next =
          new Set(current);

        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }

        return next;
      },
    );
  }

  function scrollSection(
    sectionId: string,
    direction:
      | "left"
      | "right",
  ) {
    const container =
      carouselRefs.current[
        sectionId
      ];

    if (!container) {
      return;
    }

    const distance =
      Math.min(
        container.clientWidth *
          0.82,
        900,
      );

    container.scrollBy({
      left:
        direction === "left"
          ? -distance
          : distance,
      behavior: "smooth",
    });
  }

  return (
    <div className="travel-app-shell explore-v2-shell">
      <AppHeader />

      <main className="explore-v2-page">
        <section className="explore-v2-hero">
          <RealWorldMap
            locations={
              mapLocations
            }
            mode="community"
            onSelect={
              setSelectedLocation
            }
            selectedId={
              selectedLocation.id
            }
          />

          <div className="explore-v2-copy">
            <span className="travel-overline">
              <Compass
                size={15}
              />
              Descubra
            </span>

            <h1>
              Encontre o próximo
              lugar que combina
              com você.
            </h1>

            <p>
              Recomendações de
              moradores,
              viajantes
              recorrentes e
              pessoas que você
              segue.
            </p>

            <div className="explore-v2-quick-filters">
              <button
                className="is-active"
                type="button"
              >
                Descobrir
              </button>

              <button type="button">
                Perto de mim
              </button>

              <button type="button">
                Escolhas locais
              </button>

              <button type="button">
                Para o meu perfil
              </button>
            </div>
          </div>
        </section>

        <section className="explore-discovery-content">
          {discoverySections.map(
            (section) => {
              const Icon =
                section.icon;

              const sectionDestinations =
                section.destinations
                  .map(
                    findDestination,
                  )
                  .filter(
                    (
                      destination,
                    ): destination is Destination =>
                      Boolean(
                        destination,
                      ),
                  );

              return (
                <section
                  className="explore-destination-section"
                  key={
                    section.id
                  }
                >
                  <div className="explore-destination-section__header">
                    <div>
                      <span className="explore-destination-section__overline">
                        <Icon
                          size={15}
                        />
                        Descobertas
                      </span>

                      <h2>
                        {
                          section.title
                        }
                      </h2>

                      <p>
                        {
                          section.subtitle
                        }
                      </p>
                    </div>

                    <button
                      type="button"
                    >
                      Ver todos
                      <ChevronRight
                        size={15}
                      />
                    </button>
                  </div>

                  <div className="explore-section-carousel">
                    <button
                      aria-label="Voltar"
                      className="explore-section-arrow explore-section-arrow--left"
                      onClick={() =>
                        scrollSection(
                          section.id,
                          "left",
                        )
                      }
                      type="button"
                    >
                      <ChevronLeft
                        size={19}
                      />
                    </button>

                    <div
                      className="explore-section-track"
                      ref={(
                        element,
                      ) => {
                        carouselRefs.current[
                          section.id
                        ] =
                          element;
                      }}
                    >
                      {sectionDestinations.map(
                        (
                          destination,
                        ) => {
                          const favorite =
                            favorites.has(
                              destination.id,
                            );

                          return (
                            <article
                              className="explore-place-card"
                              key={
                                destination.id
                              }
                            >
                              <div
                                className="explore-place-card__image"
                                style={{
                                  backgroundImage:
                                    `url(${destination.image})`,
                                }}
                              >
                                <button
                                  aria-label={
                                    favorite
                                      ? "Remover dos favoritos"
                                      : "Adicionar aos favoritos"
                                  }
                                  className={
                                    favorite
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
                                      favorite
                                        ? "currentColor"
                                        : "none"
                                    }
                                    size={16}
                                  />
                                </button>

                                <div className="explore-place-card__place">
                                  <strong>
                                    {
                                      destination.city
                                    }
                                  </strong>

                                  <span>
                                    {
                                      destination.country
                                    }
                                  </span>
                                </div>
                              </div>

                              <div className="explore-place-card__meta">
                                <span>
                                  <Star
                                    fill="currentColor"
                                    size={11}
                                  />

                                  {
                                    destination.rating
                                  }
                                </span>

                                <small>
                                  {
                                    destination.recommendations
                                  }{" "}
                                  recomendações
                                </small>
                              </div>
                            </article>
                          );
                        },
                      )}
                    </div>

                    <button
                      aria-label="Avançar"
                      className="explore-section-arrow explore-section-arrow--right"
                      onClick={() =>
                        scrollSection(
                          section.id,
                          "right",
                        )
                      }
                      type="button"
                    >
                      <ChevronRight
                        size={19}
                      />
                    </button>
                  </div>
                </section>
              );
            },
          )}
        </section>
      </main>
    </div>
  );
}