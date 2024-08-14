import { Navigate, Route } from "react-router-dom";
import UnAuthGuard from "../components/auth/guards/unAuth-guard";
import Register from "../components/auth/register/register";
import SingIn from "../components/auth/sign-in/sign-in";

const UnAuthRoutes = [
  <Route key="Login" path="/" element={<UnAuthGuard component={<SingIn />} />} ></Route>,
  <Route key="Login" path="/login" element={<UnAuthGuard component={<SingIn />} />} ></Route>,
  <Route key="Register" path="/register" element={<UnAuthGuard component={<Register />} />} ></Route>,
  <Route path="*" element={<Navigate to="/login" />} />
]

export default UnAuthRoutes;