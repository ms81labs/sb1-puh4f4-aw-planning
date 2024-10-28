import { WarMapData } from '../db/db';

export interface WarSeason {
  id: string;
  name: string;
  isActive: boolean;
  startDate: string;
  endDate?: string;
  warMap: WarMapData;
}

export interface WarSeasonState {
  seasons: WarSeason[];
  activeSeason: WarSeason | null;
  isLoading: boolean;
  error: string | null;
  createSeason: (name: string) => Promise<void>;
  endSeason: (id: string) => Promise<void>;
  loadSeason: (id: string) => Promise<void>;
}