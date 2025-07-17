import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const merchantId = searchParams.get("merchantId")

  try {
    const paymentLinks = [
      {
        id: "PL_001",
        title: "Premium Subscription",
        description: "Monthly premium plan subscription",
        amount: 29.99,
        currency: "USD",
        status: "active",
        createdAt: "2024-01-01T10:00:00Z",
        expiresAt: "2024-12-31T23:59:59Z",
        usageCount: 45,
        maxUsage: 100,
        url: "https://pay.securegateway.com/pl_001",
      },
      {
        id: "PL_002",
        title: "Product Purchase",
        description: "One-time product payment",
        amount: 199.99,
        currency: "USD",
        status: "active",
        createdAt: "2024-01-05T14:30:00Z",
        usageCount: 12,
        url: "https://pay.securegateway.com/pl_002",
      },
    ]

    return NextResponse.json({
      paymentLinks,
      total: paymentLinks.length,
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, amount, currency, merchantId, maxUsage, expiresAt } = body

    const newPaymentLink = {
      id: `PL_${Date.now()}`,
      title,
      description,
      amount,
      currency,
      merchantId,
      status: "active",
      createdAt: new Date().toISOString(),
      expiresAt,
      usageCount: 0,
      maxUsage,
      url: `https://pay.securegateway.com/pl_${Date.now()}`,
    }

    return NextResponse.json({
      paymentLink: newPaymentLink,
      message: "Payment link created successfully",
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
