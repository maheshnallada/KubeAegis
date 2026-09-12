import type { QueryResponse } from './types'

const BASE_URL = import.meta.env.VITE_BACKEND_URL ?? '/api'

/** Legacy non-streaming call (kept for fallback/evals page) */
export async function queryRAG(q: string, threadId: string): Promise<QueryResponse> {
  const res = await fetch(`${BASE_URL}/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ q, thread_id: threadId }),
  })
  if (!res.ok) throw new Error(`Backend error: ${res.status}`)
  return res.json()
}

export interface StreamCallbacks {
  onToken: (token: string) => void
  onMetadata: (meta: Omit<QueryResponse, 'question' | 'answer'> & { is_blocked?: boolean }) => void
  onError: (err: string) => void
}

/**
 * Calls POST /query/stream and reads the SSE response.
 * Fires onToken for each text chunk, onMetadata once at the end.
 */
export async function queryRAGStream(
  q: string,
  threadId: string,
  callbacks: StreamCallbacks,
  signal?: AbortSignal,
): Promise<void> {
  const res = await fetch(`${BASE_URL}/query/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ q, thread_id: threadId }),
    signal,
  })

  if (!res.ok) throw new Error(`Backend error: ${res.status}`)
  if (!res.body) throw new Error('No response body for streaming')

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })

    // Process all complete SSE messages in the buffer
    const parts = buffer.split('\n\n')
    buffer = parts.pop() ?? '' // last part may be incomplete

    for (const part of parts) {
      if (!part.trim()) continue

      // Parse event type and data from the SSE block
      let eventType = 'message'
      let dataLine = ''

      for (const line of part.split('\n')) {
        if (line.startsWith('event: ')) eventType = line.slice(7).trim()
        else if (line.startsWith('data: ')) dataLine = line.slice(6)
      }

      if (!dataLine) continue

      if (eventType === 'metadata') {
        try { callbacks.onMetadata(JSON.parse(dataLine)) } catch { /* ignore */ }
      } else if (eventType === 'error') {
        try { callbacks.onError(JSON.parse(dataLine)) } catch { callbacks.onError(dataLine) }
      } else {
        // Regular token — dataLine is a JSON-encoded string
        try { callbacks.onToken(JSON.parse(dataLine)) } catch { callbacks.onToken(dataLine) }
      }
    }
  }
}

export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/`, { signal: AbortSignal.timeout(3000) })
    return res.ok
  } catch {
    return false
  }
}
