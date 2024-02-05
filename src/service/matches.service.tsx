import http from "../utils/util";

const MatchesDataService = {
  getAll() {
    return http.get('/match');
  },

  getPredictionDetailsById(id: number) {
    return http.get(`/match/prediction/${id}`);
  },

  get(id: number) {
    return http.get(`/match/${id}`);
  },

  filterSeasonYear(year: any) {
    return http.get(`/match/filter/${year}`)
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