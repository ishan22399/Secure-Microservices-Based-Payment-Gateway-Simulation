"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Home,
  CreditCard,
  History,
  Settings,
  User,
  DollarSign,
  TrendingUp,
  Shield,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { supabase } from "@/lib/supabase-client"
import { Database } from "@/types/supabase"

type Transaction = Database['public']['Tables']['transactions']['Row']
type PaymentMethod = Database['public']['Tables']['payment_methods']['Row']

export default function CustomerDashboard() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [totalSpent, setTotalSpent] = useState<number>(0)
  const [monthlySpent, setMonthlySpent] = useState<number>(0)
  const [totalTransactions, setTotalTransactions] = useState<number>(0)

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "customer")) {
      router.push("/auth/login")
    }

    if (user) {
      fetchData()
    }
  }, [user, isLoading, router])

  const fetchData = async () => {
    if (!user) return

    // Fetch transactions
    const { data: transactionsData, error: transactionsError } = await supabase
      .from('transactions')
      .select('*')
      .eq('customer_id', user.id)
      .order('timestamp', { ascending: false })
      .limit(4) // Fetch recent transactions

    if (transactionsError) {
      console.error("Error fetching transactions:", transactionsError)
    } else {
      setTransactions(transactionsData || [])
      const spent = transactionsData?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0
      setTotalSpent(spent)
      setTotalTransactions(transactionsData?.length || 0)

      // Calculate monthly spent
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      const monthly = transactionsData?.filter(t => {
        const transactionDate = new Date(t.timestamp || '')
        return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear
      }).reduce((sum, t) => sum + (t.amount || 0), 0) || 0
      setMonthlySpent(monthly)
    }

    // Fetch payment methods
    const { data: paymentMethodsData, error: paymentMethodsError } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false })

    if (paymentMethodsError) {
      console.error("Error fetching payment methods:", paymentMethodsError)
    } else {
      setPaymentMethods(paymentMethodsData || [])
    }
  }

  const navigation = [
    { name: "Dashboard", href: "/customer/dashboard", icon: Home, current: true },
    { name: "Make Payment", href: "/customer/payment", icon: CreditCard },
    { name: "Transaction History", href: "/customer/transactions", icon: History },
    { name: "Payment Methods", href: "/customer/payment-methods", icon: CreditCard },
    { name: "Profile", href: "/customer/profile", icon: User },
    { name: "Settings", href: "/customer/settings", icon: Settings },
  ]

  const stats = [
    {
      title: "Total Spent",
      value: `${totalSpent.toFixed(2)}`,
      change: "+12.5%", // Placeholder, needs actual calculation
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "This Month",
      value: `${monthlySpent.toFixed(2)}`,
      change: "+8.2%", // Placeholder, needs actual calculation
      icon: TrendingUp,
      color: "text-blue-600",
    },
    {
      title: "Transactions",
      value: totalTransactions.toString(),
      change: "+15.3%", // Placeholder, needs actual calculation
      icon: CreditCard,
      color: "text-purple-600",
    },
    {
      title: "Security Score",
      value: "98%",
      change: "+2%",
      icon: Shield,
      color: "text-green-600",
    },
  ]

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Shopping: "bg-blue-100 text-blue-800",
      Entertainment: "bg-purple-100 text-purple-800",
      "Food & Drink": "bg-orange-100 text-orange-800",
      Transportation: "bg-green-100 text-green-800",
      // Add more categories as needed
    }
    return colors[category] || "bg-gray-100 text-gray-800"
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <DashboardLayout navigation={navigation} title="Customer Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.full_name || user?.email}!</h1>
          <p className="text-blue-100">Manage your payments and track your spending securely.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{stat.change}</span> from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                className="w-full justify-start bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                onClick={() => router.push("/customer/payment")}
              >
                <Plus className="mr-2 h-4 w-4" />
                Make a Payment
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => router.push("/customer/transactions")}
              >
                <History className="mr-2 h-4 w-4" />
                View Transaction History
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => router.push("/customer/payment-methods")}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Manage Payment Methods
              </Button>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Your saved payment methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentMethods.length > 0 ? (
                paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                        <CreditCard className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {method.type} •••• {method.last4}
                        </p>
                        <p className="text-sm text-gray-500">Expires {method.details?.expiry || 'N/A'}</p>
                      </div>
                    </div>
                    {method.is_default && <Badge variant="secondary">Default</Badge>}
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No payment methods found.</p>
              )}
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => router.push("/customer/payment-methods")}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Payment Method
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your latest payment activity</CardDescription>
              </div>
              <Button variant="outline" onClick={() => router.push("/customer/transactions")}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          (transaction.amount || 0) < 0 ? "bg-red-100" : "bg-green-100"
                        }`}
                      >
                        {(transaction.amount || 0) < 0 ? (
                          <ArrowUpRight className="h-5 w-5 text-red-600" />
                        ) : (
                          <ArrowDownRight className="h-5 w-5 text-green-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p> {/* Assuming description can act as merchant name for now */}
                        <p className="text-sm text-gray-500">
                          {/* {transaction.category} •  */}
                          {new Date(transaction.timestamp || '').toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${(transaction.amount || 0) < 0 ? "text-red-600" : "text-green-600"}`}>
                        ${Math.abs(transaction.amount || 0).toFixed(2)}
                      </p>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No recent transactions found.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Security Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Account Security</span>
            </CardTitle>
            <CardDescription>Your account security status and recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Security Score</span>
                <span className="text-sm font-bold text-green-600">98%</span>
              </div>
              <Progress value={98} className="h-2" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Two-factor authentication enabled</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Strong password set</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Email verified</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>Phone verification pending</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
