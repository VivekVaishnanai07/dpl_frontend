export interface UserRequestPayload {
  first_name: string;
  last_name: string;
  email?: string;
  password?: string;
  role?: string;
  userProfile?: any;
}

export interface IUser {
  id: number;
  first_name: string;
  last_name: string;
  predicted_team_id: number;
  email: string;
  password: string;
  role: string;
  userProfile?: any;
}

export interface IPredictedUser {
  first_name: string;
  last_name: string;
  predicted_team_id: number;
}