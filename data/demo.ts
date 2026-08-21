import type { MapLocation, RankingLocation } from "@/types/travel";

export const personalVisited: MapLocation[] = [
  { id: "fortaleza", city: "Fortaleza", country: "Brasil", x: 351, y: 317, visits: 7, days: 46, places: 18, returnRate: 86, localScore: 91, lastActivity: "Julho de 2026", color: "#22c55e" },
  { id: "lisboa", city: "Lisboa", country: "Portugal", x: 485, y: 194, visits: 3, days: 19, places: 12, returnRate: 67, localScore: 88, lastActivity: "Maio de 2026", color: "#3b82f6" },
  { id: "paris", city: "Paris", country: "França", x: 507, y: 170, visits: 4, days: 24, places: 21, returnRate: 75, localScore: 74, lastActivity: "Janeiro de 2026", color: "#a855f7" },
  { id: "lyon", city: "Lyon", country: "França", x: 519, y: 186, visits: 2, days: 3, places: 7, returnRate: 50, localScore: 82, lastActivity: "Janeiro de 2026", color: "#f97316" },
  { id: "buenos-aires", city: "Buenos Aires", country: "Argentina", x: 318, y: 414, visits: 2, days: 11, places: 9, returnRate: 50, localScore: 79, lastActivity: "Outubro de 2025", color: "#06b6d4" },
  { id: "nova-york", city: "Nova York", country: "Estados Unidos", x: 259, y: 188, visits: 1, days: 8, places: 14, returnRate: 0, localScore: 69, lastActivity: "Abril de 2025", color: "#ec4899" },
  { id: "rio", city: "Rio de Janeiro", country: "Brasil", x: 342, y: 367, visits: 2, days: 9, places: 13, returnRate: 50, localScore: 84, lastActivity: "Fevereiro de 2025", color: "#eab308" },
];

export const personalWishlist: MapLocation[] = [
  { id: "toquio", city: "Tóquio", country: "Japão", x: 856, y: 216, visits: 0, days: 0, places: 24, returnRate: 0, localScore: 93, lastActivity: "24 lugares salvos", color: "#f43f5e" },
  { id: "reykjavik", city: "Reykjavík", country: "Islândia", x: 458, y: 113, visits: 0, days: 0, places: 11, returnRate: 0, localScore: 89, lastActivity: "Preferência: setembro", color: "#38bdf8" },
  { id: "cidade-do-cabo", city: "Cidade do Cabo", country: "África do Sul", x: 565, y: 416, visits: 0, days: 0, places: 16, returnRate: 0, localScore: 87, lastActivity: "Período indefinido", color: "#14b8a6" },
  { id: "roma", city: "Roma", country: "Itália", x: 537, y: 205, visits: 0, days: 0, places: 19, returnRate: 0, localScore: 86, lastActivity: "Preferência: primavera", color: "#fb923c" },
  { id: "cusco", city: "Cusco", country: "Peru", x: 294, y: 339, visits: 0, days: 0, places: 8, returnRate: 0, localScore: 92, lastActivity: "8 lugares salvos", color: "#8b5cf6" },
];

export const communityPopular: MapLocation[] = [
  { id: "community-paris", city: "Paris", country: "França", x: 507, y: 170, visits: 18340, days: 72900, places: 324, returnRate: 42, localScore: 74, lastActivity: "+18% nos últimos 30 dias", color: "#8b5cf6" },
  { id: "community-toquio", city: "Tóquio", country: "Japão", x: 856, y: 216, visits: 15980, days: 61800, places: 411, returnRate: 38, localScore: 93, lastActivity: "+27% nos últimos 30 dias", color: "#f43f5e" },
  { id: "community-nova-york", city: "Nova York", country: "Estados Unidos", x: 259, y: 188, visits: 17620, days: 64900, places: 387, returnRate: 46, localScore: 69, lastActivity: "+11% nos últimos 30 dias", color: "#3b82f6" },
  { id: "community-roma", city: "Roma", country: "Itália", x: 537, y: 205, visits: 13420, days: 48600, places: 305, returnRate: 35, localScore: 86, lastActivity: "+14% nos últimos 30 dias", color: "#f97316" },
  { id: "community-lisboa", city: "Lisboa", country: "Portugal", x: 485, y: 194, visits: 12890, days: 50200, places: 292, returnRate: 51, localScore: 88, lastActivity: "+22% nos últimos 30 dias", color: "#22c55e" },
  { id: "community-fortaleza", city: "Fortaleza", country: "Brasil", x: 351, y: 317, visits: 9640, days: 35800, places: 218, returnRate: 54, localScore: 91, lastActivity: "+31% nos últimos 30 dias", color: "#06b6d4" },
  { id: "community-cape", city: "Cidade do Cabo", country: "África do Sul", x: 565, y: 416, visits: 6820, days: 27100, places: 176, returnRate: 29, localScore: 87, lastActivity: "+19% nos últimos 30 dias", color: "#eab308" },
];

export const communityWishlist: MapLocation[] = [
  { ...communityPopular[1], id: "wish-toquio", visits: 28600, lastActivity: "Destino mais salvo da rede" },
  { ...personalWishlist[1], id: "wish-reykjavik", visits: 21400, places: 1880, lastActivity: "Pico de desejo em setembro" },
  { ...personalWishlist[2], id: "wish-cape", visits: 19800, places: 1530, lastActivity: "Alta entre viajantes de natureza" },
  { ...communityPopular[3], id: "wish-roma", visits: 17600, lastActivity: "Primavera é o período preferido" },
  { ...personalWishlist[4], id: "wish-cusco", visits: 14900, places: 1100, lastActivity: "Muito desejada e menos visitada" },
];

export const rankingLocations: RankingLocation[] = [
  { city: "Tóquio", country: "Japão", visits: 15980, wishes: 28600, returnRate: 38, localScore: 93 },
  { city: "Paris", country: "França", visits: 18340, wishes: 24110, returnRate: 42, localScore: 74 },
  { city: "Lisboa", country: "Portugal", visits: 12890, wishes: 16840, returnRate: 51, localScore: 88 },
  { city: "Fortaleza", country: "Brasil", visits: 9640, wishes: 12100, returnRate: 54, localScore: 91 },
  { city: "Roma", country: "Itália", visits: 13420, wishes: 17600, returnRate: 35, localScore: 86 },
];

export const communityTrend = [
  { month: "Set", visits: 42, wishes: 58 }, { month: "Out", visits: 48, wishes: 63 },
  { month: "Nov", visits: 51, wishes: 68 }, { month: "Dez", visits: 66, wishes: 75 },
  { month: "Jan", visits: 72, wishes: 82 }, { month: "Fev", visits: 61, wishes: 78 },
  { month: "Mar", visits: 69, wishes: 86 }, { month: "Abr", visits: 76, wishes: 89 },
  { month: "Mai", visits: 84, wishes: 96 }, { month: "Jun", visits: 89, wishes: 103 },
  { month: "Jul", visits: 108, wishes: 116 }, { month: "Ago", visits: 101, wishes: 121 },
];

export const seasonality = [
  { month: "Jan", praia: 92, cultura: 63, natureza: 58 }, { month: "Fev", praia: 88, cultura: 57, natureza: 61 },
  { month: "Mar", praia: 70, cultura: 68, natureza: 67 }, { month: "Abr", praia: 56, cultura: 76, natureza: 75 },
  { month: "Mai", praia: 48, cultura: 81, natureza: 83 }, { month: "Jun", praia: 44, cultura: 86, natureza: 72 },
  { month: "Jul", praia: 61, cultura: 91, natureza: 79 }, { month: "Ago", praia: 64, cultura: 85, natureza: 88 },
  { month: "Set", praia: 66, cultura: 80, natureza: 94 }, { month: "Out", praia: 75, cultura: 74, natureza: 89 },
  { month: "Nov", praia: 83, cultura: 69, natureza: 76 }, { month: "Dez", praia: 96, cultura: 65, natureza: 63 },
];

export const personalTripsByYear = [
  { year: "2022", trips: 2 }, { year: "2023", trips: 4 }, { year: "2024", trips: 5 },
  { year: "2025", trips: 7 }, { year: "2026", trips: 6 },
];

export const personalMonthly = [
  { month: "Jan", trips: 2, nights: 27 }, { month: "Fev", trips: 1, nights: 9 },
  { month: "Mar", trips: 0, nights: 0 }, { month: "Abr", trips: 1, nights: 8 },
  { month: "Mai", trips: 2, nights: 19 }, { month: "Jun", trips: 0, nights: 0 },
  { month: "Jul", trips: 3, nights: 21 }, { month: "Ago", trips: 1, nights: 5 },
  { month: "Set", trips: 0, nights: 0 }, { month: "Out", trips: 2, nights: 11 },
  { month: "Nov", trips: 1, nights: 4 }, { month: "Dez", trips: 2, nights: 12 },
];

export const personalTopCities = [
  { city: "Fortaleza", visits: 7, nights: 46 }, { city: "Paris", visits: 4, nights: 24 },
  { city: "Lisboa", visits: 3, nights: 19 }, { city: "Lyon", visits: 2, nights: 3 },
  { city: "Buenos Aires", visits: 2, nights: 11 }, { city: "Rio de Janeiro", visits: 2, nights: 9 },
];

export const expenseData = [
  { name: "Hospedagem", value: 35, color: "#3b82f6" },
  { name: "Alimentação", value: 28, color: "#10b981" },
  { name: "Passeios", value: 21, color: "#f59e0b" },
  { name: "Compras", value: 10, color: "#8b5cf6" },
  { name: "Outros", value: 6, color: "#94a3b8" },
];
