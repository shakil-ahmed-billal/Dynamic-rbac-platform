export interface ICreateSystemModulePayload {
  name: string;
  description?: string;
}

export interface IUpdateSystemModulePayload {
  name?: string;
  description?: string;
  isActive?: boolean;
}
