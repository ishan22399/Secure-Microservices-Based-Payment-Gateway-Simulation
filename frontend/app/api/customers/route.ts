import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase-client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const merchantId = searchParams.get("merchantId")

  try {
    let query = supabase.from('customers').select('*')

    if (merchantId) {
      query = query.eq('merchantId', merchantId)
    }

    const { data: customers, error, count } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      customers,
      total: count,
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
