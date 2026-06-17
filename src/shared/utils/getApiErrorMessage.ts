export const getApiErrorMessage = (error: unknown, fallback = 'Something went wrong'): string => {
  if (typeof error !== 'object' || error === null || !('message' in error)) {
    return fallback;
  }

  const apiMessage = (error as { message: unknown }).message;

  if (typeof apiMessage === 'string') {
    return apiMessage;
  }

  if (Array.isArray(apiMessage)) {
    return apiMessage.filter((item): item is string => typeof item === 'string').join(', ');
  }

  return fallback;
};
