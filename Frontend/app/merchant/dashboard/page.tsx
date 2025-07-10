"use client"

import { useEffect } from "react"
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
  Activity,
  Plus,
  Download,
  BarChart3,
  Code,
} from "lucide-react"

export default function MerchantDashboard() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "merchant")) {
      router.push("/auth/login")
    }
  }, [user, isLoading, router])

  const navigation = [
    { name: "Dashboard", href: "/merchant/dashboard", icon: Home, current: true },
    { name: "Transactions", href: "/merchant/transactions", icon: History },
    { name: "Analytics", href: "/merchant/analytics", icon: BarChart3 },
    { name: "Payment Links", href: "/merchant/payment-links", icon: CreditCard },
    { name: "API Integration", href: "/merchant/integration", icon: Code },
    { name: "Profile", href: "/merchant/profile", icon: User },
    { name: "Settings", href: "/merchant/settings", icon: Settings },
  ]

  const stats = [
    {
      title: "Total Revenue",
      value: "$24,847.50",
      change: "+12.5%",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "This Month",
      value: "$4,567.80",
      change: "+8.2%",
      icon: TrendingUp,
      color: "text-blue-600",
    },
    {
      title: "Transactions",
      value: "1,247",
      change: "+15.3%",
      icon: CreditCard,
      color: "text-purple-600",
    },
    {
      title: "Success Rate",
      value: "99.2%",
      change: "+0.5%",
      icon: Activity,
      color: "text-green-600",
    },
  ]

  const recentTransactions = [
    {
      id: "TXN-001",
      customer: "john.doe@email.com",
      amount: 299.99,
      status: "completed",
      date: "2024-01-10",
      paymentMethod: "Visa ****4532",
    },
    {
      id: "TXN-002",
      customer: "jane.smith@email.com",
      amount: 89.99,
      status: "completed",
      date: "2024-01-10",
      paymentMethod: "Mastercard ****8901",
    },
    {
      id: "TXN-003",
      customer: "bob.wilson@email.com",
      amount: 156.5,
      status: "pending",
      date: "2024-01-10",
      paymentMethod: "Apple Pay",
    },
    {
      id: "TXN-004",
      customer: "alice.brown@email.com",
      amount: 45.0,
      status: "failed",
      date: "2024-01-09",
      paymentMethod: "Visa ****2345",
    },
  ]

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      failed: "bg-red-100 text-red-800",
    }
    return <Badge className={variants[status as keyof typeof variants]}>{status}</Badge>
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <DashboardLayout navigation={navigation} title="Merchant Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-green-100">Manage your payments and grow your business with our secure platform.</p>
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
              <CardDescription>Common merchant tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                className="w-full justify-start bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                onClick={() => router.push("/merchant/payment-links")}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Payment Link
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => router.push("/merchant/transactions")}
              >
                <History className="mr-2 h-4 w-4" />
                View All Transactions
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => router.push("/merchant/analytics")}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                View Analytics
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Download className="mr-2 h-4 w-4" />
                Export Reports
              </Button>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Your business performance overview</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Success Rate</span>
                  <span className="font-medium">99.2%</span>
                </div>
                <Progress value={99.2} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Customer Satisfaction</span>
                  <span className="font-medium">96.8%</span>
                </div>
                <Progress value={96.8} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Average Response Time</span>
                  <span className="font-medium">1.2s</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">847</div>
                  <div className="text-xs text-green-700">Active Customers</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">$127</div>
                  <div className="text-xs text-blue-700">Avg Transaction</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Latest payment activity</CardDescription>
              </div>
              <Button variant="outline" onClick={() => router.push("/merchant/transactions")}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">{transaction.customer}</p>
                      <p className="text-sm text-gray-500">
                        {transaction.paymentMethod} • {transaction.date}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${transaction.amount.toFixed(2)}</p>
                    {getStatusBadge(transaction.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Revenue Chart Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Revenue chart will be displayed here</p>
                <Button
                  variant="outline"
                  className="mt-2 bg-transparent"
                  onClick={() => router.push("/merchant/analytics")}
                >
                  View Detailed Analytics
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
