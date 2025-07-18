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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Search, Download, Eye, RefreshCw, AlertTriangle, DollarSign, CreditCard } from "lucide-react"
import { supabase } from "@/lib/supabase-client"
import { Database } from "@/types/supabase"

type Transaction = Database['public']['Tables']['transactions']['Row']
type Profile = Database['public']['Tables']['profiles']['Row']
type Merchant = Database['public']['Tables']['merchants']['Row']

interface AdminTransaction extends Transaction {
  merchant_name?: string; // Add merchant_name for display
  customer_name?: string; // Add customer_name for display
  risk_score?: number; // Assuming this might be added to transactions or derived
  fraud_flags?: string[]; // Assuming this might be added to transactions or derived
  region?: string; // Assuming this might be added to transactions or derived
}

export default function AdminTransactionsPage() {
  const { user, isLoading } = useAuth()
  const [transactions, setTransactions] = useState<AdminTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [riskFilter, setRiskFilter] = useState("all")

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: Shield },
    { name: "Users", href: "/admin/users", icon: Shield },
    { name: "Transactions", href: "/admin/transactions", icon: Shield, current: true },
    { name: "Security", href: "/admin/security", icon: Shield },
    { name: "System", href: "/admin/system", icon: Shield },
    { name: "Analytics", href: "/admin/analytics", icon: Shield },
    { name: "Settings", href: "/admin/settings", icon: Shield },
  ]

  useEffect(() => {
    if (!isLoading && user?.id && user?.role === "bank_admin") {
      fetchTransactions()
    }
  }, [user?.id, user?.role, isLoading, searchTerm, statusFilter, riskFilter])

  const fetchTransactions = async () => {
    if (!user?.id || user?.role !== "bank_admin") return

    try {
      setLoading(true)
      setError(null)

      let query = supabase.from('transactions').select(`
        *,
        merchants(name),
        profiles(full_name)
      `)

      if (statusFilter !== "all") {
        query = query.eq('status', statusFilter)
      }

      if (searchTerm) {
        query = query.or(`description.ilike.%${searchTerm}%,id.ilike.%${searchTerm}%`)
      }

      // Risk filter logic (placeholder, as risk_score and fraud_flags are not in schema)
      // You would need to implement actual risk assessment in your backend or add these columns
      if (riskFilter !== "all") {
        // Example: query = query.eq('risk_score', riskFilter)
      }

      const { data, error: fetchError } = await query.order('timestamp', { ascending: false })

      if (fetchError) {
        throw fetchError
      }

      const formattedData: AdminTransaction[] = (data || []).map(txn => ({
        ...txn,
        merchant_name: txn.merchants?.name || 'N/A',
        customer_name: txn.profiles?.full_name || 'N/A',
        risk_score: Math.floor(Math.random() * 100), // Placeholder for risk score
        fraud_flags: Math.random() > 0.8 ? ['suspicious_activity'] : [], // Placeholder for fraud flags
        region: 'Global', // Placeholder
      }))

      setTransactions(formattedData)
    } catch (err: any) {
      console.error("Failed to fetch transactions:", err)
      setError(err.message || "Failed to fetch transactions")
      setTransactions([])
    } finally {
      setLoading(false)
    }
  }

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
      case "disputed":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRiskColor = (riskScore: number) => {
    if (riskScore >= 70) return "bg-red-100 text-red-800"
    if (riskScore >= 40) return "bg-yellow-100 text-yellow-800"
    return "bg-green-100 text-green-800"
  }

  const getRiskLevel = (riskScore: number) => {
    if (riskScore >= 70) return "High"
    if (riskScore >= 40) return "Medium"
    return "Low"
  }

  // Calculate stats
  const totalVolume = transactions.reduce((sum, t) => sum + (t.amount || 0), 0)
  const totalFees = 0 // Placeholder for fees
  const highRiskTransactions = transactions.filter((t) => (t.risk_score || 0) >= 70).length
  const disputedTransactions = transactions.filter((t) => t.status === "disputed").length

  if (loading) {
    return (
      <DashboardLayout navigation={navigation} title="Transaction Monitoring">
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
    <DashboardLayout navigation={navigation} title="Transaction Monitoring">
      <div className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* High Risk Alert */}
        {highRiskTransactions > 0 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {highRiskTransactions} high-risk transactions require immediate attention
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalVolume.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+8.5% from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{transactions.length}</div>
              <p className="text-xs text-muted-foreground">+12% from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Risk</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{highRiskTransactions}</div>
              <p className="text-xs text-muted-foreground">Require attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Disputes</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{disputedTransactions}</div>
              <p className="text-xs text-muted-foreground">Under investigation</p>
            </CardContent>
          </Card>
        </div>

        {/* Transaction Monitoring */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>All Transactions</CardTitle>
                <CardDescription>Monitor all transactions across the platform</CardDescription>
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
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="disputed">Disputed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Filter by risk" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                  <SelectItem value="low">Low Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Transactions Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Merchant</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Risk Score</TableHead>
                    <TableHead>Flags</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">
                        No transactions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">{transaction.id}</TableCell>
                        <TableCell>{transaction.merchant_name}</TableCell>
                        <TableCell>{transaction.customer_name}</TableCell>
                        <TableCell>${(transaction.amount || 0).toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(transaction.status || 'pending')}>{transaction.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getRiskColor(transaction.risk_score || 0)}>
                            {getRiskLevel(transaction.risk_score || 0)} ({transaction.risk_score})
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {transaction.fraud_flags?.map((flag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {flag}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{new Date(transaction.timestamp || '').toLocaleDateString()}</TableCell>
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
