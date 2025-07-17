"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Shield, TrendingUp, Users, DollarSign, CreditCard, Globe, Activity } from "lucide-react"

export default function AdminAnalyticsPage() {
  const { user } = useAuth()
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("30d")

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: Shield },
    { name: "Users", href: "/admin/users", icon: Shield },
    { name: "Transactions", href: "/admin/transactions", icon: Shield },
    { name: "Security", href: "/admin/security", icon: Shield },
    { name: "System", href: "/admin/system", icon: Shield },
    { name: "Analytics", href: "/admin/analytics", icon: Shield, current: true },
    { name: "Settings", href: "/admin/settings", icon: Shield },
  ]

  useEffect(() => {
    if (user?.id && user?.role === "bank_admin") {
      fetchAnalytics()
    }
  }, [user?.id, user?.role, timeRange])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/analytics?timeRange=${timeRange}`)

      if (!response.ok) {
        throw new Error("Failed to fetch analytics")
      }

      const data = await response.json()
      setAnalytics(data)
    } catch (error) {
      console.error("Failed to fetch analytics:", error)
      setAnalytics(mockAnalyticsData)
    } finally {
      setLoading(false)
    }
  }

  const mockAnalyticsData = {
    totalVolume: 12500000,
    totalTransactions: 45678,
    totalUsers: 8943,
    totalMerchants: 234,
    regions: [
      { name: "North America", percentage: 45, volume: 5625000 },
      { name: "Europe", percentage: 30, volume: 3750000 },
      { name: "Asia Pacific", percentage: 20, volume: 2500000 },
      { name: "Other", percentage: 5, volume: 625000 },
    ],
    merchantTypes: [
      { type: "E-commerce", count: 89, percentage: 38 },
      { type: "SaaS", count: 56, percentage: 24 },
      { type: "Retail", count: 45, percentage: 19 },
      { type: "Other", count: 44, percentage: 19 },
    ],
    transactionTrends: [
      { period: "Week 1", volume: 2800000, transactions: 10234 },
      { period: "Week 2", volume: 3200000, transactions: 11567 },
      { period: "Week 3", volume: 3100000, transactions: 11234 },
      { period: "Week 4", volume: 3400000, transactions: 12643 },
    ],
  }

  const data = analytics || mockAnalyticsData

  if (loading) {
    return (
      <DashboardLayout navigation={navigation} title="Platform Analytics">
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
    <DashboardLayout navigation={navigation} title="Platform Analytics">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Platform Analytics</h2>
            <p className="text-muted-foreground">Comprehensive platform performance metrics</p>
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
              <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${data.totalVolume.toLocaleString()}</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                +15.3% from last period
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.totalTransactions.toLocaleString()}</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                +8.7% from last period
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.totalUsers.toLocaleString()}</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12.1% from last period
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Merchants</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.totalMerchants.toLocaleString()}</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                +5.4% from last period
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Regional Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                Regional Distribution
              </CardTitle>
              <CardDescription>Transaction volume by region</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.regions.map((region: any, index: number) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{region.name}</span>
                    <span>${region.volume.toLocaleString()}</span>
                  </div>
                  <Progress value={region.percentage} className="h-2" />
                  <div className="text-xs text-muted-foreground">{region.percentage}% of total volume</div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Merchant Types */}
          <Card>
            <CardHeader>
              <CardTitle>Merchant Categories</CardTitle>
              <CardDescription>Distribution of merchant types</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.merchantTypes.map((type: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                    <span className="font-medium">{type.type}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">{type.count}</Badge>
                    <span className="text-sm text-muted-foreground">{type.percentage}%</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Transaction Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction Trends</CardTitle>
            <CardDescription>Weekly transaction volume and count trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.transactionTrends.map((trend: any, index: number) => (
                <div key={index} className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{trend.period}</p>
                    <p className="text-sm text-muted-foreground">{trend.transactions.toLocaleString()} transactions</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">${trend.volume.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Volume</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
