export interface ICreateSystemModulePayload {
  name: string;
  slug: string;
  description?: string;
}

export interface IUpdateSystemModulePayload {
  name?: string;
  slug?: string;
  description?: string;
  isActive?: boolean;
}
