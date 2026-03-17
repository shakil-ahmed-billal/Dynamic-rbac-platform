export interface ICreateTaskPayload {
  title: string;
  description?: string;
  status?: string;
  dueDate?: string | Date;
  assignedTo?: string;
}

export interface IUpdateTaskPayload {
  title?: string;
  description?: string;
  status?: string;
  dueDate?: string | Date;
  assignedTo?: string;
}
