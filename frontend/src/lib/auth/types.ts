export type UserRole = "admin" | "member";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};
