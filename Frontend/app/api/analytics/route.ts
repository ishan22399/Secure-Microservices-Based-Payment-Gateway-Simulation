import { type NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type") || "overview"
  const period = searchParams.get("period") || "7d"
  const merchantId = searchParams.get("merchantId")

  try {
    // Build backend URL with query params
    const url = new URL("/analytics", API_BASE_URL)
    if (type) url.searchParams.set("type", type)
    if (period) url.searchParams.set("period", period)
    if (merchantId) url.searchParams.set("merchantId", merchantId)

    const backendRes = await fetch(url.toString())
    const backendData = await backendRes.json()
    return NextResponse.json(backendData, { status: backendRes.status })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch analytics data" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { event, data } = body

    // Forward event to backend
    const url = `${API_BASE_URL}/analytics/events`
    const backendRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, data }),
    })
    const backendData = await backendRes.json()
    return NextResponse.json(backendData, { status: backendRes.status })
  } catch (error) {
    return NextResponse.json({ error: "Failed to track analytics event" }, { status: 500 })
  }
}
