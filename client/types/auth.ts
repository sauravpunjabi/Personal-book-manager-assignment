export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  user: User;
}
