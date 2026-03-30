export type LoginPayload = {
  email: string;
  password: string;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

export type LoginResponse = {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    user: AuthUser;
  };
};

export type LogoutResponse = {
  success: boolean;
  message: string;
};
