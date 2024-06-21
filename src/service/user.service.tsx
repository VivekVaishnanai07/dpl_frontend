import { UserRequestPayload } from "../types/user";
import http from "../utils/util";

const UserService = {
  getAll() {
    return http.get("/user");
  },

  getUsers() {
    return http.get("/user/user-list");
  },

  getById(id: number) {
    return http.get(`/user/${id}`);
  },

  create(data: UserRequestPayload) {
    return http.post("/user/add-user", data);
  },

  update(id: number, data: UserRequestPayload) {
    return http.put(`/user/${id}`, data);
  },

  updateProfile(id: number, data: UserRequestPayload) {
    return http.put(`/user/profile/${id}`, data);
  },

  delete(id: number) {
    return http.delete(`/user/${id}`);
  }
}

export default UserService;