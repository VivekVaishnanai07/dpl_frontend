import dayjs from "dayjs";

export interface LoginRequestPayload {
  email: string;
  password: string;
}

export interface ChangePasswordRequestPayload {
  userId: number;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface JwtToken {
  token: string;
  sessionID: string;
}

export interface IChangePassword {
  message: string;
}

export interface JwtTokenDecode {
  id: number;
  firstName: string;
  userImg: any;
  lastName: string;
  role: string;
  iat: number;
  exp: number;
}

export interface Resignation {
  firstName: string
  lastName: string
  email: string
  password: string
  groupName: string
  groupDescription: string
  tournamentName: string
  year: number
  startDate: dayjs.Dayjs
  endDate: dayjs.Dayjs
  tournamentStatus: string
}
