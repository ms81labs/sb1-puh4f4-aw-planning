import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs/promises';
import path from 'path';

// Database file path
const DB_PATH = 'src/db/database.json';

// Read database file
async function readDatabase() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    // Return initial database state if file doesn't exist
    return {
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
            },
            alliance: {
              name: "",
              members: []
            }
          }
        }
      ],
      warMap: {
        globalTactic: null,
        nodeTactics: [],
        nodes: Array.from({ length: 49 }, (_, i) => ({
          id: `NODE_${String(i + 1).padStart(3, '0')}`,
          number: i + 1,
          type: 'normal'
        })).concat([{
          id: 'NODE_BOSS',
          number: 50,
          type: 'boss'
        }]),
        difficulty: "Expert",
        championBans: []
      },
      seasons: []
    };
  }
}

// Write database file
async function writeDatabase(data: any) {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing database:', error);
    throw error;
  }
}

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'database-api',
      configureServer(server) {
        let database: any = null;

        // Initialize database on server start
        server.middlewares.use(async (req, res, next) => {
          if (!database) {
            database = await readDatabase();
          }
          next();
        });

        // Handle database API endpoints
        server.middlewares.use(async (req, res, next) => {
          if (req.url === '/api/db') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(database));
            return;
          }

          if (req.url === '/api/save-db' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
              body += chunk.toString();
            });

            req.on('end', async () => {
              try {
                const newData = JSON.parse(body);
                database = newData;
                await writeDatabase(newData);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
              } catch (error) {
                console.error('Error saving database:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                  success: false, 
                  error: error instanceof Error ? error.message : 'Failed to save database'
                }));
              }
            });

            req.on('error', (error) => {
              console.error('Error reading request:', error);
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ 
                success: false, 
                error: 'Failed to process request' 
              }));
            });

            return;
          }

          next();
        });
      },
    },
  ],
});