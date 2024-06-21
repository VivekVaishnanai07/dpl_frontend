import { Navigate, Route } from "react-router-dom";
import AuthGuard from "../components/auth/guards/auth-guard";
import ChangePassword from "../components/change-password/change-password";
import Dashboard from "../screens/dashboard/dashboard";
import AddGroup from "../screens/groups/add-group";
import Groups from "../screens/groups/groups";
import Match from "../screens/matches/match";
import PredictionAnalysis from "../screens/prediction-analysis/prediction-analysis";
import UserPredictionAnalysis from "../screens/prediction-analysis/user-predicition-analysis/user-prediction-analysis";
import Prediction from "../screens/prediction/prediction";
import Teams from "../screens/teams/teams";
import AddTournament from "../screens/tournaments/add-tournament";
import AddMatch from "../screens/tournaments/matches/add-match";
import TournamentMatch from "../screens/tournaments/matches/tournament-match";
import AddTeam from "../screens/tournaments/teams/add-team";
import TournamentTeam from "../screens/tournaments/teams/tournament-team";
import Tournaments from "../screens/tournaments/tournaments";
import UserProfile from "../screens/user-profile/user-profile";
import AddUser from "../screens/users/add-user";
import Users from "../screens/users/users";
import { roles } from "../utils/util";

const AuthRoutes = [
    <Route key="Dashboard" path="/dashboard" element={<AuthGuard component={<Dashboard />} allowedRole={[roles.Admin_Role, roles.User_Role]} />} />,
    <Route key="Prediction" path="/dashboard/prediction/:id" element={<AuthGuard component={<Prediction />} allowedRole={[roles.Admin_Role, roles.User_Role]} />} />,
    <Route key="Match" path="/matches" element={<AuthGuard component={<Match />} allowedRole={[roles.Admin_Role, roles.User_Role]} />} />,
    <Route key="Teams" path="/teams" element={<AuthGuard component={<Teams />} allowedRole={[roles.Admin_Role, roles.User_Role]} />} />,
    <Route key="Users" path="/users" element={<AuthGuard component={<Users />} allowedRole={[roles.Admin_Role]} />} />,
    <Route key="AddUser" path="/user/add-user" element={<AuthGuard component={<AddUser />} allowedRole={[roles.Admin_Role]} />} />,
    <Route key="EditUser" path="/user/:id" element={<AuthGuard component={<AddUser />} allowedRole={[roles.Admin_Role]} />} />,
    <Route key="PredictionAnalysis" path="/prediction-analysis" element={<AuthGuard component={<PredictionAnalysis />} allowedRole={[roles.Admin_Role, roles.User_Role]} />} />,
    <Route key="UserPredictionAnalysis" path="/prediction-analysis/:userId/:groupId/:tournamentId" element={<AuthGuard component={<UserPredictionAnalysis />} allowedRole={[roles.Admin_Role, roles.User_Role]} />} />,
    <Route key="ChangePassword" path="/change-password" element={<AuthGuard component={<ChangePassword />} allowedRole={[roles.Admin_Role, roles.User_Role]} />} />,
    <Route key="UserProfile" path="/user-profile" element={<AuthGuard component={<UserProfile />} allowedRole={[roles.Admin_Role, roles.User_Role]} />} />,
    <Route key="Tournaments" path="/tournaments" element={<AuthGuard component={<Tournaments />} allowedRole={[roles.Admin_Role, roles.User_Role]} />} />,
    <Route key="TournamentMatches" path="/tournament/matches" element={<AuthGuard component={<TournamentMatch />} allowedRole={[roles.Admin_Role, roles.User_Role]} />} />,
    <Route key="AddTournamentMatch" path="/tournament/match/add-match" element={<AuthGuard component={<AddMatch />} allowedRole={[roles.Admin_Role]} />} />,
    <Route key="EditTournamentMatch" path="/tournament/match/:id" element={<AuthGuard component={<AddMatch />} allowedRole={[roles.Admin_Role]} />} />,
    <Route key="TournamentTeams" path="/tournament/teams" element={<AuthGuard component={<TournamentTeam />} allowedRole={[roles.Admin_Role, roles.User_Role]} />} />,
    <Route key="AddTournamentTeams" path="/tournament/team/add-teams" element={<AuthGuard component={<AddTeam />} allowedRole={[roles.Admin_Role]} />} />,
    <Route key="EditTournamentTeams" path="/tournament/team/:id" element={<AuthGuard component={<AddTeam />} allowedRole={[roles.Admin_Role]} />} />,
    <Route key="EditTournaments" path="/tournament/:id" element={<AuthGuard component={<AddTournament />} allowedRole={[roles.Admin_Role]} />} />,
    <Route key="AddTournaments" path="/tournament/add-tournament" element={<AuthGuard component={<AddTournament />} allowedRole={[roles.Admin_Role]} />} />,
    <Route key="Groups" path="/groups" element={<AuthGuard component={<Groups />} allowedRole={[roles.Admin_Role, roles.User_Role]} />} />,
    <Route key="EditGroups" path="/group/:id" element={<AuthGuard component={<AddGroup />} allowedRole={[roles.Admin_Role]} />} />,
    <Route key="AddGroups" path="/group/add-group" element={<AuthGuard component={<AddGroup />} allowedRole={[roles.Admin_Role]} />} />,
    <Route path="*" element={<Navigate to="/dashboard" />} />
]

export default AuthRoutes;