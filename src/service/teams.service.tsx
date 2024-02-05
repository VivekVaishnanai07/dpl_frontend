import http from "../utils/util";

const TeamsDataService = {
  getAll() {
    return http.get('/team');
  },

  get(id: number) {
    return http.get(`/team/${id}`);
  },

  create(data: any) {
    return http.post("/team/add-team", data);
  },

  update(id: number, data: any) {
    return http.put(`/team/${id}`, data);
  },

  delete(id: number) {
    return http.delete(`/team/${id}`);
  }
}

export default TeamsDataService;