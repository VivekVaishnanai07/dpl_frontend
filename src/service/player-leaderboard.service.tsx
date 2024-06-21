import http from "../utils/util";

const playerLeaderboardService = {

  getAll(tournamentId: number, groupId: number) {
    return http.get(`/player-leaderboard/filter/${tournamentId}/${groupId}`);
  }

}

export default playerLeaderboardService;