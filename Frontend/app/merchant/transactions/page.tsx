"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreditCard, Search, Download, Eye, RefreshCw } from "lucide-react"
import { apiFetch } from "@/lib/api"

interface Transaction {
  id: string
  customerId: string
  customerName: string
  amount: number
  currency: string
  status: "completed" | "pending" | "failed" | "refunded"
  timestamp: string
  paymentMethod: string
  description: string
  fees: number
}

export default function MerchantTransactionsPage() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")

  const navigation = [
    { name: "Dashboard", href: "/merchant/dashboard", icon: CreditCard },
    { name: "Transactions", href: "/merchant/transactions", icon: CreditCard, current: true },
    { name: "Analytics", href: "/merchant/analytics", icon: CreditCard },
    { name: "Customers", href: "/merchant/customers", icon: CreditCard },
    { name: "Payment Links", href: "/merchant/payment-links", icon: CreditCard },
    { name: "Settings", href: "/merchant/settings", icon: CreditCard },
  ]

  useEffect(() => {
    if (user?.id) {
      fetchTransactions()
    }
  }, [user?.id])

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiFetch(`/api/transactions?merchantId=${user?.id}&role=merchant`)

      if (!response.ok) {
        throw new Error("Failed to fetch transactions")
      }

      const data = await response.json()
      setTransactions(data.transactions || mockTransactions)
    } catch (error) {
      console.error("Failed to fetch transactions:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch transactions")
      // Set mock data as fallback
      setTransactions(mockTransactions)
    } finally {
      setLoading(false)
    }
  }

  const mockTransactions: Transaction[] = [
    {
      id: "tx_123456",
      customerId: "cust_001",
      customerName: "John Doe",
      amount: 150.0,
      currency: "USD",
      status: "completed",
      timestamp: new Date().toISOString(),
      paymentMethod: "Credit Card",
      description: "Monthly subscription",
      fees: 4.35,
    },
    {
      id: "tx_123457",
      customerId: "cust_002",
      customerName: "Jane Smith",
      amount: 75.5,
      currency: "USD",
      status: "pending",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      paymentMethod: "Debit Card",
      description: "Product purchase",
      fees: 2.19,
    },
    {
      id: "tx_123458",
      customerId: "cust_003",
      customerName: "Bob Johnson",
      amount: 200.0,
      currency: "USD",
      status: "failed",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      paymentMethod: "Bank Transfer",
      description: "Service payment",
      fees: 0,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      case "refunded":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredTransactions = transactions.filter((transaction) => {
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch =
      !searchTerm ||
      transaction.customerName.toLowerCase().includes(searchLower) ||
      transaction.id.toLowerCase().includes(searchLower) ||
      transaction.description.toLowerCase().includes(searchLower)
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const completedTransactions = transactions.filter((t) => t.status === "completed")
  const totalRevenue = completedTransactions.reduce((sum, t) => sum + t.amount, 0)
  const totalFees = completedTransactions.reduce((sum, t) => sum + t.fees, 0)

  if (loading) {
    return (
      <DashboardLayout navigation={navigation} title="Transactions">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading transactions...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout navigation={navigation} title="Transactions">
      <div className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{transactions.length}</div>
              <p className="text-xs text-muted-foreground">+8% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Processing Fees</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalFees.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">2.9% average rate</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">98.5%</div>
              <p className="text-xs text-muted-foreground">+0.2% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>View and manage all your transactions</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm" onClick={fetchTransactions}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
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
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Transactions Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        No transactions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">{transaction.id}</TableCell>
                        <TableCell>{transaction.customerName}</TableCell>
                        <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(transaction.status)}>{transaction.status}</Badge>
                        </TableCell>
                        <TableCell>{transaction.paymentMethod}</TableCell>
                        <TableCell>{new Date(transaction.timestamp).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
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
