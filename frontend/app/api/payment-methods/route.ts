import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase-client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")
  const type = searchParams.get("type")
  const activeOnly = searchParams.get("activeOnly") === "true"

  try {
    let query = supabase.from('payment_methods').select('*')

    if (userId) {
      query = query.eq('userId', userId)
    }
    if (type) {
      query = query.eq('type', type)
    }
    if (activeOnly) {
      query = query.eq('isActive', true)
    }

    const { data: paymentMethods, error } = await query
      .order('isDefault', { ascending: false })
      .order('createdAt', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      paymentMethods,
      total: paymentMethods?.length || 0,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch payment methods" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const paymentMethodData = await request.json()

    const { data: newPaymentMethod, error } = await supabase
      .from('payment_methods')
      .insert([paymentMethodData])
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "Payment method added successfully",
      paymentMethod: newPaymentMethod,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to add payment method" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...updateData } = await request.json()

    const { data: updatedPaymentMethod, error } = await supabase
      .from('payment_methods')
      .update(updateData)
      .eq('id', id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "Payment method updated successfully",
      paymentMethod: updatedPaymentMethod,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update payment method" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()

    const { error } = await supabase.from('payment_methods').delete().eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, message: "Payment method deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete payment method" }, { status: 500 })
  }
}
