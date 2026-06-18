export const API_ROUTES = {
  register: (): string => '/auth/register',
  login: (): string => '/auth/login',
  refreshToken: (): string => '/auth/refresh-token',
  logout: (): string => '/auth/logout',
  boards: (): string => '/boards',
  boardById: (id: string): string => `/boards/${id}`,
  columns: (boardId: string): string => `/boards/${boardId}/columns`,
  columnById: (boardId: string, columnId: string): string => `/boards/${boardId}/columns/${columnId}`,
  columnOrder: (boardId: string, columnId: string): string => `/boards/${boardId}/columns/${columnId}/order`,
  tasks: (boardId: string, columnId: string): string => `/boards/${boardId}/columns/${columnId}/tasks`,
  taskById: (boardId: string, columnId: string, taskId: string): string =>
    `/boards/${boardId}/columns/${columnId}/tasks/${taskId}`,
  taskOrder: (boardId: string, columnId: string, taskId: string): string =>
    `/boards/${boardId}/columns/${columnId}/tasks/${taskId}/order`
} as const;
