export interface MatchDetailsRequestPayload {
  date: any;
  team_1: string | number;
  team_2: string | number;
  venue: string;
  match_price: number;
  match_no: number;
  season_year: number;
}

export interface IMatch {
  id: number;
  team_1_id: number;
  team_1: string;
  team_1_icon: string;
  team_1_short_name: string;
  team_1_color: string;
  team_2_id: number;
  team_2: string;
  team_2_icon: string;
  team_2_short_name: string;
  team_2_color: string;
  venue: string;
  match_price: number;
  date: string;
  match_no: number;
  season_year: number;
  winner_team: string;
  countdownTime: string;
  predicted_team?: string;
  predicted_team_color?: string;
  match_status: string;
}