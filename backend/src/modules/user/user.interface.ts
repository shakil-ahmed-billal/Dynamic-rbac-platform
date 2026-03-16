export interface ICreateUserPayload {
  name: string;
  email: string;
  password: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  contactNumber?: string;
  address?: string;
}

export interface IUpdateUserPayload {
  name?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  contactNumber?: string;
  address?: string;
  profilePhoto?: string;
}

export interface IUpdateUserStatusPayload {
  status: 'ACTIVE' | 'BLOCKED';
}

export interface IAssignRolesPayload {
  roleIds: string[];
}
