export interface User {
  id: number;
  email: string;
  password?: string;
}

export interface AuthResponse {
  status: string;
  access_token: string;
  user: User;
}
