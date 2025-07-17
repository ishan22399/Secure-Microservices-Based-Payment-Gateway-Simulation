import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const paymentMethodId = params.id
    const body = await request.json()
    const { isDefault, isActive, cardholderName } = body

    // In a real app, update payment method in database
    console.log("Updating payment method:", paymentMethodId, body)

    return NextResponse.json({
      success: true,
      message: "Payment method updated successfully",
      paymentMethodId,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update payment method" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const paymentMethodId = params.id

    // In a real app, soft delete or deactivate payment method
    console.log("Deleting payment method:", paymentMethodId)

    return NextResponse.json({
      success: true,
      message: "Payment method deleted successfully",
      paymentMethodId,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete payment method" }, { status: 500 })
  }
}
