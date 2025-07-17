"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { apiClient } from "@/lib/api"
import { CreditCard, ArrowLeft, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { useNotifications } from "@/contexts/notification-context"

export default function PaymentPage() {
  const { user, isLoading } = useAuth()
  const { addNotification } = useNotifications()
  const router = useRouter()
  const [formData, setFormData] = useState({
    merchantId: "",
    merchantName: "",
    amount: "",
    currency: "USD",
    paymentMethod: "",
    description: "",
    category: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "CUSTOMER")) {
      router.push("/auth/login")
    }
  }, [user, isLoading, router])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Validate form
      if (!formData.merchantName || !formData.amount || !formData.paymentMethod) {
        setError("Please fill in all required fields")
        setLoading(false)
        return
      }

      if (Number.parseFloat(formData.amount) <= 0) {
        setError("Amount must be greater than 0")
        setLoading(false)
        return
      }

      // Create transaction
      const transactionData = {
        merchantId: formData.merchantId || `MERCH_${Date.now()}`,
        merchantName: formData.merchantName,
        amount: Number.parseFloat(formData.amount),
        currency: formData.currency,
        paymentMethod: formData.paymentMethod,
        description: formData.description,
        category: formData.category,
      }

      const response = await apiClient.createTransaction(transactionData)

      if (response.transaction) {
        setSuccess(true)

        // Add notification
        addNotification({
          type: "success",
          title: "Payment Successful",
          message: `Your payment of ${formData.currency} ${formData.amount} to ${formData.merchantName} was successful.`,
        })

        // Reset form
        setFormData({
          merchantId: "",
          merchantName: "",
          amount: "",
          currency: "USD",
          paymentMethod: "",
          description: "",
          category: "",
        })

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push("/customer/dashboard")
        }, 2000)
      } else {
        throw new Error("Failed to process payment")
      }
    } catch (err: any) {
      setError(err.message || "Failed to process payment")

      // Add error notification
      addNotification({
        type: "error",
        title: "Payment Failed",
        message: err.message || "There was an error processing your payment. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-600 mb-2">Payment Submitted!</h2>
              <p className="text-gray-600 mb-4">Your payment has been submitted successfully and is being processed.</p>
              <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/customer/dashboard">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Make Payment</h1>
                <p className="text-gray-600">Process a secure payment transaction</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Payment Details
            </CardTitle>
            <CardDescription>Enter the payment information below</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="merchantName">Merchant Name *</Label>
                  <Input
                    id="merchantName"
                    placeholder="Enter merchant name"
                    value={formData.merchantName}
                    onChange={(e) => handleInputChange("merchantName", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="merchantId">Merchant ID (Optional)</Label>
                  <Input
                    id="merchantId"
                    placeholder="Auto-generated if empty"
                    value={formData.merchantId}
                    onChange={(e) => handleInputChange("merchantId", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => handleInputChange("amount", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={formData.currency} onValueChange={(value) => handleInputChange("currency", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method *</Label>
                  <Select
                    value={formData.paymentMethod}
                    onValueChange={(value) => handleInputChange("paymentMethod", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Credit Card">Credit Card</SelectItem>
                      <SelectItem value="Debit Card">Debit Card</SelectItem>
                      <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                      <SelectItem value="PayPal">PayPal</SelectItem>
                      <SelectItem value="Apple Pay">Apple Pay</SelectItem>
                      <SelectItem value="Google Pay">Google Pay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Shopping">Shopping</SelectItem>
                      <SelectItem value="Food & Dining">Food & Dining</SelectItem>
                      <SelectItem value="Entertainment">Entertainment</SelectItem>
                      <SelectItem value="Travel">Travel</SelectItem>
                      <SelectItem value="Bills & Utilities">Bills & Utilities</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter payment description (optional)"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Link href="/customer/dashboard">
                  <Button variant="outline">Cancel</Button>
                </Link>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Submit Payment"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <CreditCard className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-900">Secure Payment Processing</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Your payment information is encrypted and processed securely. We never store your sensitive payment
                  details.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
