export type ChampionClass = 'Cosmic' | 'Tech' | 'Science' | 'Mystic' | 'Mutant' | 'Skill';
export type StarRating = 6 | 7;

export interface Champion {
  id: string;
  name: string;
  class: ChampionClass;
  starRating: StarRating;
  ranks: number[];
  imageUrl?: string;
}

export interface ChampionState {
  champions: Champion[];
  isLoading: boolean;
  error: string | null;
  addChampion: (champion: Omit<Champion, 'id'>) => Promise<void>;
  addChampionsBulk: (names: string[], championClass: ChampionClass, starRating: StarRating) => Promise<void>;
  deleteChampion: (id: string) => Promise<void>;
  deleteAllChampions: () => Promise<void>;
  updateChampion: (id: string, updates: Partial<Omit<Champion, 'id'>>) => Promise<void>;
  loadChampions: () => Promise<void>;
}