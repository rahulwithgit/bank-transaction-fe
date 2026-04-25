export interface Account {
  id: string;
  name: string;
  iban: string;
  bank: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
