import { TeamDetailsRequestPayload } from "../types/team";
import http from "../utils/util";

const TeamService = {
  getAll() {
    return http.get('/team');
  },

  get(id: number) {
    return http.get(`/team/${id}`);
  },

  create(data: TeamDetailsRequestPayload) {
    return http.post("/team/add-team", data);
  },

  update(id: number, data: TeamDetailsRequestPayload) {
    return http.put(`/team/${id}`, data);
  },

  delete(id: number) {
    return http.delete(`/team/${id}`);
  }
}

export default TeamService;