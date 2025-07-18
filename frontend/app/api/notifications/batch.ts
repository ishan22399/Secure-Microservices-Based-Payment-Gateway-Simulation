import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase-client";

export async function POST(request: NextRequest) {
  try {
    const { action, notificationIds, userId } = await request.json()

    if (!action || (!notificationIds && !userId)) {
      return NextResponse.json({ error: "Invalid request format" }, { status: 400 })
    }

    let query = supabase.from('notifications')

    switch (action) {
      case "mark_all_read":
        if (userId) {
          query = query.update({ read: true }).eq('userId', userId)
        } else if (notificationIds) {
          query = query.update({ read: true }).in('id', notificationIds)
        }
        break
      case "delete_all":
        if (userId) {
          query = query.delete().eq('userId', userId)
        } else if (notificationIds) {
          query = query.delete().in('id', notificationIds)
        }
        break
      case "delete_read":
        query = query.delete().eq('userId', userId).eq('read', true)
        break
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: `Batch ${action} completed`,
      results: data,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to process batch operation" }, { status: 500 })
  }
}
