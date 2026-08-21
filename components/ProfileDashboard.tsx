"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowRight,
  BadgeDollarSign,
  BarChart3,
  BookOpen,
  Bookmark,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Heart,
  History,
  Map as MapIcon,
  MapPin,
  Moon,
  Plane,
  Plus,
  Repeat2,
  Route,
  Search,
  Sparkles,
  Star,
  Sun,
  TrendingUp,
  Trophy,
  UserRound,
} from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { ScratchWorldMap } from "@/components/ScratchWorldMap";
import { StandaloneVisitModal } from "@/components/StandaloneVisitModal";
import {
  expenseData,
  initialStandaloneVisits,
  personalMonthly,
  personalTopCities,
  personalTripsByYear,
  personalVisited,
  personalWishlist,
} from "@/data/demo";
import type {
  MapLayer,
  MapLocation,
  MapMetric,
  NewStandaloneVisit,
  StandaloneVisitKind,
} from "@/types/travel";

type ProfileSection =
  | "map"
  | "insights"
  | "visits"
  | "diary";

const personalLayers: {
  id: MapLayer;
  label: string;
}[] = [
  {
    id: "visited",
    label: "Já visitei",
  },
  {
    id: "wishlist",
    label: "Quero visitar",
  },
];

const metricLabels: {
  id: MapMetric;
  label: string;
}[] = [
  {
    id: "bond",
    label: "Vínculo com a cidade",
  },
  {
    id: "visits",
    label: "Quantidade de visitas",
  },
  {
    id: "days",
    label: "Noites efetivas",
  },
];

const profileExpenseData = expenseData.map(
  (item, index) => ({
    ...item,
    color: [
      "#ef6b62",
      "#3b9297",
      "#e1ad55",
      "#9b79b6",
      "#a5a29b",
    ][index],
  }),
);

const countryPanorama = [
  {
    country: "Brasil",
    cities: 3,
    visits: 11,
    nights: 55,
    returnRate: 78,
  },
  {
    country: "França",
    cities: 2,
    visits: 6,
    nights: 27,
    returnRate: 67,
  },
  {
    country: "Portugal",
    cities: 1,
    visits: 3,
    nights: 19,
    returnRate: 67,
  },
  {
    country: "Argentina",
    cities: 1,
    visits: 2,
    nights: 11,
    returnRate: 50,
  },
  {
    country: "Estados Unidos",
    cities: 1,
    visits: 1,
    nights: 8,
    returnRate: 0,
  },
];

const standaloneVisitImages: Record<
  string,
  string
> = {
  "standalone-taiba":
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=82",
  "standalone-canoa-quebrada":
    "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=700&q=82",
};

const fallbackVisitImage =
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=700&q=82";

const profileNavigation = [
  {
    id: "map",
    label: "Mapa",
    href: "#meu-mapa",
    icon: MapIcon,
  },
  {
    id: "insights",
    label: "Insights",
    href: "#insights",
    icon: BarChart3,
  },
  {
    id: "visits",
    label: "Avulsos",
    href: "#visitas-avulsas",
    icon: MapPin,
  },
  {
    id: "diary",
    label: "Diário",
    href: "#diario",
    icon: BookOpen,
  },
] as const;

function normalizedLocationKey(
  ...parts: string[]
) {
  return parts
    .join("|")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .replace(/\s+/g, " ")
    .trim();
}

function standaloneKindLabel(
  kind: StandaloneVisitKind,
) {
  if (kind === "day_trip") {
    return "Passeio de um dia";
  }

  if (kind === "overnight") {
    return "Com pernoite";
  }

  return "Estadia ou base";
}

export function ProfileDashboard() {
  const [layer, setLayer] =
    useState<MapLayer>("visited");

  const [metric, setMetric] =
    useState<MapMetric>("bond");

  const [selected, setSelected] =
    useState<MapLocation>(
      personalVisited[0],
    );

  const [
    standaloneVisits,
    setStandaloneVisits,
  ] = useState(initialStandaloneVisits);

  const [
    visitModalOpen,
    setVisitModalOpen,
  ] = useState(false);

  const [
    registrationNotice,
    setRegistrationNotice,
  ] = useState("");

  const [
    activeSection,
    setActiveSection,
  ] = useState<ProfileSection>("map");

  const locations = useMemo(
    () =>
      layer === "wishlist"
        ? personalWishlist
        : personalVisited,
    [layer],
  );

  const standaloneVisitTotal = useMemo(
    () =>
      standaloneVisits.reduce(
        (total, visit) =>
          total + visit.visitCount,
        0,
      ),
    [standaloneVisits],
  );

  const standaloneNights = useMemo(
    () =>
      standaloneVisits.reduce(
        (total, visit) =>
          total + visit.nights,
        0,
      ),
    [standaloneVisits],
  );

  function changeLayer(
    nextLayer: MapLayer,
  ) {
    const nextLocations =
      nextLayer === "wishlist"
        ? personalWishlist
        : personalVisited;

    setLayer(nextLayer);
    setSelected(nextLocations[0]);
  }

  function saveStandaloneVisit(
    visit: NewStandaloneVisit,
  ) {
    const newLocationKey =
      normalizedLocationKey(
        visit.place,
        visit.municipality,
        visit.region,
        visit.country,
      );

    setStandaloneVisits((current) => {
      const existing = current.find(
        (item) =>
          normalizedLocationKey(
            item.place,
            item.municipality,
            item.region,
            item.country,
          ) === newLocationKey,
      );

      if (!existing) {
        return [
          {
            ...visit,
            id: `standalone-${Date.now()}`,
            createdAtLabel:
              "Adicionado agora",
          },
          ...current,
        ];
      }

      return current.map((item) =>
        item.id === existing.id
          ? {
              ...item,
              visitCount:
                item.visitCount +
                visit.visitCount,
              nights:
                item.nights +
                visit.nights,
              period:
                visit.period ===
                "Datas não informadas"
                  ? item.period
                  : visit.period,
              wantsToReturn:
                item.wantsToReturn ||
                visit.wantsToReturn,
              note:
                visit.note ||
                item.note,
              createdAtLabel:
                "Atualizado agora",
            }
          : item,
      );
    });

    setRegistrationNotice(
      `${visit.place}: ${visit.visitCount} ${
        visit.visitCount === 1
          ? "visita registrada"
          : "visitas registradas"
      } sem criar uma viagem.`,
    );
  }

  function addOneStandaloneVisit(
    id: string,
  ) {
    const place = standaloneVisits.find(
      (visit) => visit.id === id,
    )?.place;

    setStandaloneVisits((current) =>
      current.map((visit) =>
        visit.id === id
          ? {
              ...visit,
              visitCount:
                visit.visitCount + 1,
              createdAtLabel:
                "Atualizado agora",
            }
          : visit,
      ),
    );

    setRegistrationNotice(
      `Mais uma visita a ${
        place ?? "esse lugar"
      } foi adicionada ao histórico.`,
    );
  }

  return (
    <div className="travel-profile-shell">
      <AppHeader />

      <main className="travel-profile-page">
        <section className="profile-app-intro">
          <div className="profile-app-intro__identity">
            <div className="profile-app-avatar">
              VS

              <span>
                <UserRound size={13} />
              </span>
            </div>

            <div>
              <span className="travel-overline">
                <Sparkles size={14} />
                Atlas pessoal
              </span>

              <h1>
                Minha História
                <br />
                no Mundo
              </h1>

              <p>
                <MapPin size={13} />
                Vanessa Sousa · Fortaleza,
                Brasil
              </p>
            </div>
          </div>

          <div
            aria-label="Resumo das viagens"
            className="profile-app-intro__stats"
          >
            <div>
              <strong>24</strong>
              <span>cidades</span>
            </div>

            <div>
              <strong>9</strong>
              <span>países</span>
            </div>

            <div>
              <strong>12</strong>
              <span>viagens</span>
            </div>

            <div>
              <strong>115</strong>
              <span>noites</span>
            </div>
          </div>

          <button
            className="travel-profile-primary"
            onClick={() =>
              setVisitModalOpen(true)
            }
            type="button"
          >
            <Plus size={17} />
            Adicionar visita
          </button>
        </section>

        <section
          className="personal-atlas-card"
          id="meu-mapa"
        >
          <div className="personal-atlas-toolbar">
            <div>
              <span className="travel-overline">
                <MapIcon size={14} />
                Aba 1 · Meu mapa
              </span>

              <h2>
                Explore o seu mundo cidade
                por cidade.
              </h2>

              <p>
                A intensidade da cor compara
                apenas as suas próprias
                visitas e o tempo efetivo em
                cada cidade.
              </p>
            </div>

            <div className="personal-atlas-tools">
              <label className="profile-map-search">
                <Search size={15} />

                <input
                  aria-label="Pesquisar cidade ou país"
                  placeholder="Pesquisar cidade ou país"
                />
              </label>

              <div className="personal-atlas-filters">
                <div
                  aria-label="Camadas do mapa pessoal"
                  className="travel-segmented-control"
                >
                  {personalLayers.map(
                    (item) => (
                      <button
                        aria-pressed={
                          layer === item.id
                        }
                        className={
                          layer === item.id
                            ? "is-active"
                            : ""
                        }
                        key={item.id}
                        onClick={() =>
                          changeLayer(
                            item.id,
                          )
                        }
                        type="button"
                      >
                        {item.label}
                      </button>
                    ),
                  )}
                </div>

                <label className="travel-select-control">
                  <span>
                    Intensidade
                  </span>

                  <select
                    disabled={
                      layer === "wishlist"
                    }
                    onChange={(event) =>
                      setMetric(
                        event.target
                          .value as MapMetric,
                      )
                    }
                    value={metric}
                  >
                    {metricLabels.map(
                      (item) => (
                        <option
                          key={item.id}
                          value={item.id}
                        >
                          {item.label}
                        </option>
                      ),
                    )}
                  </select>

                  <ChevronDown
                    size={14}
                  />
                </label>
              </div>
            </div>
          </div>

          <ScratchWorldMap
            layer={layer}
            locations={locations}
            metric={metric}
            onSelect={setSelected}
            selectedId={selected.id}
            summary={
              layer === "visited"
                ? "7 cidades reveladas · 5 retornos"
                : "5 cidades · 78 lugares salvos"
            }
          />

          <div className="personal-atlas-detail">
            <div className="personal-atlas-detail__city">
              <span
                className={
                  layer === "visited"
                    ? "travel-status travel-status--visited"
                    : "travel-status travel-status--wishlist"
                }
              >
                {layer === "visited"
                  ? "Já visitei"
                  : "Quero visitar"}
              </span>

              <span>
                {selected.country}
              </span>

              <h3>{selected.city}</h3>

              <p>
                <CalendarDays
                  size={14}
                />
                {selected.lastActivity}
              </p>
            </div>

            <div className="personal-atlas-detail__metrics">
              {layer === "visited" ? (
                <>
                  <div>
                    <strong>
                      {selected.visits}
                    </strong>
                    <span>visitas</span>
                  </div>

                  <div>
                    <strong>
                      {selected.days}
                    </strong>
                    <span>
                      noites efetivas
                    </span>
                  </div>

                  <div>
                    <strong>
                      {selected.places}
                    </strong>
                    <span>
                      lugares registrados
                    </span>
                  </div>

                  <div>
                    <strong>
                      {
                        selected.returnRate
                      }
                      %
                    </strong>
                    <span>
                      vínculo de retorno
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <strong>
                      {selected.places}
                    </strong>
                    <span>
                      lugares salvos
                    </span>
                  </div>

                  <div>
                    <strong>—</strong>
                    <span>
                      data definida
                    </span>
                  </div>

                  <div>
                    <strong>
                      {
                        selected.localScore
                      }
                      %
                    </strong>
                    <span>
                      aprovação local
                    </span>
                  </div>

                  <div>
                    <strong>Livre</strong>
                    <span>
                      sem roteiro obrigatório
                    </span>
                  </div>
                </>
              )}
            </div>

            <div className="personal-atlas-detail__note">
              <Clock3 size={18} />

              <div>
                <strong>
                  {layer === "visited"
                    ? "Tempo corrigido"
                    : "Lista independente"}
                </strong>

                <span>
                  {layer === "visited"
                    ? "Dias em outras cidades são descontados automaticamente da cidade-base."
                    : "Guarde lugares sem informar data ou criar uma viagem."}
                </span>
              </div>
            </div>

            <div className="personal-atlas-detail__actions">
              <button
                aria-label="Favoritar cidade"
                type="button"
              >
                <Heart size={18} />
              </button>

              <button type="button">
                {layer === "visited"
                  ? "Abrir diário"
                  : "Abrir lista"}

                <ArrowRight
                  size={16}
                />
              </button>
            </div>
          </div>
        </section>

        <section
          aria-label="Indicadores pessoais"
          className="profile-summary-grid"
        >
          <article className="goal-card">
            <div className="goal-card__ring">
              <strong>6</strong>

              <span>
                de 8
                <br />
                viagens
              </span>
            </div>

            <div className="goal-card__copy">
              <span>Meta de 2026</span>
              <strong>
                75% concluído
              </strong>
              <small>
                Faltam 2 viagens para
                completar a meta.
              </small>
            </div>

            <Trophy size={22} />
          </article>

          <MiniStat
            color="coral"
            detail="7 visitas registradas"
            icon={Repeat2}
            label="Mais revisitada"
            value="Fortaleza"
          />

          <MiniStat
            color="teal"
            detail="tempo efetivo calculado"
            icon={Clock3}
            label="Média por viagem"
            value="9,6 noites"
          />

          <MiniStat
            color="gold"
            detail="em 5 cidades"
            icon={Bookmark}
            label="Lista de desejos"
            value="78 lugares"
          />
        </section>

        <section
          className="profile-insights-section"
          id="insights"
        >
          <div className="travel-profile-section-heading">
            <div>
              <span className="travel-overline">
                <TrendingUp
                  size={14}
                />
                Aba 2 · Insights
              </span>

              <h2>
                O que suas viagens contam
                sobre você.
              </h2>

              <p>
                Recorrência, ritmo,
                interesses e gastos em uma
                leitura simples.
              </p>
            </div>

            <button
              className="travel-outline-button"
              type="button"
            >
              2026
              <ChevronDown size={15} />
            </button>
          </div>

          <div className="analytics-grid profile-analytics">
            <ProfileChartCard
              icon={
                <CalendarDays
                  size={17}
                />
              }
              subtitle="Evolução do seu histórico"
              title="Viagens por ano"
            >
              <ResponsiveContainer
                height={250}
                width="100%"
              >
                <BarChart
                  data={
                    personalTripsByYear
                  }
                  margin={{
                    top: 12,
                    right: 10,
                    left: -24,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid
                    stroke="#e5dfd4"
                    strokeDasharray="4 4"
                    vertical={false}
                  />

                  <XAxis
                    axisLine={false}
                    dataKey="year"
                    tick={{
                      fill: "#6f6a63",
                      fontSize: 11,
                    }}
                    tickLine={false}
                  />

                  <YAxis
                    allowDecimals={false}
                    axisLine={false}
                    tick={{
                      fill: "#a19b91",
                      fontSize: 10,
                    }}
                    tickLine={false}
                  />

                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      borderColor:
                        "#e5dfd4",
                    }}
                  />

                  <Bar
                    dataKey="trips"
                    fill="#ef6b62"
                    name="Viagens"
                    radius={[
                      7,
                      7,
                      0,
                      0,
                    ]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ProfileChartCard>

            <ProfileChartCard
              className="chart-card--wide"
              icon={<Route size={17} />}
              subtitle="Viagens e noites efetivas por mês"
              title="Ritmo durante o ano"
            >
              <ResponsiveContainer
                height={250}
                width="100%"
              >
                <LineChart
                  data={personalMonthly}
                  margin={{
                    top: 12,
                    right: 18,
                    left: -18,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid
                    stroke="#e5dfd4"
                    strokeDasharray="4 4"
                    vertical={false}
                  />

                  <XAxis
                    axisLine={false}
                    dataKey="month"
                    tick={{
                      fill: "#6f6a63",
                      fontSize: 11,
                    }}
                    tickLine={false}
                  />

                  <YAxis
                    axisLine={false}
                    tick={{
                      fill: "#a19b91",
                      fontSize: 10,
                    }}
                    tickLine={false}
                  />

                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      borderColor:
                        "#e5dfd4",
                    }}
                  />

                  <Legend
                    iconType="circle"
                    wrapperStyle={{
                      fontSize: 11,
                    }}
                  />

                  <Line
                    activeDot={{ r: 6 }}
                    dataKey="trips"
                    dot={{ r: 4 }}
                    name="Viagens"
                    stroke="#ef6b62"
                    strokeWidth={3}
                    type="monotone"
                  />

                  <Line
                    activeDot={{ r: 6 }}
                    dataKey="nights"
                    dot={{ r: 4 }}
                    name="Noites efetivas"
                    stroke="#3b9297"
                    strokeWidth={3}
                    type="monotone"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ProfileChartCard>

            <ProfileChartCard
              className="chart-card--wide"
              icon={<Clock3 size={17} />}
              subtitle="A cidade-base não recebe noites passadas em outro destino"
              title="Tempo efetivo por mês"
            >
              <ResponsiveContainer
                height={250}
                width="100%"
              >
                <AreaChart
                  data={personalMonthly}
                  margin={{
                    top: 12,
                    right: 18,
                    left: -18,
                    bottom: 0,
                  }}
                >
                  <defs>
                    <linearGradient
                      id="profileNightsArea"
                      x1="0"
                      x2="0"
                      y1="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#3b9297"
                        stopOpacity=".34"
                      />

                      <stop
                        offset="95%"
                        stopColor="#3b9297"
                        stopOpacity="0"
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    stroke="#e5dfd4"
                    strokeDasharray="4 4"
                    vertical={false}
                  />

                  <XAxis
                    axisLine={false}
                    dataKey="month"
                    tick={{
                      fill: "#6f6a63",
                      fontSize: 11,
                    }}
                    tickLine={false}
                  />

                  <YAxis
                    axisLine={false}
                    tick={{
                      fill: "#a19b91",
                      fontSize: 10,
                    }}
                    tickLine={false}
                  />

                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      borderColor:
                        "#e5dfd4",
                    }}
                  />

                  <Area
                    dataKey="nights"
                    fill="url(#profileNightsArea)"
                    name="Noites"
                    stroke="#3b9297"
                    strokeWidth={3}
                    type="monotone"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ProfileChartCard>

            <ProfileChartCard
              icon={<MapPin size={17} />}
              subtitle="Visitas e noites acumuladas"
              title="Cidades mais revisitadas"
            >
              <ResponsiveContainer
                height={250}
                width="100%"
              >
                <BarChart
                  data={personalTopCities}
                  layout="vertical"
                  margin={{
                    top: 2,
                    right: 12,
                    left: 26,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid
                    horizontal={false}
                    stroke="#e5dfd4"
                    strokeDasharray="4 4"
                  />

                  <XAxis
                    hide
                    type="number"
                  />

                  <YAxis
                    axisLine={false}
                    dataKey="city"
                    tick={{
                      fill: "#45423d",
                      fontSize: 10,
                    }}
                    tickLine={false}
                    type="category"
                    width={82}
                  />

                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      borderColor:
                        "#e5dfd4",
                    }}
                  />

                  <Legend
                    iconType="circle"
                    wrapperStyle={{
                      fontSize: 11,
                    }}
                  />

                  <Bar
                    dataKey="visits"
                    fill="#ef6b62"
                    name="Visitas"
                    radius={[
                      0,
                      5,
                      5,
                      0,
                    ]}
                  />

                  <Bar
                    dataKey="nights"
                    fill="#9ac8c4"
                    name="Noites"
                    radius={[
                      0,
                      5,
                      5,
                      0,
                    ]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ProfileChartCard>

            <ProfileChartCard
              icon={
                <BadgeDollarSign
                  size={17}
                />
              }
              subtitle="Distribuição opcional e privada"
              title="Média de gastos"
            >
              <div className="expense-chart-wrap">
                <ResponsiveContainer
                  height={205}
                  width="100%"
                >
                  <PieChart>
                    <Pie
                      data={
                        profileExpenseData
                      }
                      dataKey="value"
                      innerRadius={57}
                      outerRadius={82}
                      paddingAngle={3}
                    >
                      {profileExpenseData.map(
                        (item) => (
                          <Cell
                            fill={
                              item.color
                            }
                            key={
                              item.name
                            }
                          />
                        ),
                      )}
                    </Pie>

                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        borderColor:
                          "#e5dfd4",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                <div className="expense-chart-center">
                  <strong>
                    R$ 3.240
                  </strong>
                  <span>por viagem</span>
                </div>
              </div>

              <div className="chart-legend chart-legend--expenses">
                {profileExpenseData.map(
                  (item) => (
                    <span key={item.name}>
                      <i
                        style={{
                          background:
                            item.color,
                        }}
                      />
                      {item.name}
                      <strong>
                        {item.value}%
                      </strong>
                    </span>
                  ),
                )}
              </div>
            </ProfileChartCard>

            <ProfileChartCard
              icon={
                <Sparkles size={17} />
              }
              subtitle="Usado para refinar sugestões"
              title="Seu perfil de interesse"
            >
              <div className="affinity-list">
                <Affinity
                  color="#9b79b6"
                  label="História e cultura"
                  value={86}
                />

                <Affinity
                  color="#e1ad55"
                  label="Gastronomia local"
                  value={72}
                />

                <Affinity
                  color="#3b9297"
                  label="Natureza e jardins"
                  value={61}
                />

                <Affinity
                  color="#ef6b62"
                  label="Praias"
                  value={48}
                />
              </div>

              <button
                className="suggestion-banner"
                type="button"
              >
                <Sparkles size={18} />

                <span>
                  <strong>
                    12 sugestões compatíveis
                  </strong>

                  <small>
                    Baseadas em viagens e
                    desejos
                  </small>
                </span>

                <ArrowRight size={16} />
              </button>
            </ProfileChartCard>
          </div>

          <section className="travel-surface profile-country-panorama">
            <div className="travel-card-toolbar">
              <div>
                <span className="travel-overline">
                  <MapPin size={14} />
                  Panorama por país
                </span>

                <h2>
                  Indicadores em uma leitura
                  direta.
                </h2>

                <p>
                  Cidades, recorrência e
                  tempo efetivo sem marcar
                  um país inteiro como
                  visitado.
                </p>
              </div>

              <button
                className="travel-outline-button"
                type="button"
              >
                Todos os anos

                <ChevronDown
                  size={15}
                />
              </button>
            </div>

            <div className="profile-country-table">
              <div className="profile-country-row profile-country-row--head">
                <span>País</span>
                <span>Cidades</span>
                <span>Visitas</span>
                <span>Noites</span>
                <span>Retorno</span>
              </div>

              {countryPanorama.map(
                (item, index) => (
                  <div
                    className="profile-country-row"
                    key={item.country}
                  >
                    <span className="profile-country-name">
                      <i>{index + 1}</i>

                      <strong>
                        {item.country}
                      </strong>
                    </span>

                    <span>
                      {item.cities}
                    </span>

                    <span>
                      {item.visits}
                    </span>

                    <span>
                      {item.nights}
                    </span>

                    <span>
                      <b>
                        {
                          item.returnRate
                        }
                        %
                      </b>
                    </span>
                  </div>
                ),
              )}
            </div>
          </section>
        </section>

        <section
          className="travel-surface standalone-visits-section"
          id="visitas-avulsas"
        >
          <div className="travel-card-toolbar standalone-visits-toolbar">
            <div>
              <span className="travel-overline">
                <History size={14} />
                Aba 3 · Lugares avulsos
              </span>

              <h2>
                Visitas sem roteiro.
              </h2>

              <p>
                Registre bate-voltas e
                retornos antigos sem
                precisar criar uma viagem.
              </p>
            </div>

            <button
              className="travel-profile-primary"
              onClick={() =>
                setVisitModalOpen(true)
              }
              type="button"
            >
              <Plus size={16} />
              Adicionar visita
            </button>
          </div>

          <div className="standalone-visits-summary">
            <span>
              <History size={16} />

              <strong>
                {
                  standaloneVisits.length
                }
              </strong>

              lugares
            </span>

            <span>
              <Repeat2 size={16} />

              <strong>
                {standaloneVisitTotal}
              </strong>

              visitas
            </span>

            <span>
              <Moon size={16} />

              <strong>
                {standaloneNights}
              </strong>

              noites
            </span>

            <span className="standalone-visits-summary__independent">
              <CheckCircle2 size={16} />

              <strong>0</strong>

              viagens criadas
            </span>
          </div>

          {registrationNotice && (
            <div
              className="registration-notice"
              role="status"
            >
              <CheckCircle2 size={17} />

              <span>
                {registrationNotice}
              </span>

              <button
                aria-label="Fechar aviso"
                onClick={() =>
                  setRegistrationNotice("")
                }
                type="button"
              >
                ×
              </button>
            </div>
          )}

          <div className="standalone-visit-list">
            {standaloneVisits.map(
              (visit) => (
                <article
                  className="standalone-visit-row"
                  key={visit.id}
                >
                  <div
                    aria-label={`Fotografia ilustrativa de ${visit.place}`}
                    className="standalone-visit-row__photo"
                    role="img"
                    style={{
                      backgroundImage: `url(${
                        standaloneVisitImages[
                          visit.id
                        ] ??
                        fallbackVisitImage
                      })`,
                    }}
                  >
                    <span
                      className={`standalone-visit-row__icon standalone-visit-row__icon--${visit.visitKind}`}
                    >
                      {visit.visitKind ===
                      "day_trip" ? (
                        <Sun size={18} />
                      ) : (
                        <Moon size={18} />
                      )}
                    </span>
                  </div>

                  <div className="standalone-visit-row__place">
                    <div>
                      <strong>
                        {visit.place}
                      </strong>

                      <span>
                        {visit.placeType}
                      </span>

                      {visit.wantsToReturn && (
                        <span className="return-pill">
                          <Repeat2
                            size={11}
                          />
                          Quero voltar
                        </span>
                      )}
                    </div>

                    <p>
                      <MapPin size={13} />
                      {visit.municipality},{" "}
                      {visit.region} ·{" "}
                      {visit.country}
                    </p>

                    {visit.note && (
                      <small>
                        {visit.note}
                      </small>
                    )}
                  </div>

                  <div className="standalone-visit-row__metrics">
                    <div>
                      <strong>
                        {
                          visit.visitCount
                        }
                        ×
                      </strong>

                      <span>visitas</span>
                    </div>

                    <div>
                      <strong>
                        {visit.nights}
                      </strong>

                      <span>noites</span>
                    </div>
                  </div>

                  <div className="standalone-visit-row__period">
                    <strong>
                      {standaloneKindLabel(
                        visit.visitKind,
                      )}
                    </strong>

                    <span>
                      <CalendarDays
                        size={12}
                      />
                      {visit.period}
                    </span>

                    <small>
                      {
                        visit.createdAtLabel
                      }{" "}
                      · sem viagem vinculada
                    </small>
                  </div>

                  <button
                    className="add-return-button"
                    onClick={() =>
                      addOneStandaloneVisit(
                        visit.id,
                      )
                    }
                    type="button"
                  >
                    <Plus size={15} />
                    Somar 1 visita
                  </button>
                </article>
              ),
            )}
          </div>
        </section>

        <section
          className="travel-surface diary-preview"
          id="diario"
        >
          <div className="travel-card-toolbar">
            <div>
              <span className="travel-overline">
                <CalendarDays
                  size={14}
                />
                Aba 4 · Diário
              </span>

              <h2>
                Últimas histórias
                registradas.
              </h2>

              <p>
                Uma cidade pode aparecer
                em várias viagens sem
                perder o histórico.
              </p>
            </div>

            <button
              className="travel-outline-button"
              type="button"
            >
              Abrir diário completo

              <ArrowRight size={15} />
            </button>
          </div>

          <div className="timeline-list">
            <TimelineItem
              city="Fortaleza"
              date="Jul 2026"
              detail="7ª visita · 8 noites · 6 lugares registrados"
              icon={<Plane />}
            />

            <TimelineItem
              city="Lisboa"
              date="Mai 2026"
              detail="3ª visita · 9 noites · quer voltar"
              icon={<Repeat2 />}
            />

            <TimelineItem
              city="Paris + Lyon"
              date="Jan 2026"
              detail="Paris como base · 3 noites descontadas em Lyon"
              icon={<Route />}
            />
          </div>
        </section>
      </main>

      <nav
        aria-label="Seções do perfil"
        className="profile-app-dock"
      >
        {profileNavigation.map(
          ({
            id,
            label,
            href,
            icon: Icon,
          }) => (
            <a
              aria-current={
                activeSection === id
                  ? "page"
                  : undefined
              }
              className={
                activeSection === id
                  ? "is-active"
                  : ""
              }
              href={href}
              key={id}
              onClick={() =>
                setActiveSection(id)
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </a>
          ),
        )}
      </nav>

      <StandaloneVisitModal
        onClose={() =>
          setVisitModalOpen(false)
        }
        onSave={saveStandaloneVisit}
        open={visitModalOpen}
      />
    </div>
  );
}

function MiniStat({
  icon: Icon,
  label,
  value,
  detail,
  color,
}: {
  icon: typeof Star;
  label: string;
  value: string;
  detail: string;
  color: string;
}) {
  return (
    <article className="mini-stat">
      <div
        className={`mini-stat__icon mini-stat__icon--${color}`}
      >
        <Icon size={18} />
      </div>

      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </article>
  );
}

function ProfileChartCard({
  title,
  subtitle,
  icon,
  children,
  className = "",
}: {
  title: string;
  subtitle: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <article
      className={`travel-surface chart-card ${className}`}
    >
      <div className="chart-card__head">
        <div className="chart-card__icon">
          {icon}
        </div>

        <div>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
      </div>

      {children}
    </article>
  );
}

function Affinity({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="affinity">
      <div>
        <span>{label}</span>
        <strong>{value}%</strong>
      </div>

      <div className="affinity__track">
        <i
          style={{
            background: color,
            width: `${value}%`,
          }}
        />
      </div>
    </div>
  );
}

function TimelineItem({
  date,
  city,
  detail,
  icon,
}: {
  date: string;
  city: string;
  detail: string;
  icon: ReactNode;
}) {
  return (
    <article className="timeline-item">
      <span className="timeline-item__date">
        {date}
      </span>

      <div className="timeline-item__icon">
        {icon}
      </div>

      <div>
        <strong>{city}</strong>
        <span>{detail}</span>
      </div>

      <button
        aria-label={`Abrir ${city}`}
        type="button"
      >
        <ArrowRight size={16} />
      </button>
    </article>
  );
}