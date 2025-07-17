import { type NextRequest, NextResponse } from "next/server"

// Mock audit log data
const auditLogs = [
  {
    id: "audit_001",
    userId: "user_123",
    userEmail: "admin@demo.com",
    action: "USER_LOGIN",
    resource: "auth",
    resourceId: "user_123",
    details: {
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0...",
      location: "New York, US",
    },
    timestamp: "2024-01-10T14:32:15Z",
    severity: "info",
  },
  {
    id: "audit_002",
    userId: "user_456",
    userEmail: "merchant@demo.com",
    action: "TRANSACTION_PROCESSED",
    resource: "transaction",
    resourceId: "txn_789",
    details: {
      amount: 299.99,
      currency: "USD",
      paymentMethod: "visa",
      merchantId: "merch_001",
    },
    timestamp: "2024-01-10T14:30:45Z",
    severity: "info",
  },
  {
    id: "audit_003",
    userId: "user_789",
    userEmail: "admin@demo.com",
    action: "USER_ROLE_CHANGED",
    resource: "user",
    resourceId: "user_456",
    details: {
      oldRole: "customer",
      newRole: "merchant",
      changedBy: "user_789",
    },
    timestamp: "2024-01-10T14:25:30Z",
    severity: "warning",
  },
  {
    id: "audit_004",
    userId: "system",
    userEmail: "system@securepay.com",
    action: "SECURITY_ALERT",
    resource: "security",
    resourceId: "alert_001",
    details: {
      alertType: "SUSPICIOUS_LOGIN",
      ipAddress: "203.45.67.89",
      attempts: 5,
      blocked: true,
    },
    timestamp: "2024-01-10T14:20:15Z",
    severity: "critical",
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")
  const action = searchParams.get("action")
  const severity = searchParams.get("severity")
  const startDate = searchParams.get("startDate")
  const endDate = searchParams.get("endDate")
  const limit = Number.parseInt(searchParams.get("limit") || "50")
  const offset = Number.parseInt(searchParams.get("offset") || "0")

  try {
    let filteredLogs = [...auditLogs]

    // Apply filters
    if (userId) {
      filteredLogs = filteredLogs.filter((log) => log.userId === userId)
    }

    if (action) {
      filteredLogs = filteredLogs.filter((log) => log.action === action)
    }

    if (severity) {
      filteredLogs = filteredLogs.filter((log) => log.severity === severity)
    }

    if (startDate) {
      filteredLogs = filteredLogs.filter((log) => new Date(log.timestamp) >= new Date(startDate))
    }

    if (endDate) {
      filteredLogs = filteredLogs.filter((log) => new Date(log.timestamp) <= new Date(endDate))
    }

    // Sort by timestamp (newest first)
    filteredLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    // Apply pagination
    const paginatedLogs = filteredLogs.slice(offset, offset + limit)

    return NextResponse.json({
      logs: paginatedLogs,
      total: filteredLogs.length,
      hasMore: offset + limit < filteredLogs.length,
      filters: {
        userId,
        action,
        severity,
        startDate,
        endDate,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch audit logs" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, action, resource, resourceId, details, severity = "info" } = body

    // Create new audit log entry
    const newLog = {
      id: `audit_${Date.now()}`,
      userId,
      userEmail: "user@example.com", // In real app, fetch from user data
      action,
      resource,
      resourceId,
      details,
      timestamp: new Date().toISOString(),
      severity,
    }

    // In a real app, save to database
    console.log("New audit log created:", newLog)

    return NextResponse.json({
      success: true,
      message: "Audit log created successfully",
      logId: newLog.id,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create audit log" }, { status: 500 })
  }
}
