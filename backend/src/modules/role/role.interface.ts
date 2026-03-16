export interface ICreateRolePayload {
  name: string;
  description?: string;
}

export interface IUpdateRolePayload {
  name?: string;
  description?: string;
  isActive?: boolean;
}

export interface IAssignPermissionsPayload {
  permissionIds: string[];
}
