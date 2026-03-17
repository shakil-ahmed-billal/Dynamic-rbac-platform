export interface ICreatePermissionPayload {
  action: string;
  name: string;
  slug: string;
  moduleId: string;
}

export interface IUpdatePermissionPayload {
  action?: string;
  name?: string;
  slug?: string;
  moduleId?: string;
}
