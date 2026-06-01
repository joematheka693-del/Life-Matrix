const DEFAULT_API_URL = 'http://127.0.0.1:5000'

export function getApiBaseUrl() {
  return localStorage.getItem('life_matrix_backend_url') || DEFAULT_API_URL
}

async function request(path, options = {}) {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`)
  }

  return data
}

export const authApi = {
  health() {
    return request('/api/health')
  },

  register(payload) {
    return request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  login(payload) {
    return request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  me(token) {
    return request('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  },
}
