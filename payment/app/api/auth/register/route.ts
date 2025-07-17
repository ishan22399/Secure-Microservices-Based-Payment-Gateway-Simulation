import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role, companyName } = await request.json()

    // Simulate user creation
    const newUser = {
      id: Date.now().toString(),
      email,
      name,
      role,
      permissions: getPermissionsByRole(role),
      ...(role === "merchant" && { merchantId: `MERCH_${Date.now()}` }),
      ...(role === "bank_admin" && { bankId: `BANK_${Date.now()}` }),
      ...(companyName && { companyName }),
    }

    // Generate mock JWT token
    const token = `mock_jwt_token_${newUser.id}_${Date.now()}`

    return NextResponse.json({
      user: newUser,
      token,
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function getPermissionsByRole(role: string) {
  switch (role) {
    case "customer":
      return ["view_transactions", "make_payments"]
    case "merchant":
      return ["view_transactions", "manage_payments", "view_analytics"]
    case "bank_admin":
      return ["full_access", "manage_users", "system_admin"]
    default:
      return []
  }
}
