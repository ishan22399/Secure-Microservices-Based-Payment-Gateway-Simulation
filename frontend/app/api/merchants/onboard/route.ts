import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase-client";

export async function POST(request: NextRequest) {
  try {
    const applicationData = await request.json()

    const { data: newApplication, error } = await supabase
      .from('merchant_onboarding')
      .insert([applicationData])
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "Onboarding application submitted successfully",
      application: newApplication,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to process onboarding application" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const applicationId = searchParams.get("applicationId")

  try {
    if (applicationId) {
      const { data: application, error } = await supabase
        .from('merchant_onboarding')
        .select('*')
        .eq('id', applicationId)
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 404 })
      }

      return NextResponse.json({ application })
    }

    // In a real app, you might fetch these requirements from a database or a configuration file.
    const requirements = {
      requiredDocuments: [
        "Business Registration Certificate",
        "Tax Identification Document",
        "Bank Account Verification",
        "Identity Verification (Director/Owner)",
        "Business License (if applicable)",
      ],
      requiredInformation: [
        "Business Details",
        "Contact Information",
        "Banking Information",
        "Processing Volume Estimates",
        "Business Model Description",
      ],
      complianceRequirements: [
        "Terms of Service Agreement",
        "Privacy Policy Acknowledgment",
        "AML/KYC Compliance",
        "PCI DSS Compliance (for card processing)",
      ],
      estimatedTimeframe: "3-5 business days",
      supportContact: "onboarding@securepay.com",
    }

    return NextResponse.json({ requirements })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch onboarding information" }, { status: 500 })
  }
}
