import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, sessionId } = body

    // In a real app, invalidate the session/token
    console.log("User logged out:", { userId, sessionId, timestamp: new Date() })

    // Create audit log
    const auditLog = {
      userId,
      action: "USER_LOGOUT",
      resource: "auth",
      resourceId: userId,
      details: {
        sessionId,
        logoutTime: new Date().toISOString(),
      },
      timestamp: new Date().toISOString(),
      severity: "info",
    }

    console.log("Logout audit log:", auditLog)

    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    })

    // Clear any HTTP-only cookies
    response.cookies.set("auth_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
    })

    return response
  } catch (error) {
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 })
  }
}
