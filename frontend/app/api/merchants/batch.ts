import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase-client";

export async function POST(request: NextRequest) {
  try {
    const { action, merchantIds, data } = await request.json()

    if (!action || !merchantIds || !Array.isArray(merchantIds)) {
      return NextResponse.json({ error: "Invalid request format" }, { status: 400 })
    }

    let updateData = {}
    switch (action) {
      case "activate":
        updateData = { status: "active" }
        break
      case "deactivate":
        updateData = { status: "inactive" }
        break
      case "update_risk_level":
        if (!data?.riskLevel) {
          return NextResponse.json({ error: "Risk level required for update" }, { status: 400 })
        }
        updateData = { riskLevel: data.riskLevel }
        break
      case "update_processing_fee":
        if (!data?.processingFee) {
          return NextResponse.json({ error: "Processing fee required for update" }, { status: 400 })
        }
        updateData = { "paymentSettings.processingFee": data.processingFee }
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    const { data: updatedMerchants, error } = await supabase
      .from('merchants')
      .update(updateData)
      .in('id', merchantIds)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: `Batch ${action} completed`,
      results: updatedMerchants,
      processed: merchantIds.length,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to process batch operation" }, { status: 500 })
  }
}
