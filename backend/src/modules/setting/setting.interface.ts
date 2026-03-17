export interface ICreateSystemSettingPayload {
  key: string;
  value: string;
  description?: string;
}

export interface IUpdateSystemSettingPayload {
  value?: string;
  description?: string;
}
