export type MapDifficulty = 'Challenger' | 'Expert' | 'Elite';
export type NodeType = 'normal' | 'boss';

export interface Node {
  id: string;
  number: number;
  type: NodeType;
}

export interface NodeTactic {
  id: string;
  nodeId: string;
  nodeNumber: number;
  tactic: string;
  notes?: string;
  difficulty: MapDifficulty;
}

export interface GlobalTactic {
  id: string;
  tactic: string;
  notes?: string;
  difficulty: MapDifficulty;
}

export interface ChampionBan {
  id: string;
  championId: string;
  mapDifficulty: MapDifficulty;
}

export interface WarMapState {
  globalTactics: Record<MapDifficulty, GlobalTactic | null>;
  nodeTactics: NodeTactic[];
  nodes: Node[];
  currentDifficulty: MapDifficulty;
  championBans: ChampionBan[];
  isLoading: boolean;
  error: string | null;
  setGlobalTactic: (difficulty: MapDifficulty, tactic: Omit<GlobalTactic, 'id' | 'difficulty'>) => Promise<void>;
  setNodeTactic: (difficulty: MapDifficulty, nodeNumber: number, tactic: Omit<NodeTactic, 'id' | 'nodeNumber' | 'nodeId' | 'difficulty'>) => Promise<void>;
  getNodeTactic: (difficulty: MapDifficulty, nodeNumber: number) => NodeTactic | undefined;
  getGlobalTactic: (difficulty: MapDifficulty) => GlobalTactic | null;
  setMapDifficulty: (difficulty: MapDifficulty) => Promise<void>;
  loadTactics: () => Promise<void>;
}