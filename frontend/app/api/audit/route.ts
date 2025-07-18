import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase-client";

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
    let query = supabase.from('audit_logs').select('*', { count: 'exact' })

    if (userId) {
      query = query.eq('userId', userId)
    }
    if (action) {
      query = query.eq('action', action)
    }
    if (severity) {
      query = query.eq('severity', severity)
    }
    if (startDate) {
      query = query.gte('timestamp', startDate)
    }
    if (endDate) {
      query = query.lte('timestamp', endDate)
    }

    const { data: logs, error, count } = await query
      .range(offset, offset + limit - 1)
      .order('timestamp', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      logs,
      total: count,
      hasMore: count ? (offset + limit < count) : false,
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
    const logData = await request.json()

    const { data: newLog, error } = await supabase
      .from('audit_logs')
      .insert([logData])
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "Audit log created successfully",
      log: newLog,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create audit log" }, { status: 500 })
  }
}
