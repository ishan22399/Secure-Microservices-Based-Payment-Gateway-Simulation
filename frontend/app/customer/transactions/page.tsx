"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Home,
  CreditCard,
  History,
  Settings,
  User,
  Search,
  Download,
  Eye,
  ArrowDownRight,
  Calendar,
} from "lucide-react"
import { supabase } from "@/lib/supabase-client"
import { Database } from "@/types/supabase"

type Transaction = Database['public']['Tables']['transactions']['Row']

export default function CustomerTransactions() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [totalTransactions, setTotalTransactions] = useState<number>(0)
  const [totalSpent, setTotalSpent] = useState<number>(0)
  const [monthlySpent, setMonthlySpent] = useState<number>(0)

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "customer")) {
      router.push("/auth/login")
    }

    if (user) {
      fetchTransactions()
    }
  }, [user, isLoading, router, searchTerm, statusFilter, dateFilter])

  const fetchTransactions = async () => {
    if (!user) return

    let query = supabase.from('transactions').select('*', { count: 'exact' })

    query = query.eq('customer_id', user.id)

    if (statusFilter !== "all") {
      query = query.eq('status', statusFilter)
    }

    if (searchTerm) {
      query = query.or(`description.ilike.%${searchTerm}%,id.ilike.%${searchTerm}%`)
    }

    // Basic date filtering (can be expanded)
    const today = new Date()
    if (dateFilter === "today") {
      const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString()
      const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString()
      query = query.gte('timestamp', startOfDay).lte('timestamp', endOfDay)
    } else if (dateFilter === "week") {
      const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay())).toISOString()
      query = query.gte('timestamp', startOfWeek)
    } else if (dateFilter === "month") {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString()
      query = query.gte('timestamp', startOfMonth)
    }

    const { data, error, count } = await query.order('timestamp', { ascending: false })

    if (error) {
      console.error("Error fetching transactions:", error)
    } else {
      setTransactions(data || [])
      setTotalTransactions(count || 0)

      const spent = data?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0
      setTotalSpent(spent)

      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      const monthly = data?.filter(t => {
        const transactionDate = new Date(t.timestamp || '')
        return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear
      }).reduce((sum, t) => sum + (t.amount || 0), 0) || 0
      setMonthlySpent(monthly)
    }
  }

  const navigation = [
    { name: "Dashboard", href: "/customer/dashboard", icon: Home },
    { name: "Make Payment", href: "/customer/payment", icon: CreditCard },
    { name: "Transaction History", href: "/customer/transactions", icon: History, current: true },
    { name: "Payment Methods", href: "/customer/payment-methods", icon: CreditCard },
    { name: "Profile", href: "/customer/profile", icon: User },
    { name: "Settings", href: "/customer/settings", icon: Settings },
  ]

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: string } = {
      completed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      failed: "bg-red-100 text-red-800",
    }
    return <Badge className={variants[status]}>{status}</Badge>
  }

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
    <DashboardLayout navigation={navigation} title="Transaction History">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <ArrowDownRight className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Spent</p>
                  <p className="text-2xl font-bold">${totalSpent.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Transactions</p>
                  <p className="text-2xl font-bold">{totalTransactions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">This Month</p>
                  <p className="text-2xl font-bold">${monthlySpent.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>View and manage your payment history</CardDescription>
              </div>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Transactions Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction</TableHead>
                    <TableHead>Merchant</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.length > 0 ? (
                    transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{transaction.id}</p>
                            <p className="text-sm text-gray-500">{transaction.description}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{transaction.merchant_id}</span> {/* Assuming merchant_id can be displayed directly for now */}
                            {/* <Badge variant="secondary" className={getCategoryColor(transaction.category)}>
                              {transaction.category}
                            </Badge> */}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`font-semibold ${(transaction.amount || 0) < 0 ? "text-red-600" : "text-green-600"}`}>
                            ${Math.abs(transaction.amount || 0).toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell>{getStatusBadge(transaction.status || 'pending')}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{new Date(transaction.timestamp || '').toLocaleDateString()}</p>
                            <p className="text-sm text-gray-500">{new Date(transaction.timestamp || '').toLocaleTimeString()}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{transaction.payment_method_id}</span> {/* Assuming payment_method_id can be displayed directly for now */}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <p className="text-gray-500">No transactions found matching your criteria.</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
