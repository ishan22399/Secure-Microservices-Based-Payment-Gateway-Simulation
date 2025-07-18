import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase-client";

export async function POST(request: NextRequest) {
  try {
    const { action, paymentMethodIds } = await request.json()

    if (!action || !paymentMethodIds || !Array.isArray(paymentMethodIds)) {
      return NextResponse.json({ error: "Invalid request format" }, { status: 400 })
    }

    let query

    switch (action) {
      case "delete":
        query = supabase.from('payment_methods').delete().in('id', paymentMethodIds)
        break
      case "activate":
        query = supabase.from('payment_methods').update({ isActive: true }).in('id', paymentMethodIds)
        break
      case "deactivate":
        query = supabase.from('payment_methods').update({ isActive: false }).in('id', paymentMethodIds)
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
      processed: paymentMethodIds.length,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to process batch operation" }, { status: 500 })
  }
}
