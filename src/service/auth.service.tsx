import { ChangePasswordRequestPayload, LoginRequestPayload } from "../types/auth";
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
}

export default AuthService;