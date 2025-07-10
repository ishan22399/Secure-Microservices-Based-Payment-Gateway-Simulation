"use client"

import { useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Home,
  Users,
  CreditCard,
  Settings,
  User,
  DollarSign,
  TrendingUp,
  Activity,
  Shield,
  AlertTriangle,
  CheckCircle,
  Server,
  Database,
  BarChart3,
} from "lucide-react"

export default function AdminDashboard() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "bank_admin")) {
      router.push("/auth/login")
    }
  }, [user, isLoading, router])

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: Home, current: true },
    { name: "User Management", href: "/admin/users", icon: Users },
    { name: "Transactions", href: "/admin/transactions", icon: CreditCard },
    { name: "System Monitor", href: "/admin/system", icon: Server },
    { name: "Security", href: "/admin/security", icon: Shield },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { name: "Profile", href: "/admin/profile", icon: User },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ]

  const systemStats = [
    {
      title: "Total Users",
      value: "12,847",
      change: "+12.5%",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Transaction Volume",
      value: "$2.4M",
      change: "+8.2%",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "System Uptime",
      value: "99.99%",
      change: "+0.01%",
      icon: Activity,
      color: "text-green-600",
    },
    {
      title: "Security Score",
      value: "98.5%",
      change: "+1.2%",
      icon: Shield,
      color: "text-purple-600",
    },
  ]

  const systemHealth = [
    { name: "API Gateway", status: "healthy", load: 78, instances: 3 },
    { name: "Auth Service", status: "healthy", load: 65, instances: 2 },
    { name: "Payment Service", status: "healthy", load: 82, instances: 5 },
    { name: "Database Cluster", status: "warning", load: 91, instances: 3 },
    { name: "Notification Service", status: "healthy", load: 45, instances: 2 },
    { name: "Analytics Service", status: "healthy", load: 67, instances: 2 },
  ]

  const recentAlerts = [
    {
      id: "1",
      type: "warning",
      title: "High Database Load",
      message: "Database cluster experiencing high load (91%)",
      timestamp: "5 minutes ago",
    },
    {
      id: "2",
      type: "info",
      title: "New User Registration",
      message: "247 new users registered in the last hour",
      timestamp: "15 minutes ago",
    },
    {
      id: "3",
      type: "success",
      title: "Security Scan Complete",
      message: "Weekly security scan completed successfully",
      timestamp: "1 hour ago",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-500"
      case "warning":
        return "bg-yellow-500"
      case "critical":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      default:
        return <Activity className="h-4 w-4 text-blue-600" />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <DashboardLayout navigation={navigation} title="System Administration">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-purple-500 to-red-600 rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">System Control Center</h1>
          <p className="text-purple-100">Monitor and manage the entire payment gateway infrastructure.</p>
        </div>

        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {systemStats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{stat.change}</span> from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* System Health */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Server className="h-5 w-5" />
                <span>System Health</span>
              </CardTitle>
              <CardDescription>Real-time microservices status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {systemHealth.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(service.status)}`} />
                    <div>
                      <p className="font-medium text-sm">{service.name}</p>
                      <p className="text-xs text-gray-500">{service.instances} instances</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20">
                      <Progress value={service.load} className="h-2" />
                    </div>
                    <span className="text-xs text-gray-500 w-8">{service.load}%</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>System Alerts</span>
              </CardTitle>
              <CardDescription>Recent system notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <div className="flex-shrink-0 mt-0.5">{getAlertIcon(alert.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{alert.title}</p>
                    <p className="text-sm text-gray-600">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{alert.timestamp}</p>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full bg-transparent" onClick={() => router.push("/admin/system")}>
                View All Alerts
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6" onClick={() => router.push("/admin/users")}>
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-lg bg-blue-200">
                  <Users className="h-6 w-6 text-blue-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900">User Management</h3>
                  <p className="text-sm text-blue-700">Manage users and permissions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6" onClick={() => router.push("/admin/transactions")}>
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-lg bg-green-200">
                  <CreditCard className="h-6 w-6 text-green-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-900">Transaction Monitor</h3>
                  <p className="text-sm text-green-700">Monitor all transactions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6" onClick={() => router.push("/admin/security")}>
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-lg bg-purple-200">
                  <Shield className="h-6 w-6 text-purple-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-purple-900">Security Center</h3>
                  <p className="text-sm text-purple-700">Security monitoring & alerts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Infrastructure Overview</CardTitle>
            <CardDescription>Real-time system performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Database className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold text-blue-700">847</div>
                <div className="text-sm text-blue-600">Database Connections</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Activity className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold text-green-700">12.4K</div>
                <div className="text-sm text-green-600">Requests/min</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
                <div className="text-2xl font-bold text-yellow-700">45ms</div>
                <div className="text-sm text-yellow-600">Avg Response Time</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Shield className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold text-purple-700">0</div>
                <div className="text-sm text-purple-600">Security Incidents</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
