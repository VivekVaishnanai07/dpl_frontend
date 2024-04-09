import { Navigate, Route } from "react-router-dom";
import AuthGuard from "../components/auth/guards/auth-guard";
import ChangePassword from "../components/change-password/change-password";
import Dashboard from "../screens/dashboard/dashboard";
import AddMatch from "../screens/matches/add-match";
import Match from "../screens/matches/match";
import PredictionAnalysis from "../screens/prediction-analysis/prediction-analysis";
import UserPredictionAnalysis from "../screens/prediction-analysis/user-predicition-analysis/user-prediction-analysis";
import Prediction from "../screens/prediction/prediction";
import AddTeam from "../screens/teams/add-team";
import Teams from "../screens/teams/teams";
import UserProfile from "../screens/user-profile/user-profile";
import AddUser from "../screens/users/add-user";
import Users from "../screens/users/users";
import { roles } from "../utils/util";

const AuthRoutes = [
    <Route key="Dashboard" path="/dashboard" element={<AuthGuard component={<Dashboard />} allowedRole={[roles.Admin_Role, roles.User_Role]} />} />,
    <Route key="Prediction" path="/dashboard/prediction/:id" element={<AuthGuard component={<Prediction />} allowedRole={[roles.Admin_Role, roles.User_Role]} />} />,
    <Route key="Match" path="/matches" element={<AuthGuard component={<Match />} allowedRole={[roles.Admin_Role, roles.User_Role]} />} />,
    <Route key="AddMatch" path="/match/add-match" element={<AuthGuard component={<AddMatch />} allowedRole={[roles.Admin_Role]} />} />,
    <Route key="EditMatch" path="/match/:id" element={<AuthGuard component={<AddMatch />} allowedRole={[roles.Admin_Role]} />} />,
    <Route key="Teams" path="/teams" element={<AuthGuard component={<Teams />} allowedRole={[roles.Admin_Role, roles.User_Role]} />} />,
    <Route key="AddTeams" path="/team/add-teams" element={<AuthGuard component={<AddTeam />} allowedRole={[roles.Admin_Role]} />} />,
    <Route key="EditTeams" path="/team/:id" element={<AuthGuard component={<AddTeam />} allowedRole={[roles.Admin_Role]} />} />,
    <Route key="Users" path="/users" element={<AuthGuard component={<Users />} allowedRole={[roles.Admin_Role]} />} />,
    <Route key="AddUser" path="/user/add-user" element={<AuthGuard component={<AddUser />} allowedRole={[roles.Admin_Role]} />} />,
    <Route key="EditUser" path="/user/:id" element={<AuthGuard component={<AddUser />} allowedRole={[roles.Admin_Role]} />} />,
    <Route key="PredictionAnalysis" path="/prediction-analysis" element={<AuthGuard component={<PredictionAnalysis />} allowedRole={[roles.Admin_Role, roles.User_Role]} />} />,
    <Route key="UserPredictionAnalysis" path="/prediction-analysis/:id" element={<AuthGuard component={<UserPredictionAnalysis />} allowedRole={[roles.Admin_Role, roles.User_Role]} />} />,
    <Route key="ChangePassword" path="/change-password" element={<AuthGuard component={<ChangePassword />} allowedRole={[roles.Admin_Role, roles.User_Role]} />} />,
    <Route key="UserProfile" path="/user-profile" element={<AuthGuard component={<UserProfile />} allowedRole={[roles.Admin_Role, roles.User_Role]} />} />,
    <Route path="*" element={<Navigate to="/dashboard" />} />
]

export default AuthRoutes;