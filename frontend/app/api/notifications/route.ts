import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase-client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")
  const type = searchParams.get("type")
  const unreadOnly = searchParams.get("unreadOnly") === "true"
  const limit = Number.parseInt(searchParams.get("limit") || "20")
  const offset = Number.parseInt(search_params.get("offset") || "0")

  try {
    let query = supabase.from('notifications').select('*', { count: 'exact' })

    if (userId) {
      query = query.eq('userId', userId)
    }
    if (type) {
      query = query.eq('type', type)
    }
    if (unreadOnly) {
      query = query.eq('read', false)
    }

    const { data: notifications, error, count } = await query
      .range(offset, offset + limit - 1)
      .order('timestamp', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    const { count: unreadCount } = await supabase
      .from('notifications')
      .select('id', { count: 'exact' })
      .eq('userId', userId)
      .eq('read', false)

    return NextResponse.json({
      notifications,
      total: count,
      unreadCount,
      hasMore: count ? (offset + limit < count) : false,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const notificationData = await request.json()

    const { data: newNotification, error } = await supabase
      .from('notifications')
      .insert([notificationData])
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "Notification created successfully",
      notification: newNotification,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create notification" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { ids, read } = await request.json()

    const { error } = await supabase
      .from('notifications')
      .update({ read })
      .in('id', ids)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, message: "Notifications updated successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update notifications" }, { status: 500 })
  }
}
