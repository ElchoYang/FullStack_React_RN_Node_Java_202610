export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  department?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: CurrentUser;
}
