"use client";

import { useMemo, useState } from "react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart,
  Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import {
  ArrowRight, BadgeDollarSign, Bookmark, CalendarDays, Camera, ChevronDown, Clock3,
  Heart, MapPin, Plane, Plus, Repeat2, Route, Sparkles, Star, TrendingUp,
  Trophy, UserRound,
} from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { ScratchWorldMap } from "@/components/ScratchWorldMap";
import {
  expenseData, personalMonthly, personalTopCities, personalTripsByYear,
  personalVisited, personalWishlist,
} from "@/data/demo";
import type { MapLayer, MapLocation, MapMetric } from "@/types/travel";

const personalLayers: { id: MapLayer; label: string }[] = [
  { id: "visited", label: "Visitadas" },
  { id: "wishlist", label: "Quero visitar" },
];

const metricLabels: { id: MapMetric; label: string }[] = [
  { id: "bond", label: "Vínculo" },
  { id: "visits", label: "Quantidade de visitas" },
  { id: "days", label: "Noites efetivas" },
];

export function ProfileDashboard() {
  const [layer, setLayer] = useState<MapLayer>("visited");
  const [metric, setMetric] = useState<MapMetric>("bond");
  const locations = useMemo(() => layer === "wishlist" ? personalWishlist : personalVisited, [layer]);
  const [selected, setSelected] = useState<MapLocation>(personalVisited[0]);

  function changeLayer(nextLayer: MapLayer) {
    const nextLocations = nextLayer === "wishlist" ? personalWishlist : personalVisited;
    setLayer(nextLayer);
    setSelected(nextLocations[0]);
  }

  return (
    <div className="app-shell">
      <AppHeader />
      <main className="page-container">
        <section className="profile-hero">
          <div className="profile-hero__identity">
            <div className="profile-hero__avatar">VS<span><Camera size={13} /></span></div>
            <div><span className="overline"><UserRound size={14} /> Perfil pessoal</span><h1>Vanessa Sousa</h1><p>Fortaleza, Brasil · viajando desde 2022</p></div>
          </div>
          <div className="profile-hero__stats">
            <div><strong>24</strong><span>cidades</span></div><i />
            <div><strong>9</strong><span>países</span></div><i />
            <div><strong>12</strong><span>viagens</span></div><i />
            <div><strong>115</strong><span>noites</span></div>
          </div>
          <button className="primary-button" type="button"><Plus size={17} /> Registrar viagem</button>
        </section>

        <section className="dashboard-card map-dashboard-card profile-map-card">
          <div className="card-toolbar">
            <div><span className="card-eyebrow">Seu mapa raspadinha digital</span><h2>Cada cidade revela uma parte da sua história</h2><p>A intensidade é comparada apenas com as suas próprias viagens.</p></div>
            <div className="map-filters">
              <div className="segmented-control">
                {personalLayers.map((item) => <button className={layer === item.id ? "is-active" : ""} key={item.id} onClick={() => changeLayer(item.id)} type="button">{item.label}</button>)}
              </div>
              <label className="select-control"><span>Intensidade</span><select value={metric} onChange={(event) => setMetric(event.target.value as MapMetric)} disabled={layer === "wishlist"}>{metricLabels.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select><ChevronDown size={14} /></label>
            </div>
          </div>

          <div className="map-dashboard-grid">
            <ScratchWorldMap
              layer={layer}
              locations={locations}
              metric={metric}
              onSelect={setSelected}
              selectedId={selected.id}
              summary={layer === "visited" ? "7 cidades reveladas · 5 retornos" : "5 cidades · 78 lugares salvos"}
            />
            <aside className="map-detail-panel map-detail-panel--personal">
              <div className="map-detail-panel__head">
                <span className={layer === "visited" ? "status-badge status-badge--visited" : "status-badge status-badge--wishlist"}>{layer === "visited" ? "Já visitei" : "Quero visitar"}</span>
                <button type="button" aria-label="Favoritar cidade"><Heart size={18} /></button>
              </div>
              <span className="panel-country">{selected.country}</span><h3>{selected.city}</h3><p className="panel-update"><CalendarDays size={14} /> {selected.lastActivity}</p>
              {layer === "visited" ? (
                <div className="panel-metrics"><div><strong>{selected.visits}</strong><span>visitas</span></div><div><strong>{selected.days}</strong><span>noites efetivas</span></div><div><strong>{selected.places}</strong><span>lugares</span></div></div>
              ) : (
                <div className="panel-metrics"><div><strong>{selected.places}</strong><span>lugares salvos</span></div><div><strong>—</strong><span>data definida</span></div><div><strong>{selected.localScore}%</strong><span>aprovação local</span></div></div>
              )}
              <div className="calculation-note"><Clock3 size={17} /><div><strong>{layer === "visited" ? "Tempo corrigido" : "Lista independente"}</strong><span>{layer === "visited" ? "Deslocamentos para outras cidades são descontados da cidade-base." : "Você não precisa criar uma viagem para organizar estes lugares."}</span></div></div>
              <button className="panel-link" type="button">{layer === "visited" ? "Abrir diário da cidade" : "Abrir lista de lugares"}<ArrowRight size={16} /></button>
            </aside>
          </div>
        </section>

        <section className="profile-summary-grid">
          <article className="goal-card">
            <div className="goal-card__head"><div><span>Meta de 2026</span><strong>6 de 8 viagens</strong></div><Trophy size={25} /></div>
            <div className="goal-progress"><i style={{ width: "75%" }} /></div><small>75% concluído · faltam 2 viagens</small>
          </article>
          <MiniStat icon={Repeat2} label="Cidade com mais retornos" value="Fortaleza" detail="7 visitas registradas" color="green" />
          <MiniStat icon={Clock3} label="Média por viagem" value="9,6 noites" detail="tempo efetivo calculado" color="blue" />
          <MiniStat icon={Bookmark} label="Na lista de desejos" value="78 lugares" detail="em 5 cidades" color="violet" />
        </section>

        <section className="section-heading">
          <div><span className="overline"><TrendingUp size={14} /> Seu comportamento</span><h2>O que suas viagens contam sobre você</h2></div>
          <button className="filter-button" type="button">2026 <ChevronDown size={15} /></button>
        </section>

        <section className="analytics-grid profile-analytics">
          <ProfileChartCard title="Viagens por ano" subtitle="Evolução do seu histórico" icon={<CalendarDays size={17} />}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={personalTripsByYear} margin={{ top: 12, right: 10, left: -24, bottom: 0 }}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 11 }} />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 10 }} />
                <Tooltip contentStyle={{ borderRadius: 12, borderColor: "#e2e8f0" }} />
                <Bar dataKey="trips" name="Viagens" fill="#2563eb" radius={[7, 7, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ProfileChartCard>

          <ProfileChartCard className="chart-card--wide" title="Ritmo durante o ano" subtitle="Viagens e noites efetivas por mês" icon={<Route size={17} />}>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={personalMonthly} margin={{ top: 12, right: 18, left: -18, bottom: 0 }}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 10 }} />
                <Tooltip contentStyle={{ borderRadius: 12, borderColor: "#e2e8f0" }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="trips" name="Viagens" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="nights" name="Noites efetivas" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </ProfileChartCard>

          <ProfileChartCard className="chart-card--wide" title="Tempo efetivo por mês" subtitle="Cidades-base não recebem os dias passados em outros destinos" icon={<Clock3 size={17} />}>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={personalMonthly} margin={{ top: 12, right: 18, left: -18, bottom: 0 }}>
                <defs><linearGradient id="nightsArea" x1="0" x2="0" y1="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity=".36" /><stop offset="95%" stopColor="#10b981" stopOpacity="0" /></linearGradient></defs>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 10 }} />
                <Tooltip contentStyle={{ borderRadius: 12, borderColor: "#e2e8f0" }} />
                <Area type="monotone" dataKey="nights" name="Noites" stroke="#10b981" strokeWidth={3} fill="url(#nightsArea)" />
              </AreaChart>
            </ResponsiveContainer>
          </ProfileChartCard>

          <ProfileChartCard title="Cidades mais revisitadas" subtitle="Visitas e noites acumuladas" icon={<MapPin size={17} />}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={personalTopCities} layout="vertical" margin={{ top: 2, right: 12, left: 26, bottom: 0 }}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="4 4" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="city" width={82} axisLine={false} tickLine={false} tick={{ fill: "#334155", fontSize: 10 }} />
                <Tooltip contentStyle={{ borderRadius: 12, borderColor: "#e2e8f0" }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="visits" name="Visitas" fill="#2563eb" radius={[0, 5, 5, 0]} />
                <Bar dataKey="nights" name="Noites" fill="#a7f3d0" radius={[0, 5, 5, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ProfileChartCard>

          <ProfileChartCard title="Média de gastos" subtitle="Distribuição opcional e privada" icon={<BadgeDollarSign size={17} />}>
            <div className="expense-chart-wrap">
              <ResponsiveContainer width="100%" height={210}>
                <PieChart>
                  <Pie data={expenseData} dataKey="value" innerRadius={57} outerRadius={84} paddingAngle={3}>
                    {expenseData.map((item) => <Cell fill={item.color} key={item.name} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, borderColor: "#e2e8f0" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="expense-chart-center"><strong>R$ 3.240</strong><span>por viagem</span></div>
            </div>
            <div className="chart-legend chart-legend--expenses">
              {expenseData.map((item) => <span key={item.name}><i style={{ background: item.color }} />{item.name}<strong>{item.value}%</strong></span>)}
            </div>
          </ProfileChartCard>

          <ProfileChartCard title="Seu perfil de interesse" subtitle="Usado para refinar sugestões" icon={<Sparkles size={17} />}>
            <div className="affinity-list">
              <Affinity label="História e cultura" value={86} color="#8b5cf6" />
              <Affinity label="Gastronomia local" value={72} color="#f59e0b" />
              <Affinity label="Natureza e jardins" value={61} color="#10b981" />
              <Affinity label="Praias" value={48} color="#0ea5e9" />
            </div>
            <button className="suggestion-banner" type="button"><Sparkles size={18} /><span><strong>12 sugestões compatíveis</strong><small>Baseadas em viagens e desejos</small></span><ArrowRight size={16} /></button>
          </ProfileChartCard>
        </section>

        <section className="dashboard-card diary-preview" id="diario">
          <div className="card-toolbar"><div><span className="card-eyebrow">Linha do tempo</span><h2>Últimas histórias registradas</h2><p>Uma cidade pode aparecer em várias viagens sem perder o histórico.</p></div><button className="filter-button" type="button">Abrir diário completo <ArrowRight size={15} /></button></div>
          <div className="timeline-list">
            <TimelineItem date="Jul 2026" city="Fortaleza" detail="7ª visita · 8 noites · 6 lugares registrados" icon={<Plane />} />
            <TimelineItem date="Mai 2026" city="Lisboa" detail="3ª visita · 9 noites · quer voltar" icon={<Repeat2 />} />
            <TimelineItem date="Jan 2026" city="Paris + Lyon" detail="Paris como base · 3 noites descontadas em Lyon" icon={<Route />} />
          </div>
        </section>
      </main>
    </div>
  );
}

function MiniStat({ icon: Icon, label, value, detail, color }: { icon: typeof Star; label: string; value: string; detail: string; color: string }) {
  return <article className="mini-stat"><div className={`mini-stat__icon mini-stat__icon--${color}`}><Icon size={18} /></div><span>{label}</span><strong>{value}</strong><small>{detail}</small></article>;
}

function ProfileChartCard({ title, subtitle, icon, children, className = "" }: { title: string; subtitle: string; icon: React.ReactNode; children: React.ReactNode; className?: string }) {
  return <article className={`dashboard-card chart-card ${className}`}><div className="chart-card__head"><div className="chart-card__icon">{icon}</div><div><h3>{title}</h3><p>{subtitle}</p></div></div>{children}</article>;
}

function Affinity({ label, value, color }: { label: string; value: number; color: string }) {
  return <div className="affinity"><div><span>{label}</span><strong>{value}%</strong></div><div className="affinity__track"><i style={{ width: `${value}%`, background: color }} /></div></div>;
}

function TimelineItem({ date, city, detail, icon }: { date: string; city: string; detail: string; icon: React.ReactNode }) {
  return <article className="timeline-item"><span className="timeline-item__date">{date}</span><div className="timeline-item__icon">{icon}</div><div><strong>{city}</strong><span>{detail}</span></div><button type="button" aria-label={`Abrir ${city}`}><ArrowRight size={16} /></button></article>;
}
