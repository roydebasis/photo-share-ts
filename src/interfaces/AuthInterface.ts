export interface IUserRow {
  name: string;
  username: string;
  email: string;
  password: string;
  role?: string | null;
  mobile?: string | null;
  gender?: string | null;
  status?: string | null;
  avatar?: string | null;
}

export interface IJWTPayload {
  id: number;
  email: string;
  role: string;
}
