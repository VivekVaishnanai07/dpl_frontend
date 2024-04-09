export interface PredictionRequestPayload {
  matchId: number;
  userId?: number;
  teamId: number;
  predictionId?: number;
}

export interface IPredictionAnalysis {
  user_id: number;
  full_name: string;
  match_details: MatchDetail[];
}

export interface MatchDetail {
  date: string;
  venue: string;
  status: string;
  team_1: string;
  team_2: string;
  match_id: number;
  match_no: number;
  winner_team: string;
  predict_team: string;
}

export interface IPlayerLeaderboard {
  user_id: number;
  full_name: string;
  total_matches: number;
  predicted_matches: number;
  win_matches: string;
  lose_matches: string;
  unpredicted_past_matches: string;
  unpredicted_future_matches: string;
  upcoming_matches: string;
  pay_money: string;
  total_unpredicted_matches: string;
  win_percentage: string;
  streak: string;
  userImg: any;
}