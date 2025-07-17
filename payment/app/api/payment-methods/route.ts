import { type NextRequest, NextResponse } from "next/server"

// Mock payment methods data
const paymentMethods = [
  {
    id: "pm_001",
    userId: "user_123",
    type: "card",
    cardType: "visa",
    last4: "4532",
    expiryMonth: 12,
    expiryYear: 2025,
    cardholderName: "John Doe",
    isDefault: true,
    isActive: true,
    createdAt: "2023-06-15T10:30:00Z",
    fingerprint: "fp_1234567890",
  },
  {
    id: "pm_002",
    userId: "user_123",
    type: "card",
    cardType: "mastercard",
    last4: "8901",
    expiryMonth: 8,
    expiryYear: 2026,
    cardholderName: "John Doe",
    isDefault: false,
    isActive: true,
    createdAt: "2023-08-22T14:15:00Z",
    fingerprint: "fp_0987654321",
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")
  const type = searchParams.get("type")
  const activeOnly = searchParams.get("activeOnly") === "true"

  try {
    let filteredMethods = [...paymentMethods]

    if (userId) {
      filteredMethods = filteredMethods.filter((pm) => pm.userId === userId)
    }

    if (type) {
      filteredMethods = filteredMethods.filter((pm) => pm.type === type)
    }

    if (activeOnly) {
      filteredMethods = filteredMethods.filter((pm) => pm.isActive)
    }

    // Sort by creation date (newest first), with default first
    filteredMethods.sort((a, b) => {
      if (a.isDefault && !b.isDefault) return -1
      if (!a.isDefault && b.isDefault) return 1
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    return NextResponse.json({
      paymentMethods: filteredMethods,
      total: filteredMethods.length,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch payment methods" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, type, cardNumber, expiryMonth, expiryYear, cardholderName, cvv } = body

    if (!userId || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate card details if type is card
    if (type === "card") {
      if (!cardNumber || !expiryMonth || !expiryYear || !cardholderName || !cvv) {
        return NextResponse.json({ error: "Missing card details" }, { status: 400 })
      }

      // Basic card validation
      if (cardNumber.length < 13 || cardNumber.length > 19) {
        return NextResponse.json({ error: "Invalid card number" }, { status: 400 })
      }
    }

    // Determine card type from number
    let cardType = "unknown"
    if (type === "card") {
      const firstDigit = cardNumber[0]
      if (firstDigit === "4") cardType = "visa"
      else if (firstDigit === "5") cardType = "mastercard"
      else if (firstDigit === "3") cardType = "amex"
    }

    const newPaymentMethod = {
      id: `pm_${Date.now()}`,
      userId,
      type,
      ...(type === "card" && {
        cardType,
        last4: cardNumber.slice(-4),
        expiryMonth: Number.parseInt(expiryMonth),
        expiryYear: Number.parseInt(expiryYear),
        cardholderName,
      }),
      isDefault: false,
      isActive: true,
      createdAt: new Date().toISOString(),
      fingerprint: `fp_${Date.now()}`,
    }

    // In a real app, tokenize and store securely
    console.log("New payment method created:", newPaymentMethod)

    return NextResponse.json({
      success: true,
      message: "Payment method added successfully",
      paymentMethod: newPaymentMethod,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to add payment method" }, { status: 500 })
  }
}
