export type MapLayer = "visited" | "wishlist" | "community";
export type MapMetric = "bond" | "visits" | "days";

export type MapLocation = {
  id: string;
  city: string;
  country: string;
  x: number;
  y: number;
  visits: number;
  days: number;
  places: number;
  returnRate: number;
  localScore: number;
  lastActivity: string;
  color: string;
};

export type RankingLocation = {
  city: string;
  country: string;
  visits: number;
  wishes: number;
  returnRate: number;
  localScore: number;
};

export type StandaloneVisitKind = "day_trip" | "overnight" | "long_stay";

export type StandaloneVisitRecord = {
  id: string;
  place: string;
  placeType: "Cidade" | "Praia/localidade" | "Distrito/vila" | "Outro";
  municipality: string;
  region: string;
  country: string;
  visitCount: number;
  visitKind: StandaloneVisitKind;
  period: string;
  nights: number;
  wantsToReturn: boolean;
  note: string;
  createdAtLabel: string;
  tripId: null;
};

export type NewStandaloneVisit = Omit<
  StandaloneVisitRecord,
  "id" | "createdAtLabel"
>;
