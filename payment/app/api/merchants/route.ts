import { type NextRequest, NextResponse } from "next/server"

// Mock merchant data
const merchants = [
  {
    id: "MERCH_001",
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
  },
  {
    id: "MERCH_002",
    name: "Netflix Inc.",
    email: "billing@netflix.com",
    status: "active",
    businessType: "subscription",
    monthlyVolume: 890000,
    transactionCount: 45231,
    joinDate: "2023-03-22",
    riskLevel: "low",
    contactInfo: {
      phone: "+1-555-0456",
      address: {
        street: "100 Winchester Circle",
        city: "Los Gatos",
        state: "CA",
        zipCode: "95032",
        country: "US",
      },
    },
    businessInfo: {
      taxId: "98-7654321",
      website: "https://netflix.com",
      description: "Streaming entertainment service",
    },
    paymentSettings: {
      processingFee: 2.5,
      settlementPeriod: "weekly",
      currencies: ["USD"],
    },
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")
  const riskLevel = searchParams.get("riskLevel")
  const businessType = searchParams.get("businessType")
  const search = searchParams.get("search")
  const limit = Number.parseInt(searchParams.get("limit") || "20")
  const offset = Number.parseInt(searchParams.get("offset") || "0")

  try {
    let filteredMerchants = [...merchants]

    // Apply filters
    if (status) {
      filteredMerchants = filteredMerchants.filter((m) => m.status === status)
    }

    if (riskLevel) {
      filteredMerchants = filteredMerchants.filter((m) => m.riskLevel === riskLevel)
    }

    if (businessType) {
      filteredMerchants = filteredMerchants.filter((m) => m.businessType === businessType)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filteredMerchants = filteredMerchants.filter(
        (m) =>
          m.name.toLowerCase().includes(searchLower) ||
          m.email.toLowerCase().includes(searchLower) ||
          m.id.toLowerCase().includes(searchLower),
      )
    }

    // Sort by join date (newest first)
    filteredMerchants.sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime())

    const paginatedMerchants = filteredMerchants.slice(offset, offset + limit)

    return NextResponse.json({
      merchants: paginatedMerchants,
      total: filteredMerchants.length,
      hasMore: offset + limit < filteredMerchants.length,
      summary: {
        totalMerchants: merchants.length,
        activeMerchants: merchants.filter((m) => m.status === "active").length,
        totalVolume: merchants.reduce((sum, m) => sum + m.monthlyVolume, 0),
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch merchants" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, businessType, contactInfo, businessInfo, paymentSettings } = body

    // Validate required fields
    if (!name || !email || !businessType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create new merchant
    const newMerchant = {
      id: `MERCH_${Date.now()}`,
      name,
      email,
      status: "pending",
      businessType,
      monthlyVolume: 0,
      transactionCount: 0,
      joinDate: new Date().toISOString().split("T")[0],
      riskLevel: "medium",
      contactInfo: contactInfo || {},
      businessInfo: businessInfo || {},
      paymentSettings: {
        processingFee: 2.9,
        settlementPeriod: "daily",
        currencies: ["USD"],
        ...paymentSettings,
      },
    }

    // In a real app, save to database
    console.log("New merchant created:", newMerchant)

    return NextResponse.json({
      success: true,
      message: "Merchant created successfully",
      merchant: newMerchant,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create merchant" }, { status: 500 })
  }
}
