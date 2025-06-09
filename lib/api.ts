import { authService } from "./auth"

interface AnalysisResponse {
  summary: string
  conversationId: string
  websiteTitle: string
  url: string
}

interface ChatResponse {
  answer: string
  question: string
  conversationId: string
}

interface Conversation {
  _id: string
  url: string
  websiteTitle: string
  summary: string
  createdAt: string
  messages: Array<{
    type: "question" | "answer"
    content: string
    timestamp: string
  }>
}

class ApiService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const token = authService.getToken()

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        authService.removeToken()
        throw new Error("Session expired. Please login again.")
      }
      const error = await response.json()
      throw new Error(error.message || "Request failed")
    }

    return response.json()
  }

  async analyzeWebsite(url: string, useJavaScript = false): Promise<AnalysisResponse> {
    return this.makeRequest("/api/ai/analyze", {
      method: "POST",
      body: JSON.stringify({ url, useJavaScript }),
    })
  }

  async askQuestion(conversationId: string, question: string): Promise<ChatResponse> {
    return this.makeRequest(`/api/ai/chat/${conversationId}`, {
      method: "POST",
      body: JSON.stringify({ question }),
    })
  }

  async getConversations(): Promise<{ conversations: Conversation[] }> {
    return this.makeRequest("/api/ai/conversations")
  }

  async getConversation(id: string): Promise<{ conversation: Conversation }> {
    return this.makeRequest(`/api/ai/conversations/${id}`)
  }

  async deleteConversation(id: string): Promise<{ message: string }> {
    return this.makeRequest(`/api/ai/conversations/${id}`, {
      method: "DELETE",
    })
  }

  async healthCheck(): Promise<{ message: string }> {
    return this.makeRequest("/api/health")
  }
}

export const apiService = new ApiService()
export type { AnalysisResponse, ChatResponse, Conversation }
