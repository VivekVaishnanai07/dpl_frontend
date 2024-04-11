export interface TeamDetailsRequestPayload {
  full_name: string;
  short_name: string;
  icon: string;
}

export interface ITeam {
  id: number;
  full_name: string;
  short_name: string;
  icon: string;
  team_color: string;
  winner_years: string;
  team_img: any;
}