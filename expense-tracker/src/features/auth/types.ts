export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

export type AuthMeData = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
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

export type RegisterResponse = {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    createdAt: string;
  };
};

export type AuthMeResponse = {
  success: boolean;
  data: AuthMeData;
};
