import http from "../utils/util";

const TournamentService = {
  getByUserAll(id: number | null) {
    return http.get(`/tournament/user-tournaments/${id}`);
  },

  getAll(id: number | null) {
    return http.get(`/tournament/get-tournaments/${id}`);
  },

  get(id: number) {
    return http.get(`/tournament/${id}`);
  },

  create(data: any) {
    return http.post("/tournament/add-tournament", data);
  },

  update(id: number, data: any) {
    return http.put(`/tournament/${id}`, data);
  },

  delete(id: number) {
    return http.delete(`/tournament/${id}`);
  }
}

export default TournamentService;