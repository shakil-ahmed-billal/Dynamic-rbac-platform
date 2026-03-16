/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IQueryParams {
  searchTerm?: string;
  page?: string | number;
  limit?: string | number;
  sortBy?: string;
  sortOrder?: string;
  fields?: string;
  include?: string;
  [key: string]: unknown;
}

export interface IQueryConfig {
  searchableFields?: string[];
  filterableFields?: string[];
}

export interface IQueryResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export type PrismaStringFilter = {
  contains?: string;
  startsWith?: string;
  endsWith?: string;
  equals?: string;
  mode?: 'insensitive' | 'default';
};

export type PrismaNumberFilter = {
  lt?: number;
  lte?: number;
  gt?: number;
  gte?: number;
  equals?: number;
  not?: number;
  in?: number[];
  notIn?: number[];
};

export type PrismaWhereConditions = {
  OR?: Record<string, unknown>[];
  AND?: Record<string, unknown>[];
  NOT?: Record<string, unknown>[];
  [key: string]: unknown;
};

export type PrismaFindManyArgs = {
  where?: Record<string, unknown>;
  include?: Record<string, unknown>;
  select?: Record<string, boolean | Record<string, unknown>>;
  orderBy?: Record<string, unknown>;
  skip?: number;
  take?: number;
};

export type PrismaCountArgs = {
  where?: Record<string, unknown>;
};

export type PrismaModelDelegate = {
  findMany: (args?: any) => Promise<any[]>;
  count: (args?: any) => Promise<number>;
};
