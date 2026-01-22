// client/lib/api.ts

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

// --------------------
// Helper
// --------------------
async function request(
  url: string,
  options: RequestInit = {},
  token?: string
) {
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'API Error')
  }

  return res.json()
}

// --------------------
// AUTH
// --------------------
export async function login(email: string, password: string) {
  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  })
}

export async function register(name: string, email: string, password: string) {
  return request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password })
  })
}

// --------------------
// QUESTIONS
// --------------------
export async function getQuestions(token: string) {
  return request('/api/questions', { method: 'GET' }, token)
}

// --------------------
// GAME SESSION
// --------------------
export async function saveGameSession(
  token: string,
  data: {
    score: number
    physicsCorrect: number
    chemistryCorrect: number
    totalQuestions: number
    timeSpent: number
  }
) {
  return request(
    '/api/game/save',
    {
      method: 'POST',
      body: JSON.stringify(data)
    },
    token
  )
}

// --------------------
// DASHBOARD STATS
// --------------------
export async function getGameStats(token: string) {
  return request('/api/game/stats', { method: 'GET' }, token)
}
