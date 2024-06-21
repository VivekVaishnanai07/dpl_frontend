import http from "../utils/util";

const GroupService = {
  filterGroups(userId: number | null, tournamentId: number | null) {
    return http.get(`/group/dashboard-groups/${userId}/${tournamentId}`);
  },

  getAll(id: number | null) {
    return http.get(`/group/user-groups/${id}`);
  },

  get(id: number) {
    return http.get(`/group/${id}`);
  },

  create(data: any) {
    return http.post("/group/add-group", data);
  },

  update(id: number, data: any) {
    return http.put(`/group/${id}`, data);
  },

  delete(id: number) {
    return http.delete(`/group/${id}`);
  }
}

export default GroupService;