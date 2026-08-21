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
