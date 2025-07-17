"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { apiClient } from "@/lib/api"
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  Clock,
  Plus,
  Eye,
  Wallet,
  Activity,
  Shield,
  Zap,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"

interface Transaction {
  id: number
  transactionId: string
  merchantName: string
  amount: number
  currency: string
  status: string
  paymentMethod: string
  description: string
  createdAt: string
}

interface Stats {
  totalTransactions: number
  completedTransactions: number
  pendingTransactions: number
  totalAmount: number
}

export default function CustomerDashboard() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "CUSTOMER")) {
      router.push("/auth/login")
      return
    }

    if (user) {
      fetchDashboardData()
    }
  }, [user, isLoading, router])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // Fetch recent transactions
      const transactionsResponse = await apiClient.getRecentTransactions(5)
      setTransactions(transactionsResponse)

      // Fetch stats
      const statsResponse = await apiClient.getTransactionStats()
      setStats(statsResponse)
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "failed":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      case "pending":
        return <Clock className="w-4 h-4" />
      case "failed":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-gray-600 animate-pulse">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Welcome back, {user?.name}!
                </h1>
                <p className="text-gray-600">Manage your payments and track your spending</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Link href="/customer/payment">
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200">
                  <Plus className="w-4 h-4 mr-2" />
                  New Payment
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => router.push("/auth/login")}
                className="border-gray-300 hover:bg-gray-50"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Transactions</CardTitle>
              <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <DollarSign className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats?.totalTransactions || 0}</div>
              <p className="text-xs text-gray-600 mt-1">All time transactions</p>
              <Progress value={75} className="mt-3 h-2" />
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
              <div className="p-2 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600">{stats?.completedTransactions || 0}</div>
              <p className="text-xs text-gray-600 mt-1">Successful payments</p>
              <Progress value={92} className="mt-3 h-2" />
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
              <div className="p-2 bg-amber-100 rounded-lg group-hover:bg-amber-200 transition-colors">
                <Clock className="h-4 w-4 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">{stats?.pendingTransactions || 0}</div>
              <p className="text-xs text-gray-600 mt-1">Processing payments</p>
              <Progress value={15} className="mt-3 h-2" />
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Amount</CardTitle>
              <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">${stats?.totalAmount?.toFixed(2) || "0.00"}</div>
              <p className="text-xs text-gray-600 mt-1">Total processed</p>
              <Progress value={68} className="mt-3 h-2" />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Transactions */}
          <div className="lg:col-span-2">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-semibold text-gray-900">Recent Transactions</CardTitle>
                    <CardDescription className="text-gray-600">Your latest payment activities</CardDescription>
                  </div>
                  <Link href="/customer/transactions">
                    <Button variant="outline" size="sm" className="hover:bg-gray-50 bg-transparent">
                      <Eye className="w-4 h-4 mr-2" />
                      View All
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CreditCard className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
                    <p className="text-gray-500 mb-6">Start by making your first payment</p>
                    <Link href="/customer/payment">
                      <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                        <Plus className="w-4 h-4 mr-2" />
                        Make Your First Payment
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {transactions.map((transaction, index) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200 bg-white/50"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                            <CreditCard className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{transaction.merchantName}</p>
                            <p className="text-sm text-gray-600">{transaction.description}</p>
                            <p className="text-xs text-gray-400">
                              {new Date(transaction.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-gray-900">
                            ${transaction.amount.toFixed(2)} {transaction.currency}
                          </p>
                          <Badge className={`${getStatusColor(transaction.status)} border flex items-center space-x-1`}>
                            {getStatusIcon(transaction.status)}
                            <span className="capitalize">{transaction.status}</span>
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Insights */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/customer/payment">
                  <Button className="w-full justify-start bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg transition-all duration-200">
                    <CreditCard className="w-4 h-4 mr-3" />
                    Make Payment
                  </Button>
                </Link>
                <Link href="/customer/transactions">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-gray-300 hover:bg-gray-50 bg-transparent"
                  >
                    <Activity className="w-4 h-4 mr-3" />
                    View Transactions
                  </Button>
                </Link>
                <Link href="/customer/payment-methods">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-gray-300 hover:bg-gray-50 bg-transparent"
                  >
                    <Wallet className="w-4 h-4 mr-3" />
                    Payment Methods
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Security Status */}
            <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-emerald-900 flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Security Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-emerald-800">Account Security</span>
                    <Badge className="bg-emerald-200 text-emerald-800">Excellent</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-emerald-800">2FA Enabled</span>
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-emerald-800">SSL Protected</span>
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Insights */}
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-purple-900 flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  This Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-purple-800">Spending Goal</span>
                      <span className="text-purple-800">$1,200 / $2,000</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                  <div className="text-center pt-2">
                    <p className="text-2xl font-bold text-purple-900">$800</p>
                    <p className="text-sm text-purple-700">Remaining budget</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
