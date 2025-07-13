import { type NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined in environment variables.")
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const merchantId = params.id
    const url = `${API_BASE_URL}/merchants/${merchantId}`
    const backendRes = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    const data = await backendRes.json()
    return NextResponse.json(data, { status: backendRes.status })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch merchant" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const merchantId = params.id
    const body = await request.json()
    const url = `${API_BASE_URL}/merchants/${merchantId}`
    const backendRes = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
    const data = await backendRes.json()
    return NextResponse.json(data, { status: backendRes.status })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update merchant" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const merchantId = params.id
    const url = `${API_BASE_URL}/merchants/${merchantId}`
    const backendRes = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
    const data = await backendRes.json()
    return NextResponse.json(data, { status: backendRes.status })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete merchant" }, { status: 500 })
  }
}
