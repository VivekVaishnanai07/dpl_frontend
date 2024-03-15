import http from "../utils/util";

const AuthService = {
  login(data: any) {
    return http.post("/login", data);
  },
}

export default AuthService;