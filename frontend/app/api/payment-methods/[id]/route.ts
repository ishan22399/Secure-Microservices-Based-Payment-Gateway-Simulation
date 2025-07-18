import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase-client";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const paymentMethodId = params.id
    const updateData = await request.json()

    const { data: updatedPaymentMethod, error } = await supabase
      .from('payment_methods')
      .update(updateData)
      .eq('id', paymentMethodId)
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

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const paymentMethodId = params.id

    const { error } = await supabase.from('payment_methods').delete().eq('id', paymentMethodId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "Payment method deleted successfully",
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete payment method" }, { status: 500 })
  }
}
