import { User } from '../types/auth';
import { Champion } from '../types/champion';
import { AllianceMember } from '../types/alliance';
import { GlobalTactic, NodeTactic, MapDifficulty, ChampionBan, Node } from '../types/warMap';
import { WarSeason } from '../types/warSeason';

interface UserData {
  champions: Champion[];
  settings: {
    backgroundImage: string | null;
  };
}

interface WarMapData {
  globalTactics: Record<MapDifficulty, GlobalTactic | null>;
  nodeTactics: NodeTactic[];
  nodes: Node[];
  difficulty: MapDifficulty;
  championBans: Record<MapDifficulty, ChampionBan[]>;
}

interface Database {
  users: (User & { password: string; data: UserData })[];
  alliance: {
    name: string;
    members: AllianceMember[];
  };
  warMap: WarMapData;
  seasons: WarSeason[];
}

let cachedDb: Database | null = null;

const defaultDatabase: Database = {
  users: [
    {
      id: "USR_001",
      email: "admin",
      password: "admin",
      fullName: "Admin User",
      lineId: "admin",
      role: "admin",
      status: "approved",
      data: {
        champions: [],
        settings: {
          backgroundImage: null
        }
      }
    }
  ],
  alliance: {
    name: "",
    members: []
  },
  warMap: {
    globalTactics: {
      Challenger: null,
      Expert: null,
      Elite: null
    },
    nodeTactics: [],
    nodes: Array.from({ length: 49 }, (_, i) => ({
      id: `NODE_${String(i + 1).padStart(3, '0')}`,
      number: i + 1,
      type: 'normal' as const
    })).concat([{
      id: 'NODE_BOSS',
      number: 50,
      type: 'boss' as const
    }]),
    difficulty: "Expert",
    championBans: {
      Challenger: [],
      Expert: [],
      Elite: []
    }
  },
  seasons: []
};

export const dbOperations = {
  loadDb: async (): Promise<Database> => {
    try {
      const response = await fetch('/api/db');
      if (!response.ok) {
        throw new Error('Failed to load database');
      }
      const data = await response.json();
      cachedDb = data;
      return data;
    } catch (error) {
      console.error('Failed to load database:', error);
      if (!cachedDb) {
        cachedDb = defaultDatabase;
        await dbOperations.saveDb(defaultDatabase);
      }
      return cachedDb;
    }
  },

  saveDb: async (database: Database): Promise<void> => {
    try {
      const response = await fetch('/api/save-db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(database),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save database');
      }
      cachedDb = database;
    } catch (error) {
      console.error('Failed to save database:', error);
      throw error;
    }
  },

  // War Map Operations
  getWarMapData: async (): Promise<WarMapData> => {
    const db = await dbOperations.loadDb();
    return db.warMap;
  },

  updateWarMapData: async (data: Partial<WarMapData>): Promise<void> => {
    const db = await dbOperations.loadDb();
    db.warMap = {
      ...db.warMap,
      ...data
    };
    await dbOperations.saveDb(db);
  },

  // Champion Ban Operations
  addChampionBan: async (difficulty: MapDifficulty, championId: string): Promise<void> => {
    const db = await dbOperations.loadDb();
    const newBan: ChampionBan = {
      id: `BAN_${crypto.randomUUID()}`,
      championId,
      mapDifficulty: difficulty
    };
    
    db.warMap.championBans[difficulty].push(newBan);
    await dbOperations.saveDb(db);
  },

  removeChampionBan: async (difficulty: MapDifficulty, banId: string): Promise<void> => {
    const db = await dbOperations.loadDb();
    db.warMap.championBans[difficulty] = db.warMap.championBans[difficulty].filter(
      ban => ban.id !== banId
    );
    await dbOperations.saveDb(db);
  },

  // Tactic Operations
  setGlobalTactic: async (difficulty: MapDifficulty, tactic: GlobalTactic): Promise<void> => {
    const db = await dbOperations.loadDb();
    db.warMap.globalTactics[difficulty] = tactic;
    await dbOperations.saveDb(db);
  },

  setNodeTactic: async (difficulty: MapDifficulty, tactic: NodeTactic): Promise<void> => {
    const db = await dbOperations.loadDb();
    db.warMap.nodeTactics = [
      ...db.warMap.nodeTactics.filter(t => 
        !(t.nodeNumber === tactic.nodeNumber && t.difficulty === difficulty)
      ),
      tactic
    ];
    await dbOperations.saveDb(db);
  },

  // Season Operations
  startWarSeason: async (name: string): Promise<void> => {
    const db = await dbOperations.loadDb();
    const newSeason: WarSeason = {
      id: `SEASON_${crypto.randomUUID()}`,
      name,
      isActive: true,
      startDate: new Date().toISOString(),
      warMap: JSON.parse(JSON.stringify(db.warMap)) // Deep copy current war map state
    };
    
    db.seasons.push(newSeason);
    await dbOperations.saveDb(db);
  },

  loadWarSeason: async (seasonId: string): Promise<WarSeason | null> => {
    const db = await dbOperations.loadDb();
    return db.seasons.find(s => s.id === seasonId) || null;
  }
};