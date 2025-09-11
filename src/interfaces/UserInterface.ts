export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  password: string;
  role: "admin" | "moderator" | "user";
  avatar: string | null;
  mobile: string | null;
  gender: string | null;
  status: "active" | "inactive";
  created_at?: Date;
  updated_at?: Date;
}

export type SafeUserProfile = Partial<Omit<User, "password">>;
