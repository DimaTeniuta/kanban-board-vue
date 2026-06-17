export const API_ROUTES = {
  register: (): string => '/auth/register',
  login: (): string => '/auth/login',
  refreshToken: (): string => '/auth/refresh-token',
  logout: (): string => '/auth/logout',
  boards: (): string => '/boards',
  boardById: (id: string): string => `/boards/${id}`
} as const;
