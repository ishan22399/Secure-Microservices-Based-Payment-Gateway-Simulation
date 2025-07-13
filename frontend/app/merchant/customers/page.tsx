"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CreditCard, Search, Users, Eye, Mail, Phone, MapPin } from "lucide-react"
import { apiFetch } from "@/lib/api"

interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  location?: string
  totalSpent: number
  transactionCount: number
  lastTransaction: string
  status: "active" | "inactive"
  joinDate: string
  avatar?: string
}

export default function MerchantCustomersPage() {
  const { user } = useAuth()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  const navigation = [
    { name: "Dashboard", href: "/merchant/dashboard", icon: CreditCard },
    { name: "Transactions", href: "/merchant/transactions", icon: CreditCard },
    { name: "Analytics", href: "/merchant/analytics", icon: CreditCard },
    { name: "Customers", href: "/merchant/customers", icon: CreditCard, current: true },
    { name: "Payment Links", href: "/merchant/payment-links", icon: CreditCard },
    { name: "Settings", href: "/merchant/settings", icon: CreditCard },
  ]

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      const response = await apiFetch(`/api/customers?merchantId=${user?.id}`)
      const data = await response.json()
      setCustomers(data.customers || mockCustomers)
    } catch (error) {
      console.error("Failed to fetch customers:", error)
      setCustomers(mockCustomers)
    } finally {
      setLoading(false)
    }
  }

  const mockCustomers: Customer[] = [
    {
      id: "CUST_001",
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "+1-555-0123",
      location: "New York, NY",
      totalSpent: 2450.0,
      transactionCount: 12,
      lastTransaction: "2024-01-10T14:32:15Z",
      status: "active",
      joinDate: "2023-06-15T10:00:00Z",
    },
    {
      id: "CUST_002",
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      phone: "+1-555-0456",
      location: "Los Angeles, CA",
      totalSpent: 1890.5,
      transactionCount: 8,
      lastTransaction: "2024-01-08T09:15:30Z",
      status: "active",
      joinDate: "2023-08-22T14:30:00Z",
    },
    {
      id: "CUST_003",
      name: "Mike Wilson",
      email: "mike.wilson@email.com",
      totalSpent: 750.25,
      transactionCount: 3,
      lastTransaction: "2023-12-20T16:45:00Z",
      status: "inactive",
      joinDate: "2023-11-10T11:20:00Z",
    },
  ]

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalCustomers = customers.length
  const activeCustomers = customers.filter((c) => c.status === "active").length
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0)
  const averageSpent = totalRevenue / totalCustomers || 0

  return (
    <DashboardLayout navigation={navigation} title="Customers">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCustomers}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeCustomers}</div>
              <p className="text-xs text-muted-foreground">
                {((activeCustomers / totalCustomers) * 100).toFixed(1)}% active rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">From all customers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Spent</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${averageSpent.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Per customer</p>
            </CardContent>
          </Card>
        </div>

        {/* Customers Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Customer Directory</CardTitle>
                <CardDescription>Manage and view your customer base</CardDescription>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-[300px]"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Transactions</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Transaction</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        Loading customers...
                      </TableCell>
                    </TableRow>
                  ) : filteredCustomers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        No customers found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={customer.avatar || "/placeholder.svg"} />
                              <AvatarFallback>
                                {customer.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{customer.name}</div>
                              <div className="text-sm text-muted-foreground">{customer.id}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm">
                              <Mail className="h-3 w-3 mr-1" />
                              {customer.email}
                            </div>
                            {customer.phone && (
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Phone className="h-3 w-3 mr-1" />
                                {customer.phone}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">${customer.totalSpent.toFixed(2)}</TableCell>
                        <TableCell>{customer.transactionCount}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              customer.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                            }
                          >
                            {customer.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(customer.lastTransaction).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => setSelectedCustomer(customer)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Customer Details</DialogTitle>
                                <DialogDescription>Detailed information about {customer.name}</DialogDescription>
                              </DialogHeader>
                              {selectedCustomer && (
                                <div className="space-y-6">
                                  <div className="flex items-center space-x-4">
                                    <Avatar className="h-16 w-16">
                                      <AvatarImage src={selectedCustomer.avatar || "/placeholder.svg"} />
                                      <AvatarFallback className="text-lg">
                                        {selectedCustomer.name
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <h3 className="text-xl font-semibold">{selectedCustomer.name}</h3>
                                      <p className="text-muted-foreground">{selectedCustomer.id}</p>
                                      <Badge
                                        className={
                                          selectedCustomer.status === "active"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-gray-100 text-gray-800"
                                        }
                                      >
                                        {selectedCustomer.status}
                                      </Badge>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-6">
                                    <div>
                                      <h4 className="font-medium mb-3">Contact Information</h4>
                                      <div className="space-y-2">
                                        <div className="flex items-center text-sm">
                                          <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                                          {selectedCustomer.email}
                                        </div>
                                        {selectedCustomer.phone && (
                                          <div className="flex items-center text-sm">
                                            <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                                            {selectedCustomer.phone}
                                          </div>
                                        )}
                                        {selectedCustomer.location && (
                                          <div className="flex items-center text-sm">
                                            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                                            {selectedCustomer.location}
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    <div>
                                      <h4 className="font-medium mb-3">Transaction Summary</h4>
                                      <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                          <span>Total Spent:</span>
                                          <span className="font-medium">${selectedCustomer.totalSpent.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                          <span>Total Transactions:</span>
                                          <span className="font-medium">{selectedCustomer.transactionCount}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                          <span>Average Order:</span>
                                          <span className="font-medium">
                                            $
                                            {(selectedCustomer.totalSpent / selectedCustomer.transactionCount).toFixed(
                                              2,
                                            )}
                                          </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                          <span>Customer Since:</span>
                                          <span className="font-medium">
                                            {new Date(selectedCustomer.joinDate).toLocaleDateString()}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
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
