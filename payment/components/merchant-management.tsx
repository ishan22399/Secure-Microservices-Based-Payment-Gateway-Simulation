"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Plus, Search, MoreHorizontal, TrendingUp, DollarSign, CreditCard, Building } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function MerchantManagement() {
  const [searchTerm, setSearchTerm] = useState("")

  const merchants = [
    {
      id: "MERCH_001",
      name: "Amazon Store",
      email: "payments@amazon.com",
      status: "active",
      volume: "$2.4M",
      transactions: "12,847",
      joinDate: "2023-01-15",
      riskLevel: "low",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "MERCH_002",
      name: "Netflix Inc.",
      email: "billing@netflix.com",
      status: "active",
      volume: "$890K",
      transactions: "45,231",
      joinDate: "2023-03-22",
      riskLevel: "low",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "MERCH_003",
      name: "Uber Technologies",
      email: "payments@uber.com",
      status: "pending",
      volume: "$1.2M",
      transactions: "8,934",
      joinDate: "2024-01-08",
      riskLevel: "medium",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "MERCH_004",
      name: "Starbucks Coffee",
      email: "finance@starbucks.com",
      status: "active",
      volume: "$567K",
      transactions: "23,456",
      joinDate: "2023-06-10",
      riskLevel: "low",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "MERCH_005",
      name: "Shopify Store",
      email: "payments@shopify.com",
      status: "suspended",
      volume: "$234K",
      transactions: "3,421",
      joinDate: "2023-11-05",
      riskLevel: "high",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  const merchantStats = [
    {
      title: "Total Merchants",
      value: "1,247",
      change: "+12",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Active Volume",
      value: "$5.2M",
      change: "+8.5%",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Avg Transaction",
      value: "$127.50",
      change: "+2.1%",
      icon: CreditCard,
      color: "text-purple-600",
    },
    {
      title: "New This Month",
      value: "23",
      change: "+15%",
      icon: TrendingUp,
      color: "text-orange-600",
    },
  ]

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      suspended: "bg-red-100 text-red-800",
    }
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getRiskBadge = (risk: string) => {
    const variants = {
      low: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-red-100 text-red-800",
    }
    return (
      <Badge variant="secondary" className={variants[risk as keyof typeof variants]}>
        {risk.charAt(0).toUpperCase() + risk.slice(1)} Risk
      </Badge>
    )
  }

  const filteredMerchants = merchants.filter(
    (merchant) =>
      merchant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      merchant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      merchant.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Merchant Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {merchantStats.map((stat, index) => (
          <Card key={index} className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-gray-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Merchant Management */}
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Building className="h-5 w-5" />
                <span>Merchant Directory</span>
              </CardTitle>
              <CardDescription>Manage merchant accounts and monitor transaction activity</CardDescription>
            </div>
            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
              <Plus className="h-4 w-4 mr-2" />
              Add Merchant
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search merchants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">Filter</Button>
            <Button variant="outline">Export</Button>
          </div>

          {/* Merchants Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Merchant</TableHead>
                <TableHead>Merchant ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Monthly Volume</TableHead>
                <TableHead>Transactions</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMerchants.map((merchant) => (
                <TableRow key={merchant.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={merchant.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {merchant.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{merchant.name}</div>
                        <div className="text-sm text-gray-500">{merchant.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{merchant.id}</TableCell>
                  <TableCell>{getStatusBadge(merchant.status)}</TableCell>
                  <TableCell className="font-semibold">{merchant.volume}</TableCell>
                  <TableCell>{merchant.transactions}</TableCell>
                  <TableCell>{getRiskBadge(merchant.riskLevel)}</TableCell>
                  <TableCell className="text-sm text-gray-500">{merchant.joinDate}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit Merchant</DropdownMenuItem>
                        <DropdownMenuItem>View Transactions</DropdownMenuItem>
                        <DropdownMenuItem>Risk Assessment</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Suspend Account</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-lg bg-blue-200">
                <Plus className="h-6 w-6 text-blue-700" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">Onboard Merchant</h3>
                <p className="text-sm text-blue-700">Add new merchant to platform</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-lg bg-green-200">
                <TrendingUp className="h-6 w-6 text-green-700" />
              </div>
              <div>
                <h3 className="font-semibold text-green-900">Analytics Report</h3>
                <p className="text-sm text-green-700">Generate merchant insights</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-lg bg-purple-200">
                <Users className="h-6 w-6 text-purple-700" />
              </div>
              <div>
                <h3 className="font-semibold text-purple-900">Bulk Operations</h3>
                <p className="text-sm text-purple-700">Manage multiple merchants</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
