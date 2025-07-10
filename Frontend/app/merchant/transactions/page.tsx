"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Home,
  CreditCard,
  History,
  Settings,
  User,
  Search,
  Download,
  Eye,
  RefreshCw,
  TrendingUp,
  DollarSign,
  Users,
  BarChart3,
  Code,
} from "lucide-react"

export default function MerchantTransactions() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "merchant")) {
      router.push("/auth/login")
    }
  }, [user, isLoading, router])

  const navigation = [
    { name: "Dashboard", href: "/merchant/dashboard", icon: Home },
    { name: "Transactions", href: "/merchant/transactions", icon: History, current: true },
    { name: "Analytics", href: "/merchant/analytics", icon: BarChart3 },
    { name: "Payment Links", href: "/merchant/payment-links", icon: CreditCard },
    { name: "API Integration", href: "/merchant/integration", icon: Code },
    { name: "Profile", href: "/merchant/profile", icon: User },
    { name: "Settings", href: "/merchant/settings", icon: Settings },
  ]

  const transactions = [
    {
      id: "TXN-001",
      customer: "john.doe@email.com",
      customerName: "John Doe",
      amount: 299.99,
      status: "completed",
      date: "2024-01-10",
      time: "14:32",
      paymentMethod: "Visa ****4532",
      description: "Product purchase - Electronics",
      fee: 8.99,
      net: 291.0,
    },
    {
      id: "TXN-002",
      customer: "jane.smith@email.com",
      customerName: "Jane Smith",
      amount: 89.99,
      status: "completed",
      date: "2024-01-10",
      time: "12:15",
      paymentMethod: "Mastercard ****8901",
      description: "Service subscription",
      fee: 2.7,
      net: 87.29,
    },
    {
      id: "TXN-003",
      customer: "bob.wilson@email.com",
      customerName: "Bob Wilson",
      amount: 156.5,
      status: "pending",
      date: "2024-01-10",
      time: "11:45",
      paymentMethod: "Apple Pay",
      description: "Digital product",
      fee: 4.7,
      net: 151.8,
    },
    {
      id: "TXN-004",
      customer: "alice.brown@email.com",
      customerName: "Alice Brown",
      amount: 45.0,
      status: "failed",
      date: "2024-01-09",
      time: "18:20",
      paymentMethod: "Visa ****2345",
      description: "Payment declined",
      fee: 0,
      net: 0,
    },
    {
      id: "TXN-005",
      customer: "charlie.davis@email.com",
      customerName: "Charlie Davis",
      amount: 234.75,
      status: "completed",
      date: "2024-01-09",
      time: "16:30",
      paymentMethod: "Mastercard ****5678",
      description: "Bulk order",
      fee: 7.04,
      net: 227.71,
    },
    {
      id: "TXN-006",
      customer: "diana.miller@email.com",
      customerName: "Diana Miller",
      amount: 67.25,
      status: "refunded",
      date: "2024-01-09",
      time: "14:15",
      paymentMethod: "Visa ****9012",
      description: "Product return",
      fee: -2.02,
      net: -67.25,
    },
    {
      id: "TXN-007",
      customer: "evan.taylor@email.com",
      customerName: "Evan Taylor",
      amount: 123.45,
      status: "completed",
      date: "2024-01-08",
      time: "20:45",
      paymentMethod: "PayPal",
      description: "Online service",
      fee: 3.7,
      net: 119.75,
    },
    {
      id: "TXN-008",
      customer: "fiona.clark@email.com",
      customerName: "Fiona Clark",
      amount: 89.0,
      status: "disputed",
      date: "2024-01-08",
      time: "13:22",
      paymentMethod: "Visa ****3456",
      description: "Chargeback initiated",
      fee: 15.0,
      net: -15.0,
    },
  ]

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      failed: "bg-red-100 text-red-800",
      refunded: "bg-blue-100 text-blue-800",
      disputed: "bg-orange-100 text-orange-800",
    }
    return <Badge className={variants[status as keyof typeof variants]}>{status}</Badge>
  }

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const totalRevenue = transactions.filter((t) => t.status === "completed").reduce((sum, t) => sum + t.amount, 0)
  const totalFees = transactions.filter((t) => t.status === "completed").reduce((sum, t) => sum + t.fee, 0)
  const netRevenue = totalRevenue - totalFees

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <DashboardLayout navigation={navigation} title="Transaction Management">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Net Revenue</p>
                  <p className="text-2xl font-bold">${netRevenue.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <History className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Transactions</p>
                  <p className="text-2xl font-bold">{transactions.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Processing Fees</p>
                  <p className="text-2xl font-bold">${totalFees.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Transaction Management</CardTitle>
                <CardDescription>Monitor and manage all payment transactions</CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
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
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                  <SelectItem value="disputed">Disputed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Date Range" />
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
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Fee</TableHead>
                    <TableHead>Net Amount</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <div>
                          <p className="font-mono text-sm">{transaction.id}</p>
                          <p className="text-xs text-gray-500">{transaction.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{transaction.customerName}</p>
                          <p className="text-sm text-gray-500">{transaction.customer}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold">${transaction.amount.toFixed(2)}</span>
                      </TableCell>
                      <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                      <TableCell>
                        <span className="text-sm">{transaction.paymentMethod}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">${transaction.fee.toFixed(2)}</span>
                      </TableCell>
                      <TableCell>
                        <span className={`font-medium ${transaction.net >= 0 ? "text-green-600" : "text-red-600"}`}>
                          ${transaction.net.toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{transaction.date}</div>
                          <div className="text-gray-500">{transaction.time}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredTransactions.length === 0 && (
              <div className="text-center py-8">
                <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No transactions found matching your criteria</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
