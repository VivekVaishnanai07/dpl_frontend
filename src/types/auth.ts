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

