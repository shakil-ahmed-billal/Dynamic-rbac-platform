export interface ICreatePermissionPayload {
  action: 'READ' | 'WRITE' | 'UPDATE' | 'DELETE' | 'MANAGE';
  moduleId: string;
}

export interface IUpdatePermissionPayload {
  action?: 'READ' | 'WRITE' | 'UPDATE' | 'DELETE' | 'MANAGE';
  moduleId?: string;
}
