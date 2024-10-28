import { create } from 'zustand';
import { Champion, ChampionClass, ChampionState, StarRating } from '../types/champion';
import { dbOperations } from '../db/db';

const getDefaultRanks = (starRating: StarRating): number[] => {
  return starRating === 6 ? [4, 5, 6] : [1, 2, 3];
};

export const useChampionStore = create<ChampionState>((set) => ({
  champions: [],
  isLoading: false,
  error: null,

  loadChampions: async () => {
    set({ isLoading: true });
    try {
      const db = await dbOperations.loadDb();
      const adminUser = db.users.find(u => u.role === 'admin');
      if (!adminUser) throw new Error('Admin user not found');

      set({ 
        champions: adminUser.data.champions,
        isLoading: false,
        error: null
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load champions',
        isLoading: false 
      });
    }
  },

  addChampion: async (champion) => {
    set({ isLoading: true });
    try {
      const db = await dbOperations.loadDb();
      const adminUser = db.users.find(u => u.role === 'admin');
      if (!adminUser) throw new Error('Admin user not found');

      const newChampion: Champion = {
        id: `CHAMP_${crypto.randomUUID()}`,
        ...champion,
        ranks: champion.ranks || getDefaultRanks(champion.starRating),
      };
      
      adminUser.data.champions.push(newChampion);
      await dbOperations.saveDb(db);

      set(state => ({
        champions: [...state.champions, newChampion],
        isLoading: false,
        error: null
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add champion',
        isLoading: false 
      });
      throw error;
    }
  },

  addChampionsBulk: async (names, championClass, starRating) => {
    set({ isLoading: true });
    try {
      const db = await dbOperations.loadDb();
      const adminUser = db.users.find(u => u.role === 'admin');
      if (!adminUser) throw new Error('Admin user not found');

      const championsToAdd = names.map(name => ({
        id: `CHAMP_${crypto.randomUUID()}`,
        name: name.trim(),
        class: championClass,
        starRating,
        ranks: getDefaultRanks(starRating),
      }));
      
      adminUser.data.champions.push(...championsToAdd);
      await dbOperations.saveDb(db);

      set(state => ({
        champions: [...state.champions, ...championsToAdd],
        isLoading: false,
        error: null
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add champions in bulk',
        isLoading: false 
      });
      throw error;
    }
  },

  deleteChampion: async (id) => {
    set({ isLoading: true });
    try {
      const db = await dbOperations.loadDb();
      const adminUser = db.users.find(u => u.role === 'admin');
      if (!adminUser) throw new Error('Admin user not found');

      adminUser.data.champions = adminUser.data.champions.filter(c => c.id !== id);
      await dbOperations.saveDb(db);

      set(state => ({
        champions: state.champions.filter(c => c.id !== id),
        isLoading: false,
        error: null
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete champion',
        isLoading: false 
      });
      throw error;
    }
  },

  deleteAllChampions: async () => {
    set({ isLoading: true });
    try {
      const db = await dbOperations.loadDb();
      const adminUser = db.users.find(u => u.role === 'admin');
      if (!adminUser) throw new Error('Admin user not found');

      adminUser.data.champions = [];
      await dbOperations.saveDb(db);

      set({ 
        champions: [],
        isLoading: false,
        error: null
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete all champions',
        isLoading: false 
      });
      throw error;
    }
  },

  updateChampion: async (id, updates) => {
    set({ isLoading: true });
    try {
      const db = await dbOperations.loadDb();
      const adminUser = db.users.find(u => u.role === 'admin');
      if (!adminUser) throw new Error('Admin user not found');

      const championIndex = adminUser.data.champions.findIndex(c => c.id === id);
      if (championIndex === -1) throw new Error('Champion not found');

      const updatedChampion = {
        ...adminUser.data.champions[championIndex],
        ...updates
      };

      adminUser.data.champions[championIndex] = updatedChampion;
      await dbOperations.saveDb(db);

      set(state => ({
        champions: state.champions.map(c => c.id === id ? updatedChampion : c),
        isLoading: false,
        error: null
      }));

      return updatedChampion;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update champion',
        isLoading: false 
      });
      throw error;
    }
  }
}));