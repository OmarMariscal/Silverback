export interface PaginacionParams {
  pagina: number;
  limite: number;
  orden?: 'asc' | 'desc';
  sortBy?: string;
}
