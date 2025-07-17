"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Shield, Server, Activity, Database, Cpu, HardDrive, Wifi, RefreshCw } from "lucide-react"

export default function AdminSystemPage() {
  const { user } = useAuth()
  const [systemStatus, setSystemStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: Shield },
    { name: "Users", href: "/admin/users", icon: Shield },
    { name: "Transactions", href: "/admin/transactions", icon: Shield },
    { name: "Security", href: "/admin/security", icon: Shield },
    { name: "System", href: "/admin/system", icon: Shield, current: true },
    { name: "Analytics", href: "/admin/analytics", icon: Shield },
    { name: "Settings", href: "/admin/settings", icon: Shield },
  ]

  useEffect(() => {
    if (user?.id && user?.role === "bank_admin") {
      fetchSystemStatus()
    }
  }, [user?.id, user?.role])

  const fetchSystemStatus = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/system")

      if (!response.ok) {
        throw new Error("Failed to fetch system status")
      }

      const data = await response.json()
      setSystemStatus(data)
    } catch (error) {
      console.error("Failed to fetch system status:", error)
      setSystemStatus(mockSystemData)
    } finally {
      setLoading(false)
    }
  }

  const mockSystemData = {
    overallHealth: "healthy",
    uptime: "99.9%",
    services: [
      { name: "Payment Gateway", status: "operational", uptime: "99.9%", responseTime: "120ms" },
      { name: "Authentication Service", status: "operational", uptime: "99.8%", responseTime: "45ms" },
      { name: "Database", status: "operational", uptime: "99.9%", responseTime: "12ms" },
      { name: "Fraud Detection", status: "degraded", uptime: "98.5%", responseTime: "250ms" },
      { name: "Notification Service", status: "operational", uptime: "99.7%", responseTime: "80ms" },
    ],
    metrics: {
      cpu: 65,
      memory: 78,
      disk: 45,
      network: 23,
    },
    performance: {
      transactions: 1247,
      errors: 3,
      avgResponseTime: 150,
    },
  }

  const data = systemStatus || mockSystemData

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "bg-green-100 text-green-800"
      case "degraded":
        return "bg-yellow-100 text-yellow-800"
      case "down":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <DashboardLayout navigation={navigation} title="System Monitoring">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading system status...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout navigation={navigation} title="System Monitoring">
      <div className="space-y-6">
        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">{data.overallHealth}</div>
              <Badge
                className={
                  data.overallHealth === "healthy" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                }
              >
                {data.overallHealth.toUpperCase()}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Uptime</CardTitle>
              <Server className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.uptime}</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transactions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.performance.transactions}</div>
              <p className="text-xs text-muted-foreground">Last hour</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Errors</CardTitle>
              <Activity className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{data.performance.errors}</div>
              <p className="text-xs text-muted-foreground">Last hour</p>
            </CardContent>
          </Card>
        </div>

        {/* Service Status */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Service Status</CardTitle>
                <CardDescription>Monitor all system services</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={fetchSystemStatus}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.services.map((service: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Server className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-gray-500">Response: {service.responseTime}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">{service.uptime}</p>
                      <p className="text-xs text-gray-500">Uptime</p>
                    </div>
                    <Badge className={getStatusColor(service.status)}>{service.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Resource Usage</CardTitle>
              <CardDescription>Current system resource utilization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center">
                    <Cpu className="h-4 w-4 mr-2" />
                    CPU Usage
                  </span>
                  <span>{data.metrics.cpu}%</span>
                </div>
                <Progress value={data.metrics.cpu} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center">
                    <Database className="h-4 w-4 mr-2" />
                    Memory Usage
                  </span>
                  <span>{data.metrics.memory}%</span>
                </div>
                <Progress value={data.metrics.memory} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center">
                    <HardDrive className="h-4 w-4 mr-2" />
                    Disk Usage
                  </span>
                  <span>{data.metrics.disk}%</span>
                </div>
                <Progress value={data.metrics.disk} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center">
                    <Wifi className="h-4 w-4 mr-2" />
                    Network Usage
                  </span>
                  <span>{data.metrics.network}%</span>
                </div>
                <Progress value={data.metrics.network} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Real-time system performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Average Response Time</span>
                  <span className="text-2xl font-bold">{data.performance.avgResponseTime}ms</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Transactions per Hour</span>
                  <span className="text-2xl font-bold">{data.performance.transactions}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Error Rate</span>
                  <span className="text-2xl font-bold text-red-600">
                    {((data.performance.errors / data.performance.transactions) * 100).toFixed(2)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
