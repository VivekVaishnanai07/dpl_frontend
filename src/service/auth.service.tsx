import http from "../utils/util";

const AuthService = {
  login(data: any) {
    return http.post("/login", data);
  },

  changePassword(data: any) {
    return http.post("/change-password", data);
  },
}

export default AuthService;