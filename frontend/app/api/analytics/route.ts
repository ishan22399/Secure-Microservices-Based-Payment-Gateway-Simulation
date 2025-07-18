import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase-client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type") || "overview"
  const period = searchParams.get("period") || "7d"
  const merchantId = searchParams.get("merchantId")

  try {
    let query = supabase.from('transactions').select('*')

    if (merchantId) {
      query = query.eq('merchantId', merchantId)
    }

    const { data: transactions, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // This is a simplified analytics generation. In a real app, you'd likely use a dedicated analytics service or more complex queries.
    const analyticsData = generateAnalytics(transactions, period)

    switch (type) {
      case "revenue":
        return NextResponse.json({ data: analyticsData.revenue, period, generatedAt: new Date().toISOString() })
      case "transactions":
        return NextResponse.json({ data: analyticsData.transactions, period, generatedAt: new Date().toISOString() })
      case "performance":
        return NextResponse.json({ data: analyticsData.performance, period, generatedAt: new Date().toISOString() })
      case "geography":
        return NextResponse.json({ data: analyticsData.geography, period, generatedAt: new Date().toISOString() })
      default:
        return NextResponse.json({ data: analyticsData, period, generatedAt: new Date().toISOString() })
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch analytics data" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const eventData = await request.json()

    const { data: newEvent, error } = await supabase
      .from('analytics_events')
      .insert([eventData])
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "Analytics event tracked successfully",
      event: newEvent,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to track analytics event" }, { status: 500 })
  }
}

function generateAnalytics(transactions: any[], period: string) {
  // This is a placeholder for a more sophisticated analytics generation function.
  // You would replace this with your actual analytics logic.
  return {
    revenue: { daily: [], monthly: [] },
    transactions: { volume: {}, byPaymentMethod: [], byCategory: [] },
    performance: { responseTime: {}, uptime: 0, errorRate: 0, throughput: 0 },
    geography: [],
  }
}
