import { type NextRequest, NextResponse } from "next/server"

// Mock notifications data
const notifications = [
  {
    id: "notif_001",
    userId: "user_123",
    title: "Payment Successful",
    message: "Your payment of $299.99 has been processed successfully",
    type: "success",
    read: false,
    timestamp: "2024-01-10T14:32:15Z",
    metadata: {
      transactionId: "TXN-001",
      amount: 299.99,
      merchant: "Amazon Store",
    },
  },
  {
    id: "notif_002",
    userId: "user_123",
    title: "Security Alert",
    message: "New login detected from unusual location",
    type: "warning",
    read: false,
    timestamp: "2024-01-10T13:45:30Z",
    metadata: {
      location: "New York, US",
      ipAddress: "192.168.1.100",
    },
  },
  {
    id: "notif_003",
    userId: "user_456",
    title: "Monthly Statement Ready",
    message: "Your December statement is now available for download",
    type: "info",
    read: true,
    timestamp: "2024-01-09T09:00:00Z",
    metadata: {
      statementMonth: "December 2023",
      downloadUrl: "/api/statements/dec-2023.pdf",
    },
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")
  const type = searchParams.get("type")
  const unreadOnly = searchParams.get("unreadOnly") === "true"
  const limit = Number.parseInt(searchParams.get("limit") || "20")
  const offset = Number.parseInt(searchParams.get("offset") || "0")

  try {
    let filteredNotifications = [...notifications]

    if (userId) {
      filteredNotifications = filteredNotifications.filter((n) => n.userId === userId)
    }

    if (type) {
      filteredNotifications = filteredNotifications.filter((n) => n.type === type)
    }

    if (unreadOnly) {
      filteredNotifications = filteredNotifications.filter((n) => !n.read)
    }

    // Sort by timestamp (newest first)
    filteredNotifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    const paginatedNotifications = filteredNotifications.slice(offset, offset + limit)

    return NextResponse.json({
      notifications: paginatedNotifications,
      total: filteredNotifications.length,
      unreadCount: filteredNotifications.filter((n) => !n.read).length,
      hasMore: offset + limit < filteredNotifications.length,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, title, message, type = "info", metadata = {} } = body

    if (!userId || !title || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newNotification = {
      id: `notif_${Date.now()}`,
      userId,
      title,
      message,
      type,
      read: false,
      timestamp: new Date().toISOString(),
      metadata,
    }

    // In a real app, save to database and send push notification
    console.log("New notification created:", newNotification)

    return NextResponse.json({
      success: true,
      message: "Notification created successfully",
      notification: newNotification,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create notification" }, { status: 500 })
  }
}
