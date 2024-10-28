import { create } from 'zustand';
import { MapDifficulty, NodeTactic, GlobalTactic, ChampionBan, Node, WarMapState } from '../types/warMap';

interface TacticsByDifficulty {
  Challenger: GlobalTactic | null;
  Expert: GlobalTactic | null;
  Elite: GlobalTactic | null;
}

interface NodeTacticsByDifficulty {
  Challenger: NodeTactic[];
  Expert: NodeTactic[];
  Elite: NodeTactic[];
}

const initialState = {
  globalTactics: {
    Challenger: null,
    Expert: null,
    Elite: null
  } as TacticsByDifficulty,
  nodeTactics: {
    Challenger: [],
    Expert: [],
    Elite: []
  } as NodeTacticsByDifficulty,
  nodes: Array.from({ length: 49 }, (_, i) => ({
    id: `NODE_${String(i + 1).padStart(3, '0')}`,
    number: i + 1,
    type: 'normal' as const
  })).concat([{
    id: 'NODE_BOSS',
    number: 50,
    type: 'boss' as const
  }]),
  currentDifficulty: 'Expert' as MapDifficulty,
  championBans: [],
  isLoading: false,
  error: null
};

export const useWarMapStore = create<WarMapState>((set, get) => ({
  ...initialState,

  loadTactics: async () => {
    set({ isLoading: true });
    try {
      const data = await fetch('/api/war-map').then(res => res.json());
      set({ 
        globalTactics: data.globalTactics || initialState.globalTactics,
        nodeTactics: data.nodeTactics || initialState.nodeTactics,
        nodes: data.nodes || initialState.nodes,
        currentDifficulty: data.currentDifficulty || initialState.currentDifficulty,
        championBans: data.championBans || [],
        isLoading: false 
      });
    } catch (error) {
      set({ error: 'Failed to load tactics', isLoading: false });
      throw error;
    }
  },

  setGlobalTactic: async (difficulty: MapDifficulty, tactic: Omit<GlobalTactic, 'id'>) => {
    set({ isLoading: true });
    try {
      const newGlobalTactic: GlobalTactic = {
        ...tactic,
        id: `GT_${crypto.randomUUID()}`
      };

      const currentTactics = get().globalTactics;
      const updatedTactics = {
        ...currentTactics,
        [difficulty]: newGlobalTactic
      };

      await fetch('/api/war-map/global-tactic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ difficulty, tactic: newGlobalTactic })
      });

      set({ 
        globalTactics: updatedTactics,
        isLoading: false 
      });
    } catch (error) {
      set({ error: 'Failed to set global tactic', isLoading: false });
      throw error;
    }
  },

  setNodeTactic: async (difficulty: MapDifficulty, nodeNumber: number, tactic: Omit<NodeTactic, 'id' | 'nodeNumber' | 'nodeId'>) => {
    set({ isLoading: true });
    try {
      const node = get().nodes.find(n => n.number === nodeNumber);
      if (!node) throw new Error('Node not found');

      const newNodeTactic: NodeTactic = {
        ...tactic,
        id: `NT_${crypto.randomUUID()}`,
        nodeId: node.id,
        nodeNumber
      };

      const currentTactics = get().nodeTactics[difficulty];
      const updatedTactics = {
        ...get().nodeTactics,
        [difficulty]: [
          ...currentTactics.filter(t => t.nodeNumber !== nodeNumber),
          newNodeTactic
        ]
      };

      await fetch('/api/war-map/node-tactic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ difficulty, tactic: newNodeTactic })
      });

      set({ 
        nodeTactics: updatedTactics,
        isLoading: false 
      });
    } catch (error) {
      set({ error: 'Failed to set node tactic', isLoading: false });
      throw error;
    }
  },

  setMapDifficulty: async (difficulty: MapDifficulty) => {
    set({ isLoading: true });
    try {
      await fetch('/api/war-map/difficulty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ difficulty })
      });
      set({ currentDifficulty: difficulty, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to set map difficulty', isLoading: false });
      throw error;
    }
  },

  addChampionBan: async (championId: string) => {
    set({ isLoading: true });
    try {
      const newBan: ChampionBan = {
        id: `BAN_${crypto.randomUUID()}`,
        championId,
        mapDifficulty: get().currentDifficulty
      };

      await fetch('/api/war-map/champion-ban', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBan)
      });

      set(state => ({
        championBans: [...state.championBans, newBan],
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to add champion ban', isLoading: false });
      throw error;
    }
  },

  removeChampionBan: async (banId: string) => {
    set({ isLoading: true });
    try {
      await fetch(`/api/war-map/champion-ban/${banId}`, {
        method: 'DELETE'
      });

      set(state => ({
        championBans: state.championBans.filter(ban => ban.id !== banId),
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to remove champion ban', isLoading: false });
      throw error;
    }
  },

  getGlobalTactic: (difficulty: MapDifficulty) => {
    return get().globalTactics[difficulty];
  },

  getNodeTactic: (difficulty: MapDifficulty, nodeNumber: number) => {
    return get().nodeTactics[difficulty].find(t => t.nodeNumber === nodeNumber);
  }
}));