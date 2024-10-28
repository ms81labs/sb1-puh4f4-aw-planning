import { create } from 'zustand';
import { AuthState, User } from '../types/auth';
import { dbOperations } from '../db/db';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const db = await dbOperations.loadDb();
      const user = db.users.find(u => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('Invalid credentials');
      }
      if (user.status !== 'approved') {
        throw new Error('Account not approved');
      }

      const { password: _, data: __, ...userWithoutPassword } = user;
      set({ user: userWithoutPassword, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },

  register: async (email: string, password: string, fullName: string, lineId: string) => {
    set({ isLoading: true });
    try {
      const db = await dbOperations.loadDb();
      const existingUser = db.users.find(u => u.email === email);
      
      if (existingUser) {
        throw new Error('Email already registered');
      }

      const newUser = {
        id: `USR_${crypto.randomUUID()}`,
        email,
        password,
        fullName,
        lineId,
        role: 'user' as const,
        status: 'pending' as const,
        data: {
          champions: [],
          settings: {
            backgroundImage: null
          },
          alliance: {
            name: "",
            members: []
          }
        }
      };

      db.users.push(newUser);
      await dbOperations.saveDb(db);
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateUserStatus: async (userId: string, status: User['status']) => {
    set({ isLoading: true });
    try {
      const db = await dbOperations.loadDb();
      const userIndex = db.users.findIndex(u => u.id === userId);
      
      if (userIndex === -1) {
        throw new Error('User not found');
      }

      db.users[userIndex].status = status;
      await dbOperations.saveDb(db);
      
      const { password: _, data: __, ...userWithoutPassword } = db.users[userIndex];
      set({ isLoading: false });
      return userWithoutPassword;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  deleteUser: async (userId: string) => {
    set({ isLoading: true });
    try {
      const db = await dbOperations.loadDb();
      db.users = db.users.filter(u => u.id !== userId);
      await dbOperations.saveDb(db);
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  getUsers: async () => {
    set({ isLoading: true });
    try {
      const db = await dbOperations.loadDb();
      const users = db.users.map(({ password: _, data: __, ...user }) => user);
      set({ isLoading: false });
      return users;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  }
}));