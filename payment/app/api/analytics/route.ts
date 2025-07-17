import { type NextRequest, NextResponse } from "next/server"

// Mock analytics data
const analyticsData = {
  revenue: {
    daily: [
      { date: "2024-01-01", amount: 12500.5 },
      { date: "2024-01-02", amount: 15200.75 },
      { date: "2024-01-03", amount: 18900.25 },
      { date: "2024-01-04", amount: 14300.0 },
      { date: "2024-01-05", amount: 16750.8 },
      { date: "2024-01-06", amount: 19200.45 },
      { date: "2024-01-07", amount: 21500.9 },
    ],
    monthly: [
      { month: "2023-07", amount: 450000 },
      { month: "2023-08", amount: 520000 },
      { month: "2023-09", amount: 480000 },
      { month: "2023-10", amount: 610000 },
      { month: "2023-11", amount: 580000 },
      { month: "2023-12", amount: 720000 },
      { month: "2024-01", amount: 650000 },
    ],
  },
  transactions: {
    volume: {
      total: 125847,
      successful: 124892,
      failed: 955,
      pending: 234,
    },
    byPaymentMethod: [
      { method: "Visa", count: 45230, percentage: 35.9 },
      { method: "Mastercard", count: 38920, percentage: 30.9 },
      { method: "American Express", count: 18450, percentage: 14.7 },
      { method: "PayPal", count: 12890, percentage: 10.2 },
      { method: "Apple Pay", count: 8920, percentage: 7.1 },
      { method: "Google Pay", count: 1437, percentage: 1.1 },
    ],
    byCategory: [
      { category: "E-commerce", count: 52340, amount: 2840000 },
      { category: "Subscription", count: 28450, amount: 890000 },
      { category: "Digital Services", count: 19230, amount: 1250000 },
      { category: "Food & Beverage", count: 15670, amount: 450000 },
      { category: "Transportation", count: 10157, amount: 320000 },
    ],
  },
  performance: {
    responseTime: {
      average: 45,
      p95: 120,
      p99: 250,
    },
    uptime: 99.97,
    errorRate: 0.03,
    throughput: 1247,
  },
  geography: [
    { country: "United States", transactions: 45230, revenue: 1250000 },
    { country: "Canada", transactions: 18920, revenue: 520000 },
    { country: "United Kingdom", transactions: 15670, revenue: 480000 },
    { country: "Germany", transactions: 12340, revenue: 390000 },
    { country: "France", transactions: 9870, revenue: 310000 },
    { country: "Australia", transactions: 8450, revenue: 280000 },
    { country: "Japan", transactions: 7230, revenue: 240000 },
  ],
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type") || "overview"
  const period = searchParams.get("period") || "7d"
  const merchantId = searchParams.get("merchantId")

  try {
    let responseData = analyticsData

    // Filter by merchant if specified
    if (merchantId) {
      // In a real app, filter data by merchant
      responseData = {
        ...analyticsData,
        revenue: {
          ...analyticsData.revenue,
          daily: analyticsData.revenue.daily.map((item) => ({
            ...item,
            amount: item.amount * 0.1, // Simulate merchant-specific data
          })),
        },
      }
    }

    // Filter by type
    switch (type) {
      case "revenue":
        return NextResponse.json({
          data: responseData.revenue,
          period,
          generatedAt: new Date().toISOString(),
        })
      case "transactions":
        return NextResponse.json({
          data: responseData.transactions,
          period,
          generatedAt: new Date().toISOString(),
        })
      case "performance":
        return NextResponse.json({
          data: responseData.performance,
          period,
          generatedAt: new Date().toISOString(),
        })
      case "geography":
        return NextResponse.json({
          data: responseData.geography,
          period,
          generatedAt: new Date().toISOString(),
        })
      default:
        return NextResponse.json({
          data: responseData,
          period,
          generatedAt: new Date().toISOString(),
        })
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch analytics data" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { event, data } = body

    // Mock analytics event tracking
    console.log("Analytics event tracked:", { event, data, timestamp: new Date() })

    return NextResponse.json({
      success: true,
      message: "Analytics event tracked successfully",
      eventId: `evt_${Date.now()}`,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to track analytics event" }, { status: 500 })
  }
}
