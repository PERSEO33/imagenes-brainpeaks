import api from './api';
import { dbService } from './databaseService';

export const soccerService = {
  async getMatches() {
    const response = await api.get('/api/matches');
    return response.data;
  },

  async getMatchDetail(id: number) {
    const response = await api.get(`/api/matches/${id}`);
    return response.data;
  },

  async getStandings() {
    try {
      const response = await api.get('/api/league/standings');
      const standings = response.data;

      await dbService.saveTeams(standings);
      return standings;
    } catch (e) {
      console.warn('API error, loading from SQLite cache');
      return await dbService.getTeams();
    }
  },

  async getTeamPlayers(teamName: string) {
    try {
      const response = await api.get(`/api/teams/${teamName}/players`);
      const players = response.data;

      await dbService.savePlayers(players);
      return players;
    } catch (e) {
      console.warn('API error, loading from SQLite cache');
      return await dbService.getPlayersByTeam(teamName);
    }
  },

  async getLeaderboard() {
    const response = await api.get('/api/leaderboard');
    return response.data;
  },

  async getTopScorers() {
    const response = await api.get('/api/players/top-scorers');
    return response.data;
  }
};
