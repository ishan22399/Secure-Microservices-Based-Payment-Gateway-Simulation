import { type NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

// Batch create or update transactions
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const backendRes = await fetch(`${BACKEND_URL}/api/transactions/batch`, {
      method: "PUT",
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

// Search transactions
export async function SEARCH(request: NextRequest) {
  try {
    const body = await request.json();
    const backendRes = await fetch(`${BACKEND_URL}/api/transactions/search`, {
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

// Export transactions
export async function EXPORT(request: NextRequest) {
  try {
    const backendRes = await fetch(`${BACKEND_URL}/api/transactions/export`, {
      method: "GET",
      headers: {
        ...(request.headers.get("authorization") && { "authorization": request.headers.get("authorization")! }),
      },
    });
    const blob = await backendRes.blob();
    return new NextResponse(blob, {
      status: backendRes.status,
      headers: {
        "Content-Type": backendRes.headers.get("Content-Type") || "application/octet-stream",
        "Content-Disposition": backendRes.headers.get("Content-Disposition") || "attachment; filename=transactions_export.csv"
      }
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
