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
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
} from "lucide-react"

export default function CustomerTransactions() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "customer")) {
      router.push("/auth/login")
    }
  }, [user, isLoading, router])

  const navigation = [
    { name: "Dashboard", href: "/customer/dashboard", icon: Home },
    { name: "Make Payment", href: "/customer/payment", icon: CreditCard },
    { name: "Transaction History", href: "/customer/transactions", icon: History, current: true },
    { name: "Payment Methods", href: "/customer/payment-methods", icon: CreditCard },
    { name: "Profile", href: "/customer/profile", icon: User },
    { name: "Settings", href: "/customer/settings", icon: Settings },
  ]

  const transactions = [
    {
      id: "TXN-001",
      merchant: "Amazon Store",
      amount: -299.99,
      status: "completed",
      date: "2024-01-10",
      time: "14:32",
      category: "Shopping",
      paymentMethod: "Visa ****4532",
      description: "Online purchase - Electronics",
    },
    {
      id: "TXN-002",
      merchant: "Netflix",
      amount: -15.99,
      status: "completed",
      date: "2024-01-09",
      time: "10:15",
      category: "Entertainment",
      paymentMethod: "Mastercard ****8901",
      description: "Monthly subscription",
    },
    {
      id: "TXN-003",
      merchant: "Starbucks",
      amount: -8.75,
      status: "completed",
      date: "2024-01-09",
      time: "08:45",
      category: "Food & Drink",
      paymentMethod: "Apple Pay",
      description: "Coffee purchase",
    },
    {
      id: "TXN-004",
      merchant: "Uber",
      amount: -24.5,
      status: "completed",
      date: "2024-01-08",
      time: "18:20",
      category: "Transportation",
      paymentMethod: "Visa ****4532",
      description: "Ride to downtown",
    },
    {
      id: "TXN-005",
      merchant: "Spotify",
      amount: -9.99,
      status: "completed",
      date: "2024-01-08",
      time: "12:00",
      category: "Entertainment",
      paymentMethod: "Mastercard ****8901",
      description: "Premium subscription",
    },
    {
      id: "TXN-006",
      merchant: "Refund - Amazon",
      amount: 45.99,
      status: "completed",
      date: "2024-01-07",
      time: "16:30",
      category: "Refund",
      paymentMethod: "Visa ****4532",
      description: "Product return refund",
    },
    {
      id: "TXN-007",
      merchant: "Gas Station",
      amount: -67.5,
      status: "pending",
      date: "2024-01-07",
      time: "09:15",
      category: "Transportation",
      paymentMethod: "Visa ****4532",
      description: "Fuel purchase",
    },
    {
      id: "TXN-008",
      merchant: "Online Store",
      amount: -156.0,
      status: "failed",
      date: "2024-01-06",
      time: "20:45",
      category: "Shopping",
      paymentMethod: "Mastercard ****8901",
      description: "Payment declined - insufficient funds",
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

  const getCategoryColor = (category: string) => {
    const colors = {
      Shopping: "bg-blue-100 text-blue-800",
      Entertainment: "bg-purple-100 text-purple-800",
      "Food & Drink": "bg-orange-100 text-orange-800",
      Transportation: "bg-green-100 text-green-800",
      Refund: "bg-gray-100 text-gray-800",
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter

    return matchesSearch && matchesStatus
  })

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
                  <p className="text-sm text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold">$2,847.50</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <History className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Transactions</p>
                  <p className="text-2xl font-bold">47</p>
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
                  <p className="text-sm text-gray-600">This Month</p>
                  <p className="text-2xl font-bold">$456.80</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>View and manage your payment history</CardDescription>
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
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>

            {/* Transactions Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Date & Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
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
                            <p className="text-sm text-gray-500">{transaction.description}</p>
                            <p className="text-xs text-gray-400">{transaction.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`font-semibold ${transaction.amount < 0 ? "text-red-600" : "text-green-600"}`}>
                          {transaction.amount < 0 ? "-" : "+"}${Math.abs(transaction.amount).toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getCategoryColor(transaction.category)}>
                          {transaction.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{transaction.paymentMethod}</span>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{transaction.date}</div>
                          <div className="text-gray-500">{transaction.time}</div>
                        </div>
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
