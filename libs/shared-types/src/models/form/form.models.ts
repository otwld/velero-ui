export interface FormList<T> {
  total: number;
  items: T[];
}

export interface CreateFormBody<T> {
  name: string;
  type?: string;
  labels?: Record<string, string>;
  spec: T;
}

export interface EditFormBody<T> {
  spec: T;
}
