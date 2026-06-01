import { getApiBaseUrl } from './authApi.js'

async function request(path, token, options = {}) {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`)
  }

  return data
}

export const syncApi = {
  pushBackup(token, payload) {
    return request('/api/sync/backup', token, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  pullBackup(token) {
    return request('/api/sync/backup', token)
  },
}
