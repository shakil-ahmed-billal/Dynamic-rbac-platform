export interface ICreateLeadPayload {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status?: string;
  source?: string;
  assignedTo?: string;
}

export interface IUpdateLeadPayload {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  status?: string;
  source?: string;
  assignedTo?: string;
}
