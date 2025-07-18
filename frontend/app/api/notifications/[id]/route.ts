import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase-client";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const notificationId = params.id
    const { read } = await request.json()

    const { data: updatedNotification, error } = await supabase
      .from('notifications')
      .update({ read })
      .eq('id', notificationId)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "Notification updated successfully",
      notification: updatedNotification,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update notification" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const notificationId = params.id

    const { error } = await supabase.from('notifications').delete().eq('id', notificationId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "Notification deleted successfully",
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete notification" }, { status: 500 })
  }
}
