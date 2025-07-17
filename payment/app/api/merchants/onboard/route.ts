import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { businessInfo, contactInfo, bankingInfo, documents, agreementAccepted } = body

    // Validate required fields
    if (!businessInfo?.name || !contactInfo?.email || !agreementAccepted) {
      return NextResponse.json({ error: "Missing required onboarding information" }, { status: 400 })
    }

    // Create onboarding application
    const application = {
      id: `APP_${Date.now()}`,
      status: "pending_review",
      submittedAt: new Date().toISOString(),
      businessInfo: {
        name: businessInfo.name,
        type: businessInfo.type,
        taxId: businessInfo.taxId,
        website: businessInfo.website,
        description: businessInfo.description,
        yearEstablished: businessInfo.yearEstablished,
      },
      contactInfo: {
        email: contactInfo.email,
        phone: contactInfo.phone,
        address: contactInfo.address,
        primaryContact: contactInfo.primaryContact,
      },
      bankingInfo: {
        accountNumber: bankingInfo?.accountNumber ? "****" + bankingInfo.accountNumber.slice(-4) : null,
        routingNumber: bankingInfo?.routingNumber,
        bankName: bankingInfo?.bankName,
      },
      documents: documents || [],
      compliance: {
        agreementAccepted,
        acceptedAt: new Date().toISOString(),
        kycStatus: "pending",
        amlStatus: "pending",
      },
      estimatedReviewTime: "3-5 business days",
    }

    // In a real app, save to database and trigger review process
    console.log("New merchant onboarding application:", application)

    // Send confirmation email (mock)
    console.log("Sending confirmation email to:", contactInfo.email)

    return NextResponse.json({
      success: true,
      message: "Onboarding application submitted successfully",
      application: {
        id: application.id,
        status: application.status,
        estimatedReviewTime: application.estimatedReviewTime,
      },
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
      // Return specific application status
      const application = {
        id: applicationId,
        status: "under_review",
        submittedAt: "2024-01-10T10:00:00Z",
        lastUpdated: "2024-01-10T14:30:00Z",
        reviewSteps: [
          { step: "Document Verification", status: "completed", completedAt: "2024-01-10T12:00:00Z" },
          { step: "KYC Check", status: "in_progress", startedAt: "2024-01-10T13:00:00Z" },
          { step: "AML Screening", status: "pending" },
          { step: "Risk Assessment", status: "pending" },
          { step: "Final Approval", status: "pending" },
        ],
        estimatedCompletion: "2024-01-12T17:00:00Z",
        notes: "All documents received. KYC verification in progress.",
      }

      return NextResponse.json({ application })
    }

    // Return onboarding requirements
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
