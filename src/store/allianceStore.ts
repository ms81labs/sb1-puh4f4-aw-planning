import { create } from 'zustand';
import { AllianceState, AllianceMember } from '../types/alliance';
import { dbOperations } from '../db/db';

export const useAllianceStore = create<AllianceState>((set) => ({
  members: [],
  allianceName: '',
  isLoading: false,
  error: null,
  selectedBg: 1,

  loadAllianceData: async () => {
    set({ isLoading: true });
    try {
      const db = await dbOperations.loadDb();
      set({ 
        allianceName: db.alliance.name,
        members: db.alliance.members,
        isLoading: false 
      });
    } catch (error) {
      set({ error: 'Failed to load alliance data', isLoading: false });
    }
  },

  addMember: async (member) => {
    const { members } = get();
    if (members.length >= 30) {
      throw new Error('Alliance is full (max 30 members)');
    }

    set({ isLoading: true });
    try {
      const db = await dbOperations.loadDb();
      const newMember = {
        ...member,
        id: crypto.randomUUID(),
        isActive: true,
      };
      
      db.alliance.members.push(newMember);
      await dbOperations.saveDb(db);

      set((state) => ({
        members: [...state.members, newMember],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to add member', isLoading: false });
      throw error;
    }
  },

  removeMember: async (id) => {
    set({ isLoading: true });
    try {
      const db = await dbOperations.loadDb();
      db.alliance.members = db.alliance.members.filter(m => m.id !== id);
      await dbOperations.saveDb(db);
      
      set((state) => ({
        members: state.members.filter((m) => m.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to remove member', isLoading: false });
      throw error;
    }
  },

  assignToBg: async (id, bg) => {
    set({ isLoading: true });
    try {
      const db = await dbOperations.loadDb();
      const memberIndex = db.alliance.members.findIndex(m => m.id === id);
      if (memberIndex === -1) throw new Error('Member not found');

      db.alliance.members[memberIndex].battleground = bg;
      await dbOperations.saveDb(db);
      
      set((state) => ({
        members: state.members.map((m) => (m.id === id ? { ...m, battleground: bg } : m)),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to assign battleground', isLoading: false });
      throw error;
    }
  },

  setSelectedBg: (bg) => {
    set({ selectedBg: bg });
  },

  toggleMemberStatus: async (id) => {
    set({ isLoading: true });
    try {
      const db = await dbOperations.loadDb();
      const memberIndex = db.alliance.members.findIndex(m => m.id === id);
      if (memberIndex === -1) throw new Error('Member not found');

      const newStatus = !db.alliance.members[memberIndex].isActive;
      db.alliance.members[memberIndex].isActive = newStatus;
      await dbOperations.saveDb(db);

      set((state) => ({
        members: state.members.map((m) => (m.id === id ? { ...m, isActive: newStatus } : m)),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to toggle member status', isLoading: false });
      throw error;
    }
  },

  updateAllianceName: async (name) => {
    set({ isLoading: true });
    try {
      const db = await dbOperations.loadDb();
      db.alliance.name = name;
      await dbOperations.saveDb(db);
      
      set({ allianceName: name, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to update alliance name', isLoading: false });
      throw error;
    }
  }
}));