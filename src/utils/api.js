const API_BASE = import.meta.env.VITE_API_URL || ''

export async function generateStory(prompt) {
  const res = await fetch(`${API_BASE}/api/story`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  })
  if (!res.ok) throw new Error('Story generation failed')
  return res.json()
}

export async function saveStory(data) {
  const res = await fetch(`${API_BASE}/api/stories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to save story')
  return res.json()
}

export async function getStories(params = {}) {
  const query = new URLSearchParams(params).toString()
  const res = await fetch(`${API_BASE}/api/stories${query ? '?' + query : ''}`)
  if (!res.ok) throw new Error('Failed to fetch stories')
  return res.json()
}

export async function getStory(id) {
  const res = await fetch(`${API_BASE}/api/stories/${id}`)
  if (!res.ok) throw new Error('Failed to fetch story')
  return res.json()
}

export async function getAnalytics() {
  const res = await fetch(`${API_BASE}/api/analytics`)
  if (!res.ok) throw new Error('Failed to fetch analytics')
  return res.json()
}

export async function verifyTeacherPin(pin) {
  const res = await fetch(`${API_BASE}/api/teacher/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pin }),
  })
  return res.status === 200
}
