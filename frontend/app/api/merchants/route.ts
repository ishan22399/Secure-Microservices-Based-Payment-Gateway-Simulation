import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase-client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")
  const riskLevel = searchParams.get("riskLevel")
  const businessType = searchParams.get("businessType")
  const search = searchParams.get("search")
  const limit = Number.parseInt(searchParams.get("limit") || "20")
  const offset = Number.parseInt(searchParams.get("offset") || "0")

  try {
    let query = supabase.from('merchants').select('*', { count: 'exact' })

    if (status) {
      query = query.eq('status', status)
    }
    if (riskLevel) {
      query = query.eq('riskLevel', riskLevel)
    }
    if (businessType) {
      query = query.eq('businessType', businessType)
    }
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,id.ilike.%${search}%`)
    }

    const { data: merchants, error, count } = await query
      .range(offset, offset + limit - 1)
      .order('joinDate', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    const { data: summaryData, error: summaryError } = await supabase
      .from('merchants')
      .select('status,monthlyVolume')

    if (summaryError) {
      console.error("Error fetching summary data:", summaryError)
    }

    const summary = {
      totalMerchants: summaryData?.length || 0,
      activeMerchants: summaryData?.filter((m) => m.status === "active").length || 0,
      totalVolume: summaryData?.reduce((sum, m) => sum + m.monthlyVolume, 0) || 0,
    }

    return NextResponse.json({
      merchants,
      total: count,
      hasMore: count ? (offset + limit < count) : false,
      summary,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch merchants" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const merchantData = await request.json()

    const { data: newMerchant, error } = await supabase
      .from('merchants')
      .insert([merchantData])
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "Merchant created successfully",
      merchant: newMerchant,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create merchant" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...updateData } = await request.json()

    const { data: updatedMerchant, error } = await supabase
      .from('merchants')
      .update(updateData)
      .eq('id', id)
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

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()

    const { error } = await supabase.from('merchants').delete().eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, message: "Merchant deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete merchant" }, { status: 500 })
  }
}
