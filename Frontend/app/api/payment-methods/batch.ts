import { type NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined in environment variables.")
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const backendRes = await fetch(`${API_BASE_URL}/payment-methods/batch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
    const data = await backendRes.json()
    return NextResponse.json(data, { status: backendRes.status })
  } catch (error) {
    return NextResponse.json({ error: "Failed to process batch operation" }, { status: 500 })
  }
}
