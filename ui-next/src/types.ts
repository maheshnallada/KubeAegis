export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  thoughtProcess?: string[]
  sources?: string[]
  status?: string
  isLoading?: boolean
  isBlocked?: boolean
}

export interface Session {
  id: string
  label: string
  createdAt: Date
  messageCount: number
  preview: string
}

export interface QueryResponse {
  question: string
  answer: string
  thought_process: string[]
  status: string
  sources: string[]
}
