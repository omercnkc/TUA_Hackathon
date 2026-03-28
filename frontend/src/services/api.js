import axios from 'axios'

/** Dev: Vite proxy /api → backend. Prod: set VITE_API_URL to API origin (no trailing slash). */
const baseURL = import.meta.env.VITE_API_URL ?? '/api'

export const api = axios.create({
  baseURL,
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
})

export async function fetchSpaceBases() {
  const { data } = await api.get('/space-bases')
  return data.bases
}

export async function postPredict(payload) {
  const { data } = await api.post('/predict', payload)
  return data
}
