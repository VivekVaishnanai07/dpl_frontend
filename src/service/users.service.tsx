import http from "../utils/util";

const UserDataService = {
  getAll() {
    return http.get("/user");
  },

  get(email: string) {
    return http.get(`/user/getEmail/${email}`);
  },

  getById(id: number) {
    return http.get(`/user/${id}`);
  },

  create(data: any) {
    return http.post("/user/add-user", data);
  },

  update(id: number, data: any) {
    return http.put(`/user/${id}`, data);
  },

  delete(id: number) {
    return http.delete(`/user/${id}`);
  }
}

export default UserDataService;