import { create } from 'zustand';
import { WarSeasonState, WarSeason } from '../types/warSeason';
import { dbOperations } from '../db/db';

export const useWarSeasonStore = create<WarSeasonState>((set) => ({
  seasons: [],
  activeSeason: null,
  isLoading: false,
  error: null,

  createSeason: async (name: string) => {
    set({ isLoading: true });
    try {
      await dbOperations.startWarSeason(name);
      set({ isLoading: false });
    } catch (error) {
      set({ error: 'Failed to create season', isLoading: false });
      throw error;
    }
  },

  endSeason: async (id: string) => {
    set({ isLoading: true });
    try {
      const db = await dbOperations.loadDb();
      const seasonIndex = db.seasons.findIndex(s => s.id === id);
      if (seasonIndex === -1) throw new Error('Season not found');

      db.seasons[seasonIndex].isActive = false;
      db.seasons[seasonIndex].endDate = new Date().toISOString();
      await dbOperations.saveDb(db);

      set(state => ({
        seasons: state.seasons.map(s => 
          s.id === id ? { ...s, isActive: false, endDate: new Date().toISOString() } : s
        ),
        activeSeason: state.activeSeason?.id === id ? null : state.activeSeason,
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to end season', isLoading: false });
      throw error;
    }
  },

  loadSeason: async (id: string) => {
    set({ isLoading: true });
    try {
      const season = await dbOperations.loadWarSeason(id);
      if (!season) throw new Error('Season not found');

      set({ 
        activeSeason: season,
        isLoading: false 
      });
    } catch (error) {
      set({ error: 'Failed to load season', isLoading: false });
      throw error;
    }
  }
}));