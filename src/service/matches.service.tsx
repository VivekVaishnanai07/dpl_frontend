import http from "../utils/util";

const MatchesDataService = {
  getAll(data: any) {
    return http.get('/match', data);
  },

  getDashboard(id: any) {
    return http.get(`/match/dashboard/${id}`);
  },

  getPredictionDetailsById(id: number) {
    return http.get(`/match/prediction/${id}`);
  },

  get(id: number) {
    return http.get(`/match/${id}`);
  },

  create(data: any) {
    return http.post("/match/add-match", data);
  },

  update(id: number, data: any) {
    return http.put(`/match/${id}`, data);
  },

  addWinnerTeam(id: number, winner_team: any) {
    return http.put(`/match/winner-team/${id}/${winner_team}`)
  },

  delete(id: number) {
    return http.delete(`/match/${id}`);
  }
}

export default MatchesDataService;