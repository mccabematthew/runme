const API_URL = 'https://3gcrejli3h.execute-api.us-east-1.amazonaws.com'

export async function getRuns() {
  const response = await fetch(`${API_URL}/runs`)
  if (!response.ok) throw new Error('Failed to fetch runs')
  return response.json()
}

export async function getRun(runId) {
  const response = await fetch(`${API_URL}/runs?runId=${runId}`)
  if (!response.ok) throw new Error('Failed to fetch run')
  return response.json()
}

export async function addRun(runData) {
  const response = await fetch(`${API_URL}/runs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(runData)
  })
  if (!response.ok) throw new Error('Failed to add run')
  return response.json()
}