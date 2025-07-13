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

export default function CustomerPaymentMethods() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [isAddingCard, setIsAddingCard] = useState(false)
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
  }, [user, isLoading, router])

  const navigation = [
    { name: "Dashboard", href: "/customer/dashboard", icon: Home },
    { name: "Make Payment", href: "/customer/payment", icon: CreditCard },
    { name: "Transaction History", href: "/customer/transactions", icon: History },
    { name: "Payment Methods", href: "/customer/payment-methods", icon: CreditCard, current: true },
    { name: "Profile", href: "/customer/profile", icon: User },
    { name: "Settings", href: "/customer/settings", icon: Settings },
  ]

  const paymentMethods = [
    {
      id: "1",
      type: "Visa",
      last4: "4532",
      expiry: "12/25",
      cardholderName: "John Doe",
      isDefault: true,
      addedDate: "2023-06-15",
    },
    {
      id: "2",
      type: "Mastercard",
      last4: "8901",
      expiry: "08/26",
      cardholderName: "John Doe",
      isDefault: false,
      addedDate: "2023-08-22",
    },
    {
      id: "3",
      type: "American Express",
      last4: "1234",
      expiry: "03/27",
      cardholderName: "John Doe",
      isDefault: false,
      addedDate: "2023-11-10",
    },
  ]

  const getCardIcon = (type: string) => {
    return <CreditCard className="h-6 w-6" />
  }

  const getCardColor = (type: string) => {
    const colors = {
      Visa: "from-blue-500 to-blue-600",
      Mastercard: "from-red-500 to-red-600",
      "American Express": "from-green-500 to-green-600",
    }
    return colors[type as keyof typeof colors] || "from-gray-500 to-gray-600"
  }

  const handleAddCard = () => {
    // Simulate adding card
    console.log("Adding card:", newCard)
    setIsAddingCard(false)
    setNewCard({
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardholderName: "",
      cardType: "",
    })
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
          {paymentMethods.map((method) => (
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
                  {method.isDefault && (
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
                    <span className="font-medium">{method.cardholderName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Expires</span>
                    <span className="font-medium">{method.expiry}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Added</span>
                    <span className="font-medium">{method.addedDate}</span>
                  </div>
                </div>
                <div className="flex space-x-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  {!method.isDefault && (
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Star className="h-4 w-4 mr-1" />
                      Set Default
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
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
