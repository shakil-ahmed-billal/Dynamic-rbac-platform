export interface IRequestUser {
  id: string;
  email: string;
  isSuperAdmin: boolean;
  roles: string[]; // role names
  status: string;
}
