"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart,
  Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import {
  ArrowRight, Bookmark, CalendarDays, ChevronDown, CircleDollarSign, Compass,
  Flame, Globe2, Heart, MapPin, Repeat2, Sparkles, TrendingUp, UsersRound,
} from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { ScratchWorldMap } from "@/components/ScratchWorldMap";
import {
  communityPopular, communityTrend, communityWishlist, rankingLocations, seasonality,
} from "@/data/demo";
import type { MapLayer, MapLocation } from "@/types/travel";

const topCities = rankingLocations.map((item) => ({ city: item.city, visitas: item.visits, desejos: item.wishes }));
const originData = [
  { name: "Moradores", value: 38, color: "#2563eb" },
  { name: "Viajantes recorrentes", value: 34, color: "#10b981" },
  { name: "Primeira visita", value: 28, color: "#f59e0b" },
];

const mapModes: { id: MapLayer; label: string }[] = [
  { id: "community", label: "Mais visitados" },
  { id: "wishlist", label: "Mais desejados" },
  { id: "visited", label: "Mais retornos" },
];

export function GeneralDashboard() {
  const [mapMode, setMapMode] = useState<MapLayer>("community");
  const mapLocations = useMemo(() => mapMode === "wishlist" ? communityWishlist : communityPopular, [mapMode]);
  const [selected, setSelected] = useState<MapLocation>(communityPopular[1]);

  function changeMapMode(mode: MapLayer) {
    const locations = mode === "wishlist" ? communityWishlist : communityPopular;
    setMapMode(mode);
    setSelected(locations[0]);
  }

  return (
    <div className="app-shell">
      <AppHeader />
      <main className="page-container">
        <section className="page-hero page-hero--general">
          <div>
            <span className="overline"><Globe2 size={15} /> Painel da comunidade</span>
            <h1>O mundo visto por quem realmente viaja.</h1>
            <p>Compare desejos, visitas, retornos e escolhas dos moradores para decidir com mais contexto.</p>
          </div>
          <div className="page-hero__actions">
            <button className="filter-button" type="button"><CalendarDays size={16} /> Últimos 30 dias <ChevronDown size={15} /></button>
            <Link className="primary-button" href="/perfil"><MapPin size={17} /> Abrir meu mapa</Link>
          </div>
        </section>

        <section className="stats-grid" aria-label="Indicadores gerais da comunidade">
          <StatCard icon={UsersRound} label="Viajantes ativos" value="48.290" trend="+12,4%" color="blue" />
          <StatCard icon={MapPin} label="Cidades registradas" value="6.814" trend="+326" color="violet" />
          <StatCard icon={Repeat2} label="Retornos registrados" value="31.760" trend="46% voltaram" color="green" />
          <StatCard icon={Bookmark} label="Lugares desejados" value="284 mil" trend="+18,7%" color="amber" />
        </section>

        <section className="dashboard-card map-dashboard-card">
          <div className="card-toolbar">
            <div>
              <span className="card-eyebrow">Mapa vivo da rede</span>
              <h2>O que está sendo revelado agora</h2>
              <p>Somente registros públicos e agregados.</p>
            </div>
            <div className="segmented-control" aria-label="Visualização do mapa geral">
              {mapModes.map((mode) => (
                <button className={mapMode === mode.id ? "is-active" : ""} key={mode.id} onClick={() => changeMapMode(mode.id)} type="button">
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          <div className="map-dashboard-grid">
            <ScratchWorldMap
              layer={mapMode}
              locations={mapLocations}
              metric={mapMode === "visited" ? "bond" : "visits"}
              onSelect={setSelected}
              selectedId={selected.id}
              summary={`${mapLocations.length} destaques · dados agregados`}
            />
            <aside className="map-detail-panel">
              <div className="map-detail-panel__head">
                <span className="location-rank">#{Math.max(1, mapLocations.findIndex((item) => item.id === selected.id) + 1)}</span>
                <button type="button" aria-label="Salvar destino"><Heart size={18} /></button>
              </div>
              <span className="panel-country">{selected.country}</span>
              <h3>{selected.city}</h3>
              <p className="panel-update"><TrendingUp size={14} /> {selected.lastActivity}</p>

              <div className="panel-metrics">
                <div><strong>{selected.visits.toLocaleString("pt-BR")}</strong><span>{mapMode === "wishlist" ? "desejos" : "visitas públicas"}</span></div>
                <div><strong>{selected.returnRate}%</strong><span>taxa de retorno</span></div>
                <div><strong>{selected.localScore}%</strong><span>aprovação local</span></div>
              </div>

              <div className="local-signal">
                <Sparkles size={17} />
                <div><strong>Escolha dos moradores</strong><span>{selected.localScore >= 85 ? "Forte presença de recomendações locais." : "Combine avaliações locais e de viajantes."}</span></div>
              </div>
              <button className="panel-link" type="button">Explorar a cidade <ArrowRight size={16} /></button>
            </aside>
          </div>
        </section>

        <section className="section-heading" id="descobrir">
          <div><span className="overline"><TrendingUp size={14} /> Tendências</span><h2>Dados para comparar antes de escolher</h2></div>
          <button className="filter-button" type="button">Todos os continentes <ChevronDown size={15} /></button>
        </section>

        <section className="analytics-grid analytics-grid--community">
          <ChartCard className="chart-card--wide" title="Interesse da comunidade" subtitle="Índice mensal de visitas e desejos" icon={<TrendingUp size={17} />}>
            <ResponsiveContainer width="100%" height={285}>
              <LineChart data={communityTrend} margin={{ top: 15, right: 18, left: -18, bottom: 0 }}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 10 }} />
                <Tooltip contentStyle={{ borderRadius: 12, borderColor: "#e2e8f0", boxShadow: "0 12px 30px rgba(15,23,42,.12)" }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="visits" name="Visitas" stroke="#2563eb" strokeWidth={3} dot={{ r: 3, fill: "#2563eb" }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="wishes" name="Desejos" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 3, fill: "#8b5cf6" }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Quem recomenda" subtitle="Origem das experiências públicas" icon={<UsersRound size={17} />}>
            <div className="donut-wrap">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={originData} dataKey="value" innerRadius={56} outerRadius={82} paddingAngle={4}>
                    {originData.map((item) => <Cell fill={item.color} key={item.name} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, borderColor: "#e2e8f0" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="donut-center"><strong>38%</strong><span>moradores</span></div>
            </div>
            <div className="chart-legend">
              {originData.map((item) => <span key={item.name}><i style={{ background: item.color }} />{item.name}<strong>{item.value}%</strong></span>)}
            </div>
          </ChartCard>

          <ChartCard title="Cidades mais disputadas" subtitle="Visitas públicas x listas de desejos" icon={<Flame size={17} />}>
            <ResponsiveContainer width="100%" height={290}>
              <BarChart data={topCities} layout="vertical" margin={{ top: 4, right: 12, left: 16, bottom: 0 }}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="city" axisLine={false} tickLine={false} tick={{ fill: "#334155", fontSize: 11 }} width={64} />
                <Tooltip contentStyle={{ borderRadius: 12, borderColor: "#e2e8f0" }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="visitas" name="Visitas" fill="#2563eb" radius={[0, 5, 5, 0]} />
                <Bar dataKey="desejos" name="Desejos" fill="#c4b5fd" radius={[0, 5, 5, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard className="chart-card--wide" title="Sazonalidade por interesse" subtitle="Quando cada tipo de lugar aparece mais nas viagens" icon={<CalendarDays size={17} />}>
            <ResponsiveContainer width="100%" height={285}>
              <AreaChart data={seasonality} margin={{ top: 12, right: 18, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="beachArea" x1="0" x2="0" y1="0" y2="1"><stop offset="5%" stopColor="#0ea5e9" stopOpacity=".34" /><stop offset="95%" stopColor="#0ea5e9" stopOpacity="0" /></linearGradient>
                  <linearGradient id="cultureArea" x1="0" x2="0" y1="0" y2="1"><stop offset="5%" stopColor="#8b5cf6" stopOpacity=".28" /><stop offset="95%" stopColor="#8b5cf6" stopOpacity="0" /></linearGradient>
                  <linearGradient id="natureArea" x1="0" x2="0" y1="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity=".26" /><stop offset="95%" stopColor="#10b981" stopOpacity="0" /></linearGradient>
                </defs>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 10 }} />
                <Tooltip contentStyle={{ borderRadius: 12, borderColor: "#e2e8f0" }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="praia" name="Praias" stroke="#0ea5e9" strokeWidth={2} fill="url(#beachArea)" />
                <Area type="monotone" dataKey="cultura" name="Cultura" stroke="#8b5cf6" strokeWidth={2} fill="url(#cultureArea)" />
                <Area type="monotone" dataKey="natureza" name="Natureza" stroke="#10b981" strokeWidth={2} fill="url(#natureArea)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </section>

        <section className="dashboard-card ranking-card">
          <div className="card-toolbar">
            <div><span className="card-eyebrow">Leitura rápida</span><h2>Ranking com contexto</h2><p>Popularidade, desejo, retorno e aprovação local no mesmo lugar.</p></div>
            <button className="filter-button" type="button">Ver ranking completo <ArrowRight size={15} /></button>
          </div>
          <div className="ranking-table" role="table" aria-label="Ranking geral de destinos">
            <div className="ranking-row ranking-row--head" role="row"><span>Destino</span><span>Visitas</span><span>Desejos</span><span>Retorno</span><span>Moradores</span></div>
            {rankingLocations.map((location, index) => (
              <div className="ranking-row" role="row" key={location.city}>
                <span className="ranking-destination"><i>{index + 1}</i><span><strong>{location.city}</strong><small>{location.country}</small></span></span>
                <span>{location.visits.toLocaleString("pt-BR")}</span>
                <span>{location.wishes.toLocaleString("pt-BR")}</span>
                <span><b className="positive-pill"><Repeat2 size={12} />{location.returnRate}%</b></span>
                <span><b className="local-pill">{location.localScore}%</b></span>
              </div>
            ))}
          </div>
        </section>

        <section className="recommendations-section">
          <div className="section-heading">
            <div><span className="overline"><Compass size={14} /> Descobrir</span><h2>Não apenas o que todo turista faz</h2></div>
            <button className="filter-button" type="button">Ajustar preferências <ArrowRight size={15} /></button>
          </div>
          <div className="recommendation-grid">
            <RecommendationCard tag="Escolha dos locais" title="Mercados e cozinhas de bairro" description="Recomendações com alta frequência entre moradores, sem contar compras cotidianas no ranking." icon={<UsersRound />} tone="blue" />
            <RecommendationCard tag="Combina com você" title="Museus, história e jardins" description="Sugestões cruzadas com o perfil de interesse e os lugares já salvos." icon={<Sparkles />} tone="violet" />
            <RecommendationCard tag="Planejamento real" title="Custo médio por categoria" description="Hospedagem, alimentação, passeios e compras sem rotular toda a cidade como cara ou barata." icon={<CircleDollarSign />} tone="green" />
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, trend, color }: { icon: typeof MapPin; label: string; value: string; trend: string; color: string }) {
  return (
    <article className="stat-card">
      <div className={`stat-card__icon stat-card__icon--${color}`}><Icon size={19} /></div>
      <div><span>{label}</span><strong>{value}</strong><small>{trend}</small></div>
    </article>
  );
}

function ChartCard({ title, subtitle, icon, children, className = "" }: { title: string; subtitle: string; icon: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <article className={`dashboard-card chart-card ${className}`}>
      <div className="chart-card__head"><div className="chart-card__icon">{icon}</div><div><h3>{title}</h3><p>{subtitle}</p></div></div>
      {children}
    </article>
  );
}

function RecommendationCard({ tag, title, description, icon, tone }: { tag: string; title: string; description: string; icon: React.ReactNode; tone: string }) {
  return (
    <article className={`recommendation-card recommendation-card--${tone}`}>
      <div className="recommendation-card__icon">{icon}</div>
      <span>{tag}</span><h3>{title}</h3><p>{description}</p>
      <button type="button">Explorar <ArrowRight size={15} /></button>
    </article>
  );
}
