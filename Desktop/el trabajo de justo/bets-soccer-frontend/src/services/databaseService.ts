import { SQLiteConnection, SQLiteDBConnection, CapacitorSQLite } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';
import { defineCustomElements as jeepSqlite } from 'jeep-sqlite/loader';

if (Capacitor.getPlatform() === 'web') {
  jeepSqlite(window);
}

class DatabaseService {
  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;
  private isInitialized = false;

  async initDatabase() {
    if (this.isInitialized) return;

    try {
      if (Capacitor.getPlatform() === 'web') {
        const jeepEl = document.querySelector('jeep-sqlite');
        if (jeepEl && (jeepEl as any).initWebStore) {
          await (jeepEl as any).initWebStore();
        } else if (!document.querySelector('jeep-sqlite')) {
          const newJeepEl = document.createElement('jeep-sqlite');
          document.body.appendChild(newJeepEl);
          await customElements.whenDefined('jeep-sqlite');
          if ((newJeepEl as any).initWebStore) {
            await (newJeepEl as any).initWebStore();
          }
        }
      }

      this.db = await this.sqlite.createConnection(
        'bets_soccer_db',
        false,
        'no-encryption',
        1,
        false
      );

      await this.db.open();
      
      const schema = `
        CREATE TABLE IF NOT EXISTS teams (name TEXT PRIMARY KEY, strength INTEGER, pts INTEGER, logo_url TEXT);
        CREATE TABLE IF NOT EXISTS players (id INTEGER PRIMARY KEY, name TEXT, team_name TEXT, goals INTEGER, avatar_url TEXT);
        CREATE TABLE IF NOT EXISTS local_settings (key TEXT PRIMARY KEY, value TEXT);
      `;
      await this.db.execute(schema);
      this.isInitialized = true;
    } catch (e) {
      console.warn('⚠️ SQLite no disponible en este navegador, continuando sin persistencia local:', e);
      this.isInitialized = false;
    }
  }

  async saveTeams(teams: any[]) {
    await this.initDatabase();
    if (!this.isInitialized) return;
    for (const team of teams) {
      await this.db.run(
        'INSERT OR REPLACE INTO teams (name, strength, pts) VALUES (?, ?, ?)',
        [team.name, team.strength, team.pts]
      );
    }
  }

  async getTeams() {
    await this.initDatabase();
    if (!this.isInitialized) return [];
    const result = await this.db.query('SELECT * FROM teams ORDER BY pts DESC');
    return result.values || [];
  }

  async savePlayers(players: any[]) {
    await this.initDatabase();
    if (!this.isInitialized) return;
    for (const player of players) {
      await this.db.run(
        'INSERT OR REPLACE INTO players (id, name, team_name, goals, avatar_url) VALUES (?, ?, ?, ?, ?)',
        [player.id, player.name, player.team_name, player.goals, player.avatar_url]
      );
    }
  }

  async getPlayersByTeam(teamName: string) {
    await this.initDatabase();
    if (!this.isInitialized) return [];
    const result = await this.db.query('SELECT * FROM players WHERE team_name = ?', [teamName]);
    return result.values || [];
  }
}

export const dbService = new DatabaseService();
