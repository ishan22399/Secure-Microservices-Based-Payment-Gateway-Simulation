import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase-client";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const merchantId = params.id

    const { data: merchant, error } = await supabase
      .from('merchants')
      .select('*')
      .eq('id', merchantId)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }

    return NextResponse.json({ merchant })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch merchant" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const merchantId = params.id
    const updateData = await request.json()

    const { data: updatedMerchant, error } = await supabase
      .from('merchants')
      .update(updateData)
      .eq('id', merchantId)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "Merchant updated successfully",
      merchant: updatedMerchant,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update merchant" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const merchantId = params.id

    const { error } = await supabase.from('merchants').delete().eq('id', merchantId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "Merchant deleted successfully",
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete merchant" }, { status: 500 })
  }
}
