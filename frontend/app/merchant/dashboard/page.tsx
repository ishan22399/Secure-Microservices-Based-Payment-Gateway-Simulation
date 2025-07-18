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
} from "lucide-react"
import { supabase } from "@/lib/supabase-client"
import { Database } from "@/types/supabase"

type Transaction = Database['public']['Tables']['transactions']['Row']

export default function MerchantDashboard() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [totalRevenue, setTotalRevenue] = useState<number>(0)
  const [totalTransactionsCount, setTotalTransactionsCount] = useState<number>(0)
  const [successRate, setSuccessRate] = useState<number>(0)

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "merchant")) {
      router.push("/auth/login")
    }

    if (user) {
      fetchMerchantData()
    }
  }, [user, isLoading, router])

  const fetchMerchantData = async () => {
    if (!user || !user.id) return

    // Fetch transactions for the merchant
    const { data: transactionsData, error: transactionsError } = await supabase
      .from('transactions')
      .select('*')
      .eq('merchant_id', user.id)
      .order('timestamp', { ascending: false })
      .limit(4) // Fetch recent transactions

    if (transactionsError) {
      console.error("Error fetching merchant transactions:", transactionsError)
    } else {
      setTransactions(transactionsData || [])

      const completedTxns = transactionsData?.filter(t => t.status === 'completed') || []
      const revenue = completedTxns.reduce((sum, t) => sum + (t.amount || 0), 0)
      setTotalRevenue(revenue)
      setTotalTransactionsCount(transactionsData?.length || 0)

      const successfulCount = completedTxns.length
      const totalCount = transactionsData?.length || 0
      if (totalCount > 0) {
        setSuccessRate((successfulCount / totalCount) * 100)
      } else {
        setSuccessRate(0)
      }
    }
  }

  const navigation = [
    { name: "Dashboard", href: "/merchant/dashboard", icon: Home, current: true },
    { name: "Transactions", href: "/merchant/transactions", icon: History },
    { name: "Analytics", href: "/merchant/analytics", icon: BarChart3 },
    { name: "Customers", href: "/merchant/customers", icon: Users },
    { name: "Settings", href: "/merchant/settings", icon: Settings },
    { name: "Profile", href: "/merchant/profile", icon: User },
  ]

  const stats = [
    {
      title: "Total Revenue",
      value: `${totalRevenue.toFixed(2)}`,
      change: "+20.1%", // Placeholder, needs actual calculation
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Transactions",
      value: totalTransactionsCount.toString(),
      change: "+15.3%", // Placeholder, needs actual calculation
      icon: CreditCard,
      color: "text-blue-600",
    },
    {
      title: "Success Rate",
      value: `${successRate.toFixed(1)}%`,
      change: "+2.1%", // Placeholder, needs actual calculation
      icon: TrendingUp,
      color: "text-purple-600",
    },
    {
      title: "Active Customers",
      value: "1,234", // Placeholder, needs actual data
      change: "+12.5%",
      icon: Users,
      color: "text-orange-600",
    },
  ]

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: string } = {
      completed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      failed: "bg-red-100 text-red-800",
    }
    return <Badge className={variants[status]}>{status}</Badge>
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
          <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.full_name || user?.email}!</h1>
          <p className="text-green-100">Manage your business payments and track your revenue growth.</p>
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
                onClick={() => router.push("/merchant/analytics")}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                View Analytics
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => router.push("/merchant/transactions")}
              >
                <Download className="mr-2 h-4 w-4" />
                Export Transactions
              </Button>
            </CardContent>
          </Card>

          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>Last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Today</span>
                  <span className="font-semibold">$2,847.50</span>
                </div>
                <Progress value={85} className="h-2" />
                <div className="flex items-center justify-between">
                  <span className="text-sm">Yesterday</span>
                  <span className="font-semibold">$2,234.80</span>
                </div>
                <Progress value={67} className="h-2" />
                <div className="flex items-center justify-between">
                  <span className="text-sm">This Week</span>
                  <span className="font-semibold">$18,456.90</span>
                </div>
                <Progress value={92} className="h-2" />
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
                <Eye className="mr-2 h-4 w-4" />
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
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <ArrowDownRight className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p> {/* Assuming description can act as customer name for now */}
                        <p className="text-sm text-gray-500">
                          {new Date(transaction.timestamp || '').toLocaleDateString()} {/* Assuming timestamp exists */}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">+${(transaction.amount || 0).toFixed(2)}</p>
                      {getStatusBadge(transaction.status || 'pending')}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No recent transactions found.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Business Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Peak Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2-4 PM</div>
              <p className="text-sm text-gray-500">Highest transaction volume</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Visa</div>
              <p className="text-sm text-gray-500">45% of all transactions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Average Order</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$127.50</div>
              <p className="text-sm text-gray-500">+8% from last month</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
