import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase-client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")
  const role = searchParams.get("role")
  const limit = Number.parseInt(searchParams.get("limit") || "10")
  const offset = Number.parseInt(searchParams.get("offset") || "0")

  try {
    let query = supabase.from('transactions').select('*')

    if (role === "customer" && userId) {
      query = query.eq('customerId', userId)
    } else if (role === "merchant" && userId) {
      query = query.eq('merchantId', userId)
    }

    const { data: transactions, error, count } = await query
      .range(offset, offset + limit - 1)
      .order('timestamp', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      transactions,
      total: count,
      hasMore: count ? (offset + limit < count) : false,
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const transactionData = await request.json()

    const { data: newTransaction, error } = await supabase
      .from('transactions')
      .insert([transactionData])
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      transaction: newTransaction,
      message: "Transaction initiated successfully",
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { transactionId, status } = await request.json()

    const { data: updatedTransaction, error } = await supabase
      .from('transactions')
      .update({ status })
      .eq('id', transactionId)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      transaction: updatedTransaction,
      message: "Transaction status updated successfully",
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

