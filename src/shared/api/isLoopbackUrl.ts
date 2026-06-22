const LOOPBACK_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]']);

export const isLoopbackUrl = (url?: string): boolean => {
  if (!url) {
    return false;
  }

  try {
    const { hostname } = new URL(url);
    return LOOPBACK_HOSTS.has(hostname);
  } catch {
    return false;
  }
};
