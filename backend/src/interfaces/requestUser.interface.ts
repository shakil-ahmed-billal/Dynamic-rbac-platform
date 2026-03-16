export interface IRequestUser {
  userId: string;
  email: string;
  isSuperAdmin: boolean;
  roles: string[]; // role names
  status: string;
}
