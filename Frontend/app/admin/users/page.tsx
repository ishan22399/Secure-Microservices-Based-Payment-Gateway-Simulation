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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Home,
  Users,
  CreditCard,
  Settings,
  User,
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Shield,
  Ban,
  CheckCircle,
  Server,
  BarChart3,
} from "lucide-react"

export default function AdminUsers() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "bank_admin")) {
      router.push("/auth/login")
    }
  }, [user, isLoading, router])

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: Home },
    { name: "User Management", href: "/admin/users", icon: Users, current: true },
    { name: "Transactions", href: "/admin/transactions", icon: CreditCard },
    { name: "System Monitor", href: "/admin/system", icon: Server },
    { name: "Security", href: "/admin/security", icon: Shield },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { name: "Profile", href: "/admin/profile", icon: User },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ]

  const users = [
    {
      id: "1",
      name: "John Customer",
      email: "john.customer@email.com",
      role: "customer",
      status: "active",
      joinDate: "2023-06-15",
      lastLogin: "2024-01-10 14:32",
      transactions: 47,
      totalSpent: 2847.5,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "2",
      name: "Jane Merchant",
      email: "jane.merchant@business.com",
      role: "merchant",
      status: "active",
      joinDate: "2023-08-22",
      lastLogin: "2024-01-10 12:15",
      transactions: 1247,
      totalRevenue: 24847.5,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "3",
      name: "Bob Wilson",
      email: "bob.wilson@email.com",
      role: "customer",
      status: "suspended",
      joinDate: "2023-12-05",
      lastLogin: "2024-01-08 16:45",
      transactions: 12,
      totalSpent: 456.8,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "4",
      name: "Alice Store",
      email: "alice@alicestore.com",
      role: "merchant",
      status: "pending",
      joinDate: "2024-01-05",
      lastLogin: "2024-01-09 10:30",
      transactions: 5,
      totalRevenue: 234.75,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "5",
      name: "Charlie Davis",
      email: "charlie.davis@email.com",
      role: "customer",
      status: "active",
      joinDate: "2023-09-18",
      lastLogin: "2024-01-10 09:20",
      transactions: 89,
      totalSpent: 5432.1,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "6",
      name: "Diana Admin",
      email: "diana.admin@bank.com",
      role: "bank_admin",
      status: "active",
      joinDate: "2023-01-10",
      lastLogin: "2024-01-10 15:45",
      transactions: 0,
      totalSpent: 0,
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  const getRoleBadge = (role: string) => {
    const variants = {
      customer: "bg-blue-100 text-blue-800",
      merchant: "bg-green-100 text-green-800",
      bank_admin: "bg-purple-100 text-purple-800",
    }
    return <Badge className={variants[role as keyof typeof variants]}>{role.replace("_", " ")}</Badge>
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-100 text-green-800",
      suspended: "bg-red-100 text-red-800",
      pending: "bg-yellow-100 text-yellow-800",
    }
    return <Badge className={variants[status as keyof typeof variants]}>{status}</Badge>
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter

    return matchesSearch && matchesRole && matchesStatus
  })

  const userStats = {
    total: users.length,
    active: users.filter((u) => u.status === "active").length,
    customers: users.filter((u) => u.role === "customer").length,
    merchants: users.filter((u) => u.role === "merchant").length,
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <DashboardLayout navigation={navigation} title="User Management">
      <div className="space-y-6">
        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold">{userStats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold">{userStats.active}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <User className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Customers</p>
                  <p className="text-2xl font-bold">{userStats.customers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <CreditCard className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Merchants</p>
                  <p className="text-2xl font-bold">{userStats.merchants}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>User Directory</CardTitle>
                <CardDescription>Manage user accounts and permissions</CardDescription>
              </div>
              <Button className="bg-gradient-to-r from-blue-500 to-blue-600">
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="merchant">Merchant</SelectItem>
                  <SelectItem value="bank_admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Users Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={user.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>
                        <span className="text-sm">{user.joinDate}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{user.lastLogin}</span>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{user.transactions} transactions</div>
                          <div className="text-gray-500">
                            ${user.role === "merchant" ? user.totalRevenue?.toFixed(2) : user.totalSpent?.toFixed(2)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Shield className="mr-2 h-4 w-4" />
                              View Permissions
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Ban className="mr-2 h-4 w-4" />
                              {user.status === "active" ? "Suspend" : "Activate"}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No users found matching your criteria</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
