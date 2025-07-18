"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Home, CreditCard, History, Settings, User, Plus, Edit, Trash2, Shield, Star } from "lucide-react"
import { supabase } from "@/lib/supabase-client"
import { Database } from "@/types/supabase"

type PaymentMethod = Database['public']['Tables']['payment_methods']['Row']

export default function CustomerPaymentMethods() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [isAddingCard, setIsAddingCard] = useState(false)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [newCard, setNewCard] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    cardType: "",
  })

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "customer")) {
      router.push("/auth/login")
    }

    if (user) {
      fetchPaymentMethods()
    }
  }, [user, isLoading, router])

  const fetchPaymentMethods = async () => {
    if (!user) return
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false })

    if (error) {
      console.error("Error fetching payment methods:", error)
    } else {
      setPaymentMethods(data || [])
    }
  }

  const handleAddCard = async () => {
    if (!user) return

    const { cardNumber, expiryDate, cvv, cardholderName, cardType } = newCard

    // Basic validation
    if (!cardNumber || !expiryDate || !cvv || !cardholderName || !cardType) {
      alert("Please fill in all card details.")
      return
    }

    const last4 = cardNumber.slice(-4)

    const { data, error } = await supabase
      .from('payment_methods')
      .insert({
        user_id: user.id,
        type: cardType,
        last4: last4,
        details: { expiry: expiryDate, cardholderName: cardholderName }, // Store as JSONB
        is_active: true,
        is_default: paymentMethods.length === 0, // Set as default if it's the first card
      })
      .single()

    if (error) {
      console.error("Error adding payment method:", error)
      alert("Failed to add payment method.")
    } else {
      alert("Payment method added successfully!")
      setIsAddingCard(false)
      setNewCard({
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        cardholderName: "",
        cardType: "",
      })
      fetchPaymentMethods() // Refresh the list
    }
  }

  const handleDeletePaymentMethod = async (id: string) => {
    if (!confirm("Are you sure you want to delete this payment method?")) return

    const { error } = await supabase.from('payment_methods').delete().eq('id', id)

    if (error) {
      console.error("Error deleting payment method:", error)
      alert("Failed to delete payment method.")
    } else {
      alert("Payment method deleted successfully!")
      fetchPaymentMethods() // Refresh the list
    }
  }

  const handleSetDefaultPaymentMethod = async (id: string) => {
    if (!user) return

    // First, set all other payment methods for this user to not default
    const { error: updateError } = await supabase
      .from('payment_methods')
      .update({ is_default: false })
      .eq('user_id', user.id)
      .neq('id', id)

    if (updateError) {
      console.error("Error updating default status:", updateError)
      alert("Failed to set default payment method.")
      return
    }

    // Then, set the selected payment method as default
    const { error } = await supabase
      .from('payment_methods')
      .update({ is_default: true })
      .eq('id', id)
      .single()

    if (error) {
      console.error("Error setting default payment method:", error)
      alert("Failed to set default payment method.")
    } else {
      alert("Default payment method set successfully!")
      fetchPaymentMethods() // Refresh the list
    }
  }

  const navigation = [
    { name: "Dashboard", href: "/customer/dashboard", icon: Home },
    { name: "Make Payment", href: "/customer/payment", icon: CreditCard },
    { name: "Transaction History", href: "/customer/transactions", icon: History },
    { name: "Payment Methods", href: "/customer/payment-methods", icon: CreditCard, current: true },
    { name: "Profile", href: "/customer/profile", icon: User },
    { name: "Settings", href: "/customer/settings", icon: Settings },
  ]

  const getCardIcon = (type: string) => {
    return <CreditCard className="h-6 w-6" />
  }

  const getCardColor = (type: string) => {
    const colors: { [key: string]: string } = {
      visa: "from-blue-500 to-blue-600",
      mastercard: "from-red-500 to-red-600",
      amex: "from-green-500 to-green-600",
    }
    return colors[type.toLowerCase()] || "from-gray-500 to-gray-600"
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <DashboardLayout navigation={navigation} title="Payment Methods">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Payment Methods</h1>
            <p className="text-gray-600">Manage your saved payment methods securely</p>
          </div>
          <Dialog open={isAddingCard} onOpenChange={setIsAddingCard}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Add Payment Method
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Payment Method</DialogTitle>
                <DialogDescription>Add a new credit or debit card to your account</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardholderName">Cardholder Name</Label>
                  <Input
                    id="cardholderName"
                    placeholder="John Doe"
                    value={newCard.cardholderName}
                    onChange={(e) => setNewCard({ ...newCard, cardholderName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={newCard.cardNumber}
                    onChange={(e) => setNewCard({ ...newCard, cardNumber: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      placeholder="MM/YY"
                      value={newCard.expiryDate}
                      onChange={(e) => setNewCard({ ...newCard, expiryDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={newCard.cvv}
                      onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardType">Card Type</Label>
                  <Select
                    value={newCard.cardType}
                    onValueChange={(value) => setNewCard({ ...newCard, cardType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select card type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="visa">Visa</SelectItem>
                      <SelectItem value="mastercard">Mastercard</SelectItem>
                      <SelectItem value="amex">American Express</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex space-x-2 pt-4">
                  <Button onClick={handleAddCard} className="flex-1">
                    Add Card
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddingCard(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Security Notice */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">Your payment methods are secure</p>
                <p className="text-sm text-blue-700">
                  All card information is encrypted and stored securely using industry-standard security measures.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paymentMethods.length > 0 ? (
            paymentMethods.map((method) => (
              <Card key={method.id} className="relative overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${getCardColor(method.type)}`}></div>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getCardIcon(method.type)}
                      <div>
                        <p className="font-semibold">{method.type}</p>
                        <p className="text-sm text-gray-500">•••• •••• •••• {method.last4}</p>
                      </div>
                    </div>
                    {method.is_default && (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        <Star className="h-3 w-3 mr-1" />
                        Default
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Cardholder</span>
                      <span className="font-medium">{method.details?.cardholderName || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Expires</span>
                      <span className="font-medium">{method.details?.expiry || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Added</span>
                      <span className="font-medium">{new Date(method.created_at || '').toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    {!method.is_default && (
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={() => handleSetDefaultPaymentMethod(method.id)}>
                        <Star className="h-4 w-4 mr-1" />
                        Set Default
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent" onClick={() => handleDeletePaymentMethod(method.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-sm text-gray-500">No payment methods found. Add one to get started.</p>
          )}
        </div>

        {/* Security Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Security Features</span>
            </CardTitle>
            <CardDescription>How we protect your payment information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Shield className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">256-bit SSL Encryption</p>
                    <p className="text-sm text-gray-500">Bank-grade security for all transactions</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Shield className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">PCI DSS Compliant</p>
                    <p className="text-sm text-gray-500">Meets industry security standards</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Shield className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Fraud Monitoring</p>
                    <p className="text-sm text-gray-500">24/7 transaction monitoring</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Shield className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Tokenization</p>
                    <p className="text-sm text-gray-500">Card numbers are never stored directly</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
