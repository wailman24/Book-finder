export interface User {
  id: number;
  email: string;
  password?: string;
  role?: "user" | "admin";
}

export interface AuthResponse {
  status: string;
  access_token: string;
  user: User;
}
