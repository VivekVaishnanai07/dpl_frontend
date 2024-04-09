import http from "../utils/util";

const playerLeaderboardService = {

  getAll() {
    return http.get("/player-leaderboard");
  }

}

export default playerLeaderboardService;