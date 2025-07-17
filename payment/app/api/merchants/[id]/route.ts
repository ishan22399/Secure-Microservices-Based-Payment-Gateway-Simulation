import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const merchantId = params.id

    // Mock merchant data
    const merchant = {
      id: merchantId,
      name: "Amazon Store",
      email: "payments@amazon.com",
      status: "active",
      businessType: "e-commerce",
      monthlyVolume: 2400000,
      transactionCount: 12847,
      joinDate: "2023-01-15",
      riskLevel: "low",
      contactInfo: {
        phone: "+1-555-0123",
        address: {
          street: "123 Commerce St",
          city: "Seattle",
          state: "WA",
          zipCode: "98101",
          country: "US",
        },
      },
      businessInfo: {
        taxId: "12-3456789",
        website: "https://amazon.com",
        description: "Global e-commerce marketplace",
      },
      paymentSettings: {
        processingFee: 2.9,
        settlementPeriod: "daily",
        currencies: ["USD", "EUR", "GBP"],
      },
      analytics: {
        last30Days: {
          revenue: 850000,
          transactions: 4250,
          averageTransaction: 200,
          successRate: 98.5,
        },
        topProducts: [
          { name: "Electronics", revenue: 340000, percentage: 40 },
          { name: "Books", revenue: 255000, percentage: 30 },
          { name: "Clothing", revenue: 170000, percentage: 20 },
          { name: "Home & Garden", revenue: 85000, percentage: 10 },
        ],
      },
    }

    return NextResponse.json({ merchant })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch merchant" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const merchantId = params.id
    const body = await request.json()

    // In a real app, update merchant in database
    console.log("Updating merchant:", merchantId, body)

    return NextResponse.json({
      success: true,
      message: "Merchant updated successfully",
      merchantId,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update merchant" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const merchantId = params.id

    // In a real app, soft delete or deactivate merchant
    console.log("Deleting merchant:", merchantId)

    return NextResponse.json({
      success: true,
      message: "Merchant deleted successfully",
      merchantId,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete merchant" }, { status: 500 })
  }
}
