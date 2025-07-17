"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CreditCard, Send, CheckCircle, Clock, AlertTriangle, DollarSign, ArrowRight } from "lucide-react"

export default function TransactionProcessor() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [transactions] = useState([
    {
      id: "TXN-001",
      merchant: "Amazon Store",
      amount: "$299.99",
      status: "completed",
      timestamp: "2024-01-10 14:32:15",
      method: "Visa ****4532",
    },
    {
      id: "TXN-002",
      merchant: "Netflix Subscription",
      amount: "$15.99",
      status: "processing",
      timestamp: "2024-01-10 14:28:42",
      method: "Mastercard ****8901",
    },
    {
      id: "TXN-003",
      merchant: "Uber Ride",
      amount: "$24.50",
      status: "failed",
      timestamp: "2024-01-10 14:15:33",
      method: "Visa ****2345",
    },
    {
      id: "TXN-004",
      merchant: "Starbucks Coffee",
      amount: "$8.75",
      status: "completed",
      timestamp: "2024-01-10 13:45:21",
      method: "Apple Pay",
    },
  ])

  const handleProcessPayment = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
    }, 3000)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "processing":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "failed":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "bg-green-100 text-green-800",
      processing: "bg-yellow-100 text-yellow-800",
      failed: "bg-red-100 text-red-800",
    }
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Processor */}
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Process New Transaction</span>
            </CardTitle>
            <CardDescription>Secure payment processing with real-time validation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="merchant">Merchant ID</Label>
                <Input id="merchant" placeholder="MERCH_12345" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input id="amount" placeholder="$0.00" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="card">Card Number</Label>
              <Input id="card" placeholder="**** **** **** 1234" />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry</Label>
                <Input id="expiry" placeholder="MM/YY" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input id="cvv" placeholder="123" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="USD" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usd">USD</SelectItem>
                    <SelectItem value="eur">EUR</SelectItem>
                    <SelectItem value="gbp">GBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleProcessPayment}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              {isProcessing ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Process Payment
                </>
              )}
            </Button>

            {isProcessing && (
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                <div className="flex items-center space-x-2 text-blue-800">
                  <Clock className="h-4 w-4 animate-spin" />
                  <span className="text-sm font-medium">Transaction in progress...</span>
                </div>
                <div className="mt-2 space-y-1 text-xs text-blue-600">
                  <div className="flex items-center space-x-2">
                    <ArrowRight className="h-3 w-3" />
                    <span>Validating card details</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ArrowRight className="h-3 w-3" />
                    <span>Checking fraud patterns</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ArrowRight className="h-3 w-3" />
                    <span>Processing with bank</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Transaction Stats */}
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>Real-time Statistics</span>
            </CardTitle>
            <CardDescription>Live transaction processing metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 rounded-lg bg-gradient-to-b from-green-50 to-green-100">
                <div className="text-2xl font-bold text-green-700">1,247</div>
                <div className="text-sm text-green-600">Transactions/min</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-gradient-to-b from-blue-50 to-blue-100">
                <div className="text-2xl font-bold text-blue-700">$2.4M</div>
                <div className="text-sm text-blue-600">Volume/hour</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Success Rate</span>
                <span className="font-semibold text-green-600">99.97%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg Response Time</span>
                <span className="font-semibold text-blue-600">45ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Fraud Detection</span>
                <span className="font-semibold text-orange-600">0.03%</span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-purple-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-purple-800">Peak Load Handling</div>
                  <div className="text-sm text-purple-600">Auto-scaling active</div>
                </div>
                <Badge className="bg-purple-100 text-purple-800">Optimal</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Real-time transaction monitoring and status tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Merchant</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-mono text-sm">{transaction.id}</TableCell>
                  <TableCell>{transaction.merchant}</TableCell>
                  <TableCell className="font-semibold">{transaction.amount}</TableCell>
                  <TableCell>{transaction.method}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(transaction.status)}
                      {getStatusBadge(transaction.status)}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">{transaction.timestamp}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
