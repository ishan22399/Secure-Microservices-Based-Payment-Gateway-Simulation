
import { type NextRequest, NextResponse } from "next/server"

// Backend API base URL (adjust as needed for your environment)
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Forward the login request to the backend
    const backendRes = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(request.headers.get("authorization") && { "authorization": request.headers.get("authorization")! }),
      },
      body: JSON.stringify(body),
    });

    // Handle backend errors (e.g., invalid credentials, locked account)
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
