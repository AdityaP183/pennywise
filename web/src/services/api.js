const BASE_URL = '/api/v1';

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}

function onRefreshed() {
  refreshSubscribers.forEach((cb) => cb());
  refreshSubscribers = [];
}

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
    credentials: 'include', // Propagate HTTPOnly cookies automatically
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);

    // 204 No Content
    if (response.status === 204) {
      return null;
    }

    const data = await response.json();

    if (!response.ok) {
      // Check for token expiration and try refreshing
      if (
        response.status === 401 &&
        endpoint !== '/auth/login' &&
        endpoint !== '/auth/register' &&
        endpoint !== '/auth/refresh'
      ) {
        if (!isRefreshing) {
          isRefreshing = true;
          try {
            const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
              method: 'POST',
              credentials: 'include',
            });

            if (refreshRes.ok) {
              isRefreshing = false;
              onRefreshed();
              return request(endpoint, options);
            }
          } catch (refreshErr) {
            console.error('Auto token refresh failed:', refreshErr);
          }
          isRefreshing = false;
          // Trigger logout if token refresh fails
          window.dispatchEvent(new Event('auth-logout'));
        } else {
          // Queue requests during refreshing
          return new Promise((resolve) => {
            subscribeTokenRefresh(() => {
              resolve(request(endpoint, options));
            });
          });
        }
      }

      throw new ApiError(data.message || 'Request failed', response.status, data);
    }

    return data.data; // Extract backend standard payload "data"
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(error.message || 'Network error occurred', 500);
  }
}

export const api = {
  get: (endpoint, options) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options) => request(endpoint, { ...options, method: 'POST', body }),
  put: (endpoint, body, options) => request(endpoint, { ...options, method: 'PUT', body }),
  patch: (endpoint, body, options) => request(endpoint, { ...options, method: 'PATCH', body }),
  delete: (endpoint, options) => request(endpoint, { ...options, method: 'DELETE' }),
};
