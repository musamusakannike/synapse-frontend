interface User {
  id: string
  fullName: string
  email: string
  isEmailVerified: boolean
}

interface AuthResponse {
  token: string
  user: User
  message: string
}

class AuthService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

  getToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem("synapse_token")
  }

  setToken(token: string): void {
    if (typeof window === "undefined") return
    localStorage.setItem("synapse_token", token)
  }

  removeToken(): void {
    if (typeof window === "undefined") return
    localStorage.removeItem("synapse_token")
  }

  async register(fullName: string, email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fullName, email, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Registration failed")
    }

    return response.json()
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Login failed")
    }

    const data = await response.json()
    this.setToken(data.token)
    return data
  }

  async getProfile(): Promise<User> {
    const token = this.getToken()
    if (!token) throw new Error("No token found")

    const response = await fetch(`${this.baseUrl}/api/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        this.removeToken()
        throw new Error("Session expired")
      }
      throw new Error("Failed to get profile")
    }

    const data = await response.json()
    return data.user
  }

  async verifyEmail(token: string): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/api/auth/verify-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Email verification failed")
    }

    const data = await response.json()
    this.setToken(data.token)
    return data
  }

  async resendVerification(email: string): Promise<{ message: string }> {
    const response = await fetch(`${this.baseUrl}/api/auth/resend-verification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to resend verification")
    }

    return response.json()
  }

  logout(): void {
    this.removeToken()
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }
}

export const authService = new AuthService()
export type { User, AuthResponse }
