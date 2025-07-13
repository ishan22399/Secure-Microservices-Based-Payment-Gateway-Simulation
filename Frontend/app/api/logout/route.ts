import { type NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined in environment variables.")
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const backendRes = await fetch(`${API_BASE_URL}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
    const data = await backendRes.json()
    const response = NextResponse.json(data, { status: backendRes.status })

    // If backend logout is successful, clear auth_token cookie
    if (backendRes.ok) {
      response.cookies.set("auth_token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 0,
      })
    }

    return response
  } catch (error) {
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 })
  }
}
