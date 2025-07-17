"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreditCard, Plus, Copy, Eye, Edit, Trash2, Link, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PaymentLink {
  id: string
  title: string
  description: string
  amount: number
  currency: string
  status: "active" | "inactive" | "expired"
  createdAt: string
  expiresAt?: string
  usageCount: number
  maxUsage?: number
  url: string
}

export default function PaymentLinksPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [paymentLinks, setPaymentLinks] = useState<PaymentLink[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    amount: "",
    currency: "USD",
    maxUsage: "",
    expiresAt: "",
  })

  const navigation = [
    { name: "Dashboard", href: "/merchant/dashboard", icon: CreditCard },
    { name: "Transactions", href: "/merchant/transactions", icon: CreditCard },
    { name: "Analytics", href: "/merchant/analytics", icon: CreditCard },
    { name: "Customers", href: "/merchant/customers", icon: CreditCard },
    { name: "Payment Links", href: "/merchant/payment-links", icon: CreditCard, current: true },
    { name: "Settings", href: "/merchant/settings", icon: CreditCard },
  ]

  useEffect(() => {
    fetchPaymentLinks()
  }, [])

  const fetchPaymentLinks = async () => {
    try {
      const response = await fetch(`/api/payment-links?merchantId=${user?.id}`)
      const data = await response.json()
      setPaymentLinks(data.paymentLinks || mockPaymentLinks)
    } catch (error) {
      console.error("Failed to fetch payment links:", error)
      setPaymentLinks(mockPaymentLinks)
    } finally {
      setLoading(false)
    }
  }

  const mockPaymentLinks: PaymentLink[] = [
    {
      id: "PL_001",
      title: "Premium Subscription",
      description: "Monthly premium plan subscription",
      amount: 29.99,
      currency: "USD",
      status: "active",
      createdAt: "2024-01-01T10:00:00Z",
      expiresAt: "2024-12-31T23:59:59Z",
      usageCount: 45,
      maxUsage: 100,
      url: "https://pay.securegateway.com/pl_001",
    },
    {
      id: "PL_002",
      title: "Product Purchase",
      description: "One-time product payment",
      amount: 199.99,
      currency: "USD",
      status: "active",
      createdAt: "2024-01-05T14:30:00Z",
      usageCount: 12,
      url: "https://pay.securegateway.com/pl_002",
    },
    {
      id: "PL_003",
      title: "Service Fee",
      description: "Consultation service payment",
      amount: 150.0,
      currency: "USD",
      status: "inactive",
      createdAt: "2023-12-15T09:15:00Z",
      usageCount: 8,
      maxUsage: 10,
      url: "https://pay.securegateway.com/pl_003",
    },
  ]

  const handleCreatePaymentLink = async () => {
    try {
      const response = await fetch("/api/payment-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          merchantId: user?.id,
          amount: Number.parseFloat(formData.amount),
          maxUsage: formData.maxUsage ? Number.parseInt(formData.maxUsage) : undefined,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Payment link created successfully",
        })
        setShowCreateDialog(false)
        setFormData({
          title: "",
          description: "",
          amount: "",
          currency: "USD",
          maxUsage: "",
          expiresAt: "",
        })
        fetchPaymentLinks()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create payment link",
        variant: "destructive",
      })
    }
  }

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
    toast({
      title: "Copied",
      description: "Payment link copied to clipboard",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "expired":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const totalLinks = paymentLinks.length
  const activeLinks = paymentLinks.filter((link) => link.status === "active").length
  const totalUsage = paymentLinks.reduce((sum, link) => sum + link.usageCount, 0)
  const totalRevenue = paymentLinks.reduce((sum, link) => sum + link.amount * link.usageCount, 0)

  return (
    <DashboardLayout navigation={navigation} title="Payment Links">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Links</CardTitle>
              <Link className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalLinks}</div>
              <p className="text-xs text-muted-foreground">{activeLinks} active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsage}</div>
              <p className="text-xs text-muted-foreground">Clicks across all links</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue Generated</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">From payment links</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78.5%</div>
              <p className="text-xs text-muted-foreground">Average conversion</p>
            </CardContent>
          </Card>
        </div>

        {/* Payment Links Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Payment Links</CardTitle>
                <CardDescription>Create and manage payment links for your products and services</CardDescription>
              </div>
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Link
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create Payment Link</DialogTitle>
                    <DialogDescription>Create a new payment link for your customers</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        placeholder="Enter link title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        placeholder="Enter description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="amount">Amount</Label>
                        <Input
                          id="amount"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={formData.amount}
                          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="currency">Currency</Label>
                        <Select
                          value={formData.currency}
                          onValueChange={(value) => setFormData({ ...formData, currency: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                            <SelectItem value="GBP">GBP</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maxUsage">Max Usage (Optional)</Label>
                      <Input
                        id="maxUsage"
                        type="number"
                        placeholder="Unlimited"
                        value={formData.maxUsage}
                        onChange={(e) => setFormData({ ...formData, maxUsage: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="expiresAt">Expires At (Optional)</Label>
                      <Input
                        id="expiresAt"
                        type="datetime-local"
                        value={formData.expiresAt}
                        onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                      />
                    </div>

                    <Button onClick={handleCreatePaymentLink} className="w-full">
                      Create Payment Link
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        Loading payment links...
                      </TableCell>
                    </TableRow>
                  ) : paymentLinks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        No payment links found
                      </TableCell>
                    </TableRow>
                  ) : (
                    paymentLinks.map((link) => (
                      <TableRow key={link.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{link.title}</div>
                            <div className="text-sm text-muted-foreground">{link.description}</div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {link.currency} {link.amount.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(link.status)}>{link.status}</Badge>
                        </TableCell>
                        <TableCell>
                          {link.usageCount}
                          {link.maxUsage && ` / ${link.maxUsage}`}
                        </TableCell>
                        <TableCell>{new Date(link.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(link.url)}>
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
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
