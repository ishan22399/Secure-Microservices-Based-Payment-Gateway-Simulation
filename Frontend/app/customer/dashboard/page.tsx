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

import { apiFetch } from "@/lib/api"
export default function CustomerDashboard() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<any[]>([])
  const [recentTransactions, setRecentTransactions] = useState<any[]>([])
  const [paymentMethods, setPaymentMethods] = useState<any[]>([])

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "customer")) {
      router.push("/auth/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (!user || user.role !== "customer") return

    // Fetch stats and recent transactions
    const fetchDashboardData = async () => {
      try {
        // Fetch transactions
        const txRes = await apiFetch(`/transactions?userId=${user.id}&role=customer&limit=5`)
        const txData = await txRes.json()
        setRecentTransactions(
          (txData.transactions || []).map((t: any) => ({
            id: t.id,
            merchant: t.merchantName,
            amount: -Math.abs(t.amount),
            status: t.status,
            date: t.timestamp ? t.timestamp.split("T")[0] : "",
            category: t.category,
          }))
        )

        // Calculate stats
        const totalSpent = txData.transactions?.reduce((sum: number, t: any) => sum + (t.amount || 0), 0) || 0
        const thisMonthSpent = txData.transactions?.filter((t: any) => {
          const d = new Date(t.timestamp)
          const now = new Date()
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
        }).reduce((sum: number, t: any) => sum + (t.amount || 0), 0) || 0
        setStats([
          {
            title: "Total Spent",
            value: `$${totalSpent.toFixed(2)}`,
            change: "+0%",
            icon: DollarSign,
            color: "text-green-600",
          },
          {
            title: "This Month",
            value: `$${thisMonthSpent.toFixed(2)}`,
            change: "+0%",
            icon: TrendingUp,
            color: "text-blue-600",
          },
          {
            title: "Transactions",
            value: `${txData.transactions?.length || 0}`,
            change: "+0%",
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
        ])

        // Fetch payment methods
        const pmRes = await apiFetch(`/payment-methods?userId=${user.id}`)
        const pmData = await pmRes.json()
        setPaymentMethods(
          (pmData.paymentMethods || []).map((pm: any) => ({
            id: pm.id,
            type: pm.cardType || pm.type,
            last4: pm.last4,
            expiry: pm.expiryMonth && pm.expiryYear ? `${pm.expiryMonth.toString().padStart(2, "0")}/${pm.expiryYear}` : "",
            isDefault: pm.isDefault,
          }))
        )
      } catch (e) {
        // Handle error
      }
    }
    fetchDashboardData()
  }, [user])

  const navigation = [
    { name: "Dashboard", href: "/customer/dashboard", icon: Home, current: true },
    { name: "Make Payment", href: "/customer/payment", icon: CreditCard },
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
    <DashboardLayout navigation={navigation} title="Customer Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h1>
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
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                      <CreditCard className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {method.type} •••• {method.last4}
                      </p>
                      <p className="text-sm text-gray-500">Expires {method.expiry}</p>
                    </div>
                  </div>
                  {method.isDefault && <Badge variant="secondary">Default</Badge>}
                </div>
              ))}
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
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.amount < 0 ? "bg-red-100" : "bg-green-100"
                      }`}
                    >
                      {transaction.amount < 0 ? (
                        <ArrowUpRight className="h-5 w-5 text-red-600" />
                      ) : (
                        <ArrowDownRight className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.merchant}</p>
                      <p className="text-sm text-gray-500">
                        {transaction.category} • {transaction.date}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${transaction.amount < 0 ? "text-red-600" : "text-green-600"}`}>
                      ${Math.abs(transaction.amount).toFixed(2)}
                    </p>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
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
// ...existing code...

}
