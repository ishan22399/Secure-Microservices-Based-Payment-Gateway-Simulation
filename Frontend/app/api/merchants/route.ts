import { type NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

export async function GET(request: NextRequest) {
  try {
    const backendRes = await fetch(`${BACKEND_URL}/api/merchants`, {
      method: "GET",
      headers: {
        ...(request.headers.get("authorization") && { "authorization": request.headers.get("authorization")! }),
      },
    });
    let data;
    try {
      data = await backendRes.json();
    } catch (e) {
      data = { error: "Invalid backend response" };
    }
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const backendRes = await fetch(`${BACKEND_URL}/api/merchants`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(request.headers.get("authorization") && { "authorization": request.headers.get("authorization")! }),
      },
      body: JSON.stringify(body),
    });
    let data;
    try {
      data = await backendRes.json();
    } catch (e) {
      data = { error: "Invalid backend response" };
    }
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
