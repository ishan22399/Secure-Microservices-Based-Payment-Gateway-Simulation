
import { type NextRequest, NextResponse } from "next/server"

// Backend API base URL (adjust as needed for your environment)
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

// Proxy GET /api/transactions (list, filter, paginate)
export async function GET(request: NextRequest) {
  try {
    const backendUrl = `${BACKEND_URL}/api/transactions${request.url.includes('?') ? request.url.substring(request.url.indexOf("?")) : ''}`;
    const backendRes = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(request.headers.get("authorization") && { "authorization": request.headers.get("authorization")! }),
      },
    });
    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Proxy POST /api/transactions (create/initiate transaction)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const backendRes = await fetch(`${BACKEND_URL}/api/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(request.headers.get("authorization") && { "authorization": request.headers.get("authorization")! }),
      },
      body: JSON.stringify(body),
    });
    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Proxy GET /api/transactions/:id (fetch transaction details)
export async function GET_BY_ID(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const backendRes = await fetch(`${BACKEND_URL}/api/transactions/${params.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(request.headers.get("authorization") && { "authorization": request.headers.get("authorization")! }),
      },
    });
    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Proxy PATCH /api/transactions/:id (update transaction, e.g. for refunds/disputes)
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const backendRes = await fetch(`${BACKEND_URL}/api/transactions/${params.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(request.headers.get("authorization") && { "authorization": request.headers.get("authorization")! }),
      },
      body: JSON.stringify(body),
    });
    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Proxy DELETE /api/transactions/:id (delete/cancel transaction)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const backendRes = await fetch(`${BACKEND_URL}/api/transactions/${params.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(request.headers.get("authorization") && { "authorization": request.headers.get("authorization")! }),
      },
    });
    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
