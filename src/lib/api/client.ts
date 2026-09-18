import { appConfig } from '@/lib/config';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  meta?: PaginationMeta & Record<string, unknown>;
  error?: { code?: string; message?: string };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  items: T[];
  meta: PaginationMeta;
}

export interface ListQuery {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  status?: string;
  [key: string]: string | number | boolean | undefined;
}

const ACCESS_KEY = 'fleetops_access_token';
const REFRESH_KEY = 'fleetops_refresh_token';
const COMPANY_KEY = 'fleetops_company_id';

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(REFRESH_KEY);
}

export function getStoredCompanyId(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(COMPANY_KEY);
}

export function setStoredCompanyId(companyId: string | null): void {
  if (typeof window === 'undefined') return;
  if (companyId) window.localStorage.setItem(COMPANY_KEY, companyId);
  else window.localStorage.removeItem(COMPANY_KEY);
}

export function setTokens(access: string | null, refresh?: string | null): void {
  if (typeof window === 'undefined') return;
  if (access) window.localStorage.setItem(ACCESS_KEY, access);
  else window.localStorage.removeItem(ACCESS_KEY);
  if (refresh === undefined) return;
  if (refresh) window.localStorage.setItem(REFRESH_KEY, refresh);
  else window.localStorage.removeItem(REFRESH_KEY);
}

/** @deprecated use setTokens */
export function setAccessToken(token: string | null): void {
  setTokens(token, token ? getRefreshToken() : null);
}

export function clearSession(): void {
  setTokens(null, null);
  setStoredCompanyId(null);
}

function buildQuery(query?: ListQuery): string {
  if (!query) return '';
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    params.set(key, String(value));
  });
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
  options?: { companyId?: string | null; skipAuth?: boolean },
): Promise<T> {
  const { data } = await apiFetchRaw<T>(path, init, options);
  return data;
}

export async function apiFetchRaw<T>(
  path: string,
  init: RequestInit = {},
  options?: { companyId?: string | null; skipAuth?: boolean },
): Promise<{ data: T; meta?: PaginationMeta & Record<string, unknown> }> {
  const headers = new Headers(init.headers);
  if (!headers.has('Content-Type') && init.body) {
    headers.set('Content-Type', 'application/json');
  }

  if (!options?.skipAuth) {
    const token = getAccessToken();
    if (token) headers.set('Authorization', `Bearer ${token}`);
  }

  const companyId = options?.companyId === undefined ? getStoredCompanyId() : options.companyId;
  if (companyId) {
    headers.set('x-company-id', companyId);
  }

  const response = await fetch(`${appConfig.apiUrl}${path}`, {
    ...init,
    headers,
  });

  let payload: ApiEnvelope<T> | null = null;
  try {
    payload = (await response.json()) as ApiEnvelope<T>;
  } catch {
    // non-JSON
  }

  if (!response.ok) {
    throw new ApiError(
      payload?.error?.message ?? `Request failed (${response.status})`,
      response.status,
      payload?.error?.code,
    );
  }

  return {
    data: (payload?.data ?? payload) as T,
    meta: payload?.meta,
  };
}

export async function apiList<T>(
  path: string,
  query?: ListQuery,
  options?: { companyId?: string | null },
): Promise<PaginatedResult<T>> {
  const { data, meta } = await apiFetchRaw<T[]>(`${path}${buildQuery(query)}`, {}, options);
  return {
    items: data ?? [],
    meta: {
      page: Number(meta?.page ?? query?.page ?? 1),
      limit: Number(meta?.limit ?? query?.limit ?? 20),
      total: Number(meta?.total ?? data?.length ?? 0),
      totalPages: Number(meta?.totalPages ?? 1),
    },
  };
}

export { buildQuery };
