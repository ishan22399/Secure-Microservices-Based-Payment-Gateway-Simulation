import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase-client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const merchantId = searchParams.get("merchantId")

  try {
    let query = supabase.from('payment_links').select('*')

    if (merchantId) {
      query = query.eq('merchantId', merchantId)
    }

    const { data: paymentLinks, error, count } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      paymentLinks,
      total: count,
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const paymentLinkData = await request.json()

    const { data: newPaymentLink, error } = await supabase
      .from('payment_links')
      .insert([paymentLinkData])
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      paymentLink: newPaymentLink,
      message: "Payment link created successfully",
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...updateData } = await request.json()

    const { data: updatedPaymentLink, error } = await supabase
      .from('payment_links')
      .update(updateData)
      .eq('id', id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "Payment link updated successfully",
      paymentLink: updatedPaymentLink,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update payment link" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()

    const { error } = await supabase.from('payment_links').delete().eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, message: "Payment link deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete payment link" }, { status: 500 })
  }
}
