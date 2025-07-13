"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useNotifications } from "@/contexts/notification-context"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Home,
  CreditCard,
  History,
  Settings,
  User,
  Send,
  Shield,
  Lock,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react"


export default function CustomerPayment() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { addNotification } = useNotifications()

  const [paymentData, setPaymentData] = useState({
    merchant: "",
    amount: "",
    description: "",
    paymentMethod: "",
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle")
  const [error, setError] = useState("")
  const [paymentMethods, setPaymentMethods] = useState<any[]>([])

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "customer")) {
      router.push("/auth/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (!user) return
    // Fetch payment methods from backend
    const fetchPaymentMethods = async () => {
      try {
        const res = await fetch(`/api/payment-methods?userId=${user.id}`)
        const data = await res.json()
        setPaymentMethods(
          (data.paymentMethods || []).map((pm: any) => ({
            id: pm.id,
            type: pm.cardType || pm.type,
            last4: pm.last4,
            expiry: pm.expiryMonth && pm.expiryYear ? `${pm.expiryMonth.toString().padStart(2, "0")}/${pm.expiryYear}` : "",
          }))
        )
      } catch (e) {
        // ignore
      }
    }
    fetchPaymentMethods()
  }, [user])

  const popularMerchants = ["Amazon", "Netflix", "Spotify", "Uber", "Starbucks", "Apple", "Google", "Microsoft"]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsProcessing(true)
    setPaymentStatus("processing")

    if (!user) {
      setPaymentStatus("error")
      setError("User not authenticated. Please log in again.")
      setIsProcessing(false)
      return
    }

    try {
      // Send payment to backend
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: user.id,
          merchantName: paymentData.merchant,
          amount: Number(paymentData.amount),
          description: paymentData.description,
          paymentMethodId: paymentData.paymentMethod,
        }),
      })
      const data = await res.json()
      if (res.ok && data.transaction) {
        setPaymentStatus("success")
        addNotification({
          title: "Payment Successful",
          message: `Payment of $${paymentData.amount} to ${paymentData.merchant} completed successfully`,
          type: "success",
        })
        setTimeout(() => {
          setPaymentData({ merchant: "", amount: "", description: "", paymentMethod: "" })
          setPaymentStatus("idle")
        }, 3000)
      } else {
        setPaymentStatus("error")
        setError(data.error || "Payment failed. Please try again.")
      }
    } catch (error) {
      setPaymentStatus("error")
      setError("An error occurred while processing your payment.")
    } finally {
      setIsProcessing(false)
    }
  }

  const navigation = [
    { name: "Dashboard", href: "/customer/dashboard", icon: Home },
    { name: "Make Payment", href: "/customer/payment", icon: CreditCard, current: true },
    { name: "Transaction History", href: "/customer/transactions", icon: History },
    { name: "Payment Methods", href: "/customer/payment-methods", icon: CreditCard },
    { name: "Profile", href: "/customer/profile", icon: User },
    { name: "Settings", href: "/customer/settings", icon: Settings },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <DashboardLayout navigation={navigation} title="Make Payment">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Security Notice */}
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>Your payment is secured with bank-grade encryption and fraud protection.</AlertDescription>
        </Alert>

        {/* Payment Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Payment Details</span>
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

              {/* Merchant */}
              <div className="space-y-2">
                <Label htmlFor="merchant">Merchant / Recipient</Label>
                <Input
                  id="merchant"
                  placeholder="Enter merchant name"
                  value={paymentData.merchant}
                  onChange={(e) => setPaymentData({ ...paymentData, merchant: e.target.value })}
                  required
                  disabled={isProcessing}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {popularMerchants.map((merchant) => (
                    <Button
                      key={merchant}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setPaymentData({ ...paymentData, merchant })}
                      disabled={isProcessing}
                    >
                      {merchant}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (USD)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    className="pl-8"
                    value={paymentData.amount}
                    onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                    required
                    disabled={isProcessing}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  placeholder="What is this payment for?"
                  value={paymentData.description}
                  onChange={(e) => setPaymentData({ ...paymentData, description: e.target.value })}
                  disabled={isProcessing}
                />
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select
                  value={paymentData.paymentMethod}
                  onValueChange={(value) => setPaymentData({ ...paymentData, paymentMethod: value })}
                  disabled={isProcessing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method.id} value={method.id}>
                        <div className="flex items-center space-x-2">
                          <CreditCard className="h-4 w-4" />
                          <span>
                            {method.type} •••• {method.last4}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Payment Status */}
              {paymentStatus === "processing" && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-blue-600 animate-spin" />
                    <div>
                      <p className="font-medium text-blue-900">Processing Payment</p>
                      <p className="text-sm text-blue-700">Please wait while we process your payment...</p>
                    </div>
                  </div>
                </div>
              )}

              {paymentStatus === "success" && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900">Payment Successful!</p>
                      <p className="text-sm text-green-700">
                        Your payment of ${paymentData.amount} to {paymentData.merchant} has been processed.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                disabled={isProcessing || !paymentData.merchant || !paymentData.amount || !paymentData.paymentMethod}
              >
                {isProcessing ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Payment
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Security Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lock className="h-5 w-5" />
              <span>Security Features</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">256-bit SSL Encryption</p>
                  <p className="text-sm text-gray-500">Bank-grade security</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Fraud Detection</p>
                  <p className="text-sm text-gray-500">AI-powered protection</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">PCI DSS Compliant</p>
                  <p className="text-sm text-gray-500">Industry standard</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Real-time Monitoring</p>
                  <p className="text-sm text-gray-500">24/7 protection</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
