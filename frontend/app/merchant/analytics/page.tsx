"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { CreditCard, TrendingUp, Users, DollarSign, Calendar } from "lucide-react"
import { apiFetch } from "@/lib/api"

interface AnalyticsData {
  revenue: {
    current: number
    previous: number
    change: number
  }
  transactions: {
    current: number
    previous: number
    change: number
  }
  customers: {
    current: number
    previous: number
    change: number
  }
  averageOrder: {
    current: number
    previous: number
    change: number
  }
  topProducts: Array<{
    name: string
    revenue: number
    percentage: number
  }>
  paymentMethods: Array<{
    method: string
    percentage: number
    amount: number
  }>
  monthlyTrend: Array<{
    month: string
    revenue: number
    transactions: number
  }>
}

export default function MerchantAnalyticsPage() {
  const { user } = useAuth()
  const [timeRange, setTimeRange] = useState("30d")
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const navigation = [
    { name: "Dashboard", href: "/merchant/dashboard", icon: CreditCard },
    { name: "Transactions", href: "/merchant/transactions", icon: CreditCard },
    { name: "Analytics", href: "/merchant/analytics", icon: CreditCard, current: true },
    { name: "Customers", href: "/merchant/customers", icon: CreditCard },
    { name: "Payment Links", href: "/merchant/payment-links", icon: CreditCard },
    { name: "Settings", href: "/merchant/settings", icon: CreditCard },
  ]

  useEffect(() => {
    if (user?.id) {
      fetchAnalytics()
    }
  }, [timeRange, user?.id])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiFetch(`/api/analytics?merchantId=${user?.id}&timeRange=${timeRange}`)

      if (!response.ok) {
        throw new Error("Failed to fetch analytics")
      }

      const data = await response.json()
      setAnalytics(data)
    } catch (error) {
      console.error("Failed to fetch analytics:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch analytics")
      // Set mock data as fallback
      setAnalytics(mockAnalytics)
    } finally {
      setLoading(false)
    }
  }

  const mockAnalytics: AnalyticsData = {
    revenue: {
      current: 125000,
      previous: 98000,
      change: 27.6,
    },
    transactions: {
      current: 1247,
      previous: 1089,
      change: 14.5,
    },
    customers: {
      current: 342,
      previous: 298,
      change: 14.8,
    },
    averageOrder: {
      current: 100.24,
      previous: 89.98,
      change: 11.4,
    },
    topProducts: [
      { name: "Premium Plan", revenue: 45000, percentage: 36 },
      { name: "Basic Plan", revenue: 32000, percentage: 26 },
      { name: "Enterprise Plan", revenue: 28000, percentage: 22 },
      { name: "Add-ons", revenue: 20000, percentage: 16 },
    ],
    paymentMethods: [
      { method: "Credit Card", percentage: 65, amount: 81250 },
      { method: "Debit Card", percentage: 25, amount: 31250 },
      { method: "Bank Transfer", percentage: 10, amount: 12500 },
    ],
    monthlyTrend: [
      { month: "Jan", revenue: 85000, transactions: 890 },
      { month: "Feb", revenue: 92000, transactions: 945 },
      { month: "Mar", revenue: 98000, transactions: 1089 },
      { month: "Apr", revenue: 125000, transactions: 1247 },
    ],
  }

  const data = analytics || mockAnalytics

  if (loading) {
    return (
      <DashboardLayout navigation={navigation} title="Analytics">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading analytics...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout navigation={navigation} title="Analytics">
      <div className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Time Range Selector */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Business Analytics</h2>
            <p className="text-muted-foreground">Track your business performance and growth</p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${data.revenue.current.toLocaleString()}</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />+{data.revenue.change}% from last period
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transactions</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.transactions.current.toLocaleString()}</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />+{data.transactions.change}% from last period
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.customers.current.toLocaleString()}</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />+{data.customers.change}% from last period
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Order</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${data.averageOrder.current.toFixed(2)}</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />+{data.averageOrder.change}% from last period
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Top Products</CardTitle>
              <CardDescription>Revenue breakdown by product category</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.topProducts.map((product, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{product.name}</span>
                    <span>${product.revenue.toLocaleString()}</span>
                  </div>
                  <Progress value={product.percentage} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Distribution of payment methods used</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.paymentMethods.map((method, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{method.method}</span>
                    <span>{method.percentage}%</span>
                  </div>
                  <Progress value={method.percentage} className="h-2" />
                  <div className="text-xs text-muted-foreground">${method.amount.toLocaleString()} revenue</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Revenue Trend Chart Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue and transaction trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Chart visualization would go here</p>
                <p className="text-sm text-gray-400">Integration with charting library needed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
