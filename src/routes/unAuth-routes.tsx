import { Route } from "react-router-dom";
import SingIn from "../components/auth/sign-in";
import UnAuthGuard from "../components/auth/guards/unAuth-guard";

const UnAuthRoutes = [
  <Route key="Login" path="/" element={<UnAuthGuard component={<SingIn />} />} ></Route>,
  <Route key="Login" path="/login" element={<UnAuthGuard component={<SingIn />} />} ></Route>
]

export default UnAuthRoutes;