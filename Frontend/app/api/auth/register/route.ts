import { type NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined in environment variables.")
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.debug("[API] /api/auth/register received body:", body)
    const backendRes = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
    let data = null
    try {
      data = await backendRes.clone().json()
      console.debug("[API] /api/auth/register backend response:", data)
    } catch (e) {
      console.debug("[API] /api/auth/register backend response not JSON or empty.")
    }
    return NextResponse.json(data, { status: backendRes.status })
  } catch (error) {
    console.error("[API] /api/auth/register error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
