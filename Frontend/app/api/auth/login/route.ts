import { type NextRequest, NextResponse } from "next/server"

// Mock user database
const users = [
  {
    id: "1",
    email: "customer@demo.com",
    password: "demo123",
    name: "John Customer",
    role: "customer",
    permissions: ["view_transactions", "make_payments"],
  },
  {
    id: "2",
    email: "merchant@demo.com",
    password: "demo123",
    name: "Jane Merchant",
    role: "merchant",
    merchantId: "MERCH_001",
    permissions: ["view_transactions", "manage_payments", "view_analytics"],
  },
  {
    id: "3",
    email: "admin@demo.com",
    password: "demo123",
    name: "Admin User",
    role: "bank_admin",
    bankId: "BANK_001",
    permissions: ["full_access", "manage_users", "system_admin"],
  },
]

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Find user
    const user = users.find((u) => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Generate mock JWT token
    const token = `mock_jwt_token_${user.id}_${Date.now()}`

    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      user: userWithoutPassword,
      token,
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
