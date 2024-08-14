import { ChangePasswordRequestPayload, LoginRequestPayload, Resignation } from "../types/auth";
import http from "../utils/util";

const AuthService = {
  login(data: LoginRequestPayload) {
    return http.post("/login", data);
  },

  logout(data: { userId: number, sessionID: string }) {
    return http.post("/logout", data);
  },

  changePassword(data: ChangePasswordRequestPayload) {
    return http.post("/change-password", data);
  },

  registration(data: Resignation) {
    return http.post("/register", data);
  },
}

export default AuthService;