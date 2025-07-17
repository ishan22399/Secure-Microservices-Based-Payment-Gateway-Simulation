import { type NextRequest, NextResponse } from "next/server"

// Mock transaction data
const transactions = [
  {
    id: "TXN-001",
    customerId: "1",
    merchantId: "MERCH_001",
    merchantName: "Amazon Store",
    amount: 299.99,
    currency: "USD",
    status: "completed",
    timestamp: "2024-01-10T14:32:15Z",
    paymentMethod: "Visa ****4532",
    description: "Online purchase",
    category: "Shopping",
  },
  {
    id: "TXN-002",
    customerId: "1",
    merchantId: "MERCH_002",
    merchantName: "Netflix",
    amount: 15.99,
    currency: "USD",
    status: "completed",
    timestamp: "2024-01-09T10:15:30Z",
    paymentMethod: "Mastercard ****8901",
    description: "Monthly subscription",
    category: "Entertainment",
  },
  // Add more mock transactions...
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")
  const role = searchParams.get("role")
  const limit = Number.parseInt(searchParams.get("limit") || "10")
  const offset = Number.parseInt(searchParams.get("offset") || "0")

  try {
    let filteredTransactions = transactions

    // Filter based on user role and ID
    if (role === "customer" && userId) {
      filteredTransactions = transactions.filter((t) => t.customerId === userId)
    } else if (role === "merchant" && userId) {
      filteredTransactions = transactions.filter((t) => t.merchantId === userId)
    }
    // Bank admins can see all transactions

    // Pagination
    const paginatedTransactions = filteredTransactions.slice(offset, offset + limit)

    return NextResponse.json({
      transactions: paginatedTransactions,
      total: filteredTransactions.length,
      hasMore: offset + limit < filteredTransactions.length,
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const transactionData = await request.json()

    // Simulate transaction processing
    const newTransaction = {
      id: `TXN-${Date.now()}`,
      ...transactionData,
      status: "processing",
      timestamp: new Date().toISOString(),
    }

    // Simulate processing delay
    setTimeout(() => {
      // Update status to completed (in real app, this would be in database)
      newTransaction.status = Math.random() > 0.1 ? "completed" : "failed"
    }, 2000)

    return NextResponse.json({
      transaction: newTransaction,
      message: "Transaction initiated successfully",
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
