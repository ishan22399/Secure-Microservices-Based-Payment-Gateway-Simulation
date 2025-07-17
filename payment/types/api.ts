export type UserRole = "CUSTOMER" | "MERCHANT" | "BANK_ADMIN"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  companyName?: string
  permissions: string[] // e.g., ["READ_TRANSACTIONS", "CREATE_TRANSACTION"]
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  role: UserRole
  companyName?: string
}

export interface AuthResponse {
  user: User | null
  message: string
  authenticated: boolean
}

export interface Transaction {
  id: string
  merchantId: string
  merchantName: string
  amount: number
  currency: string
  status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED"
  paymentMethod: string
  description?: string
  category?: string
  transactionDate: string // ISO date string
}

export interface Notification {
  id: string
  userId: string
  message: string
  type: "INFO" | "WARNING" | "ERROR" | "SUCCESS"
  read: boolean
  timestamp: string // ISO date string
}

export interface PaymentMethod {
  id: string
  userId: string
  type: "CREDIT_CARD" | "DEBIT_CARD" | "BANK_TRANSFER" | "PAYPAL"
  lastFour: string
  expiryDate: string // MM/YY
  isDefault: boolean
  cardHolderName?: string
  bankName?: string
}

export interface PaymentLink {
  id: string
  merchantId: string
  amount: number
  currency: string
  description?: string
  status: "ACTIVE" | "EXPIRED" | "PAID"
  createdAt: string
  expiresAt: string
  linkUrl: string
}

export interface Merchant {
  id: string
  name: string
  email: string
  companyName: string
  status: "ACTIVE" | "PENDING" | "SUSPENDED"
  createdAt: string
  lastLogin: string
}
