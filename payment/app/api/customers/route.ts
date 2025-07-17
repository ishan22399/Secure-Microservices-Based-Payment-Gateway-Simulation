import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const merchantId = searchParams.get("merchantId")

  try {
    // Mock customer data
    const customers = [
      {
        id: "CUST_001",
        name: "John Smith",
        email: "john.smith@email.com",
        phone: "+1-555-0123",
        location: "New York, NY",
        totalSpent: 2450.0,
        transactionCount: 12,
        lastTransaction: "2024-01-10T14:32:15Z",
        status: "active",
        joinDate: "2023-06-15T10:00:00Z",
      },
      {
        id: "CUST_002",
        name: "Sarah Johnson",
        email: "sarah.j@email.com",
        phone: "+1-555-0456",
        location: "Los Angeles, CA",
        totalSpent: 1890.5,
        transactionCount: 8,
        lastTransaction: "2024-01-08T09:15:30Z",
        status: "active",
        joinDate: "2023-08-22T14:30:00Z",
      },
      {
        id: "CUST_003",
        name: "Mike Wilson",
        email: "mike.wilson@email.com",
        totalSpent: 750.25,
        transactionCount: 3,
        lastTransaction: "2023-12-20T16:45:00Z",
        status: "inactive",
        joinDate: "2023-11-10T11:20:00Z",
      },
    ]

    return NextResponse.json({
      customers,
      total: customers.length,
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
