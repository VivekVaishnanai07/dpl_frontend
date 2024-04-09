import { MatchDetailsRequestPayload } from "../types/match";
import http from "../utils/util";

const MatchService = {
  getAll() {
    return http.get('/match');
  },

  getDashboard(id: number) {
    return http.get(`/match/dashboard/${id}`);
  },

  getPredictionDetailsById(id: number) {
    return http.get(`/match/prediction/${id}`);
  },

  get(id: number) {
    return http.get(`/match/${id}`);
  },

  create(data: MatchDetailsRequestPayload) {
    return http.post("/match/add-match", data);
  },

  update(id: number, data: MatchDetailsRequestPayload) {
    return http.put(`/match/${id}`, data);
  },

  addWinnerTeam(id: number, winner_team: number) {
    return http.put(`/match/winner-team/${id}/${winner_team}`)
  },

  delete(id: number) {
    return http.delete(`/match/${id}`);
  }
}

export default MatchService;