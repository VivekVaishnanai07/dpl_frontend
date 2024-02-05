import http from "../utils/util";

const playerLeaderboardDataService = {

  getAll() {
    return http.get("/player-leaderboard");
  }

}

export default playerLeaderboardDataService;