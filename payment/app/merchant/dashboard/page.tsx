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
  Users,
  BarChart3,
  Plus,
  Download,
  Eye,
  ArrowDownRight,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap,
  Globe,
  Shield,
} from "lucide-react"

export default function MerchantDashboard() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalRevenue: 45231.89,
      transactions: 2350,
      successRate: 98.5,
      activeCustomers: 1234,
    },
    recentTransactions: [
      {
        id: "TXN-001",
        customer: "John Doe",
        amount: 299.99,
        status: "completed",
        date: "2024-01-10",
        paymentMethod: "Visa ****4532",
      },
      {
        id: "TXN-002",
        customer: "Jane Smith",
        amount: 156.5,
        status: "completed",
        date: "2024-01-10",
        paymentMethod: "Mastercard ****8901",
      },
      {
        id: "TXN-003",
        customer: "Bob Johnson",
        amount: 89.99,
        status: "pending",
        date: "2024-01-10",
        paymentMethod: "Apple Pay",
      },
      {
        id: "TXN-004",
        customer: "Alice Brown",
        amount: 234.75,
        status: "completed",
        date: "2024-01-09",
        paymentMethod: "Visa ****1234",
      },
    ],
    revenueData: [
      { day: "Mon", amount: 2847.5, percentage: 85 },
      { day: "Tue", amount: 2234.8, percentage: 67 },
      { day: "Wed", amount: 3456.2, percentage: 92 },
      { day: "Thu", amount: 2890.4, percentage: 78 },
      { day: "Fri", amount: 4123.6, percentage: 95 },
      { day: "Sat", amount: 1876.3, percentage: 45 },
      { day: "Sun", amount: 2028.1, percentage: 52 },
    ],
  })

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "merchant")) {
      router.push("/auth/login")
    }
  }, [user, isLoading, router])

  const navigation = [
    { name: "Dashboard", href: "/merchant/dashboard", icon: Home, current: true },
    { name: "Transactions", href: "/merchant/transactions", icon: History },
    { name: "Analytics", href: "/merchant/analytics", icon: BarChart3 },
    { name: "Customers", href: "/merchant/customers", icon: Users },
    { name: "Settings", href: "/merchant/settings", icon: Settings },
    { name: "Profile", href: "/merchant/profile", icon: User },
  ]

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "bg-emerald-100 text-emerald-800 border-emerald-200",
      pending: "bg-amber-100 text-amber-800 border-amber-200",
      failed: "bg-red-100 text-red-800 border-red-200",
    }
    return <Badge className={`${variants[status as keyof typeof variants]} border`}>{status}</Badge>
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-emerald-600" />
      case "pending":
        return <Clock className="w-4 h-4 text-amber-600" />
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
          <p className="text-gray-600 animate-pulse">Loading merchant dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <DashboardLayout navigation={navigation} title="Merchant Dashboard">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-green-600 via-green-500 to-blue-600 rounded-2xl p-8 text-white shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}! 🚀</h1>
                <p className="text-green-100 text-lg">Manage your business payments and track your revenue growth.</p>
                <div className="flex items-center space-x-6 mt-4">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-5 h-5" />
                    <span>All systems operational</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5" />
                    <span>Secure payments</span>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-16 h-16 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Total Revenue",
                value: `$${dashboardData.stats.totalRevenue.toLocaleString()}`,
                change: "+20.1%",
                icon: DollarSign,
                color: "text-green-600",
                bgColor: "bg-green-100",
                progress: 85,
              },
              {
                title: "Transactions",
                value: dashboardData.stats.transactions.toLocaleString(),
                change: "+15.3%",
                icon: CreditCard,
                color: "text-blue-600",
                bgColor: "bg-blue-100",
                progress: 72,
              },
              {
                title: "Success Rate",
                value: `${dashboardData.stats.successRate}%`,
                change: "+2.1%",
                icon: CheckCircle,
                color: "text-purple-600",
                bgColor: "bg-purple-100",
                progress: 98,
              },
              {
                title: "Active Customers",
                value: dashboardData.stats.activeCustomers.toLocaleString(),
                change: "+12.5%",
                icon: Users,
                color: "text-orange-600",
                bgColor: "bg-orange-100",
                progress: 68,
              },
            ].map((stat, index) => (
              <Card
                key={index}
                className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                  <div className={`p-2 ${stat.bgColor} rounded-lg group-hover:scale-110 transition-transform`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                  <p className="text-xs text-gray-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                    <span className="text-green-600">{stat.change}</span> from last month
                  </p>
                  <Progress value={stat.progress} className="mt-3 h-2" />
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">Quick Actions</CardTitle>
                <CardDescription>Common merchant tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  className="w-full justify-start bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg transition-all duration-200"
                  onClick={() => router.push("/merchant/payment-link")}
                >
                  <Plus className="mr-3 h-4 w-4" />
                  Create Payment Link
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-gray-300 hover:bg-gray-50 bg-transparent"
                  onClick={() => router.push("/merchant/analytics")}
                >
                  <BarChart3 className="mr-3 h-4 w-4" />
                  View Analytics
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-gray-300 hover:bg-gray-50 bg-transparent"
                  onClick={() => router.push("/merchant/transactions")}
                >
                  <Download className="mr-3 h-4 w-4" />
                  Export Transactions
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-gray-300 hover:bg-gray-50 bg-transparent"
                  onClick={() => router.push("/merchant/customers")}
                >
                  <Users className="mr-3 h-4 w-4" />
                  Manage Customers
                </Button>
              </CardContent>
            </Card>

            {/* Revenue Chart */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">Revenue Overview</CardTitle>
                <CardDescription>Last 7 days performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.revenueData.slice(0, 4).map((day, index) => (
                    <div key={day.day} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{day.day}</span>
                      <span className="font-semibold text-gray-900">${day.amount.toLocaleString()}</span>
                      <div className="w-20">
                        <Progress value={day.percentage} className="h-2" />
                      </div>
                    </div>
                  ))}
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Weekly Total</span>
                      <span className="text-lg font-bold text-green-600">
                        ${dashboardData.revenueData.reduce((sum, day) => sum + day.amount, 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-purple-900 flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Performance
                </CardTitle>
                <CardDescription className="text-purple-700">Key business metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-purple-800">Peak Hours</span>
                  <span className="font-bold text-purple-900">2-4 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-purple-800">Top Payment Method</span>
                  <span className="font-bold text-purple-900">Visa (45%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-purple-800">Average Order</span>
                  <span className="font-bold text-purple-900">$127.50</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-purple-800">Response Time</span>
                  <span className="font-bold text-purple-900">45ms</span>
                </div>
                <div className="pt-2">
                  <Badge className="bg-purple-200 text-purple-800 w-full justify-center">
                    <Globe className="w-4 h-4 mr-1" />
                    Global Coverage Active
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold text-gray-900">Recent Transactions</CardTitle>
                  <CardDescription>Latest payment activity from your customers</CardDescription>
                </div>
                <Button
                  variant="outline"
                  onClick={() => router.push("/merchant/transactions")}
                  className="hover:bg-gray-50"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.recentTransactions.map((transaction, index) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200 bg-white/70"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                        <ArrowDownRight className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{transaction.customer}</p>
                        <p className="text-sm text-gray-600">
                          {transaction.paymentMethod} • {new Date(transaction.date).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500">ID: {transaction.id}</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center space-x-4">
                      <div>
                        <p className="font-bold text-lg text-green-600">+${transaction.amount.toFixed(2)}</p>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(transaction.status)}
                          {getStatusBadge(transaction.status)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Business Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-200 rounded-xl">
                    <Clock className="h-8 w-8 text-blue-700" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-900">2-4 PM</div>
                    <div className="text-sm text-blue-700">Peak transaction hours</div>
                    <div className="text-xs text-blue-600 mt-1">35% of daily volume</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-200 rounded-xl">
                    <CreditCard className="h-8 w-8 text-green-700" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-900">Visa</div>
                    <div className="text-sm text-green-700">Top payment method</div>
                    <div className="text-xs text-green-600 mt-1">45% of transactions</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-200 rounded-xl">
                    <TrendingUp className="h-8 w-8 text-purple-700" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-900">$127.50</div>
                    <div className="text-sm text-purple-700">Average order value</div>
                    <div className="text-xs text-purple-600 mt-1">+8% from last month</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </div>
  )
}
