import type {
  User,
  LoginRequest,
  RegisterRequest,
  Transaction,
  Notification,
  PaymentMethod,
  PaymentLink,
  Merchant,
} from "@/types/api"

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    method: string,
    path: string,
    data?: any,
    headers?: HeadersInit
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`
    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    }

    // Only set body for methods that allow it
    if (data && method !== "GET" && method !== "HEAD") {
      options.body = JSON.stringify(data)
    }

    try {
      const response = await fetch(url, options)

      if (!response.ok) {
        let errorData: any
        try {
          errorData = await response.json()
        } catch (e) {
          errorData = { message: response.statusText || `HTTP error! status: ${response.status}` }
        }
        throw new Error(errorData.error || errorData.message || "Something went wrong")
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return {} as T
      }

      return await response.json()
    } catch (error) {
      console.error(`API request failed for ${method} ${path}:`, error)
      throw error
    }
  }

  // Auth Endpoints
  login(credentials: LoginRequest): Promise<User> {
    return this.request<User>("POST", "/auth/login", credentials)
  }

  register(data: RegisterRequest): Promise<User> {
    return this.request<User>("POST", "/auth/register", data)
  }

  logout(): Promise<{ message: string }> {
    return this.request<{ message: string }>("POST", "/auth/logout")
  }

  getCurrentUser(): Promise<User> {
    return this.request<User>("GET", "/auth/me")
  }

  // Transaction Endpoints
  getTransactions(data?: any): Promise<Transaction[]> {
    return this.request<Transaction[]>("GET", "/transactions", data)
  }

  getRecentTransactions(limit?: number): Promise<Transaction[]> {
    // If limit is provided, send as query param
    const query = limit ? `?limit=${limit}` : ""
    return this.request<Transaction[]>("GET", `/transactions/recent${query}`)
  }

  createTransaction(data: Transaction): Promise<Transaction> {
    return this.request<Transaction>("POST", "/transactions", data)
  }

  // Notification Endpoints
  getNotifications(data?: any): Promise<Notification[]> {
    return this.request<Notification[]>("GET", "/notifications", data)
  }

  markNotificationAsRead(id: string): Promise<void> {
    return this.request<void>("PUT", `/notifications/${id}/read`)
  }

  markAllNotificationsAsRead(): Promise<void> {
    return this.request<void>("PUT", "/notifications/read-all")
  }

  // Payment Method Endpoints
  getPaymentMethods(): Promise<PaymentMethod[]> {
    return this.request<PaymentMethod[]>("GET", "/payment-methods")
  }

  addPaymentMethod(data: PaymentMethod): Promise<PaymentMethod> {
    return this.request<PaymentMethod>("POST", "/payment-methods", data)
  }

  // Payment Link Endpoints
  getPaymentLinks(): Promise<PaymentLink[]> {
    return this.request<PaymentLink[]>("GET", "/payment-links")
  }

  createPaymentLink(data: PaymentLink): Promise<PaymentLink> {
    return this.request<PaymentLink>("POST", "/payment-links", data)
  }

  // Merchant Endpoints
  getMerchants(): Promise<Merchant[]> {
    return this.request<Merchant[]>("GET", "/merchants")
  }

  getMerchantById(id: string): Promise<Merchant> {
    return this.request<Merchant>("GET", `/merchants/${id}`)
  }

  createMerchant(data: Merchant): Promise<Merchant> {
    return this.request<Merchant>("POST", "/merchants", data)
  }

  updateMerchant(id: string, data: Merchant): Promise<Merchant> {
    return this.request<Merchant>("PUT", `/merchants/${id}`, data)
  }

  deleteMerchant(id: string): Promise<void> {
    return this.request<void>("DELETE", `/merchants/${id}`)
  }

  // User Endpoints (for admin)
  getUsers(): Promise<User[]> {
    return this.request<User[]>("GET", "/users")
  }

  getUserById(id: string): Promise<User> {
    return this.request<User>("GET", `/users/${id}`)
  }

  updateUser(id: string, data: User): Promise<User> {
    return this.request<User>("PUT", `/users/${id}`, data)
  }

  deleteUser(id: string): Promise<void> {
    return this.request<void>("DELETE", `/users/${id}`)
  }
}

// Use NEXT_PUBLIC_API_URL for client-side API calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api/proxy"
export const apiClient = new ApiClient(API_BASE_URL)
