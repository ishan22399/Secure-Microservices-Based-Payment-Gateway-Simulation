"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Home,
  Users,
  CreditCard,
  Shield,
  Settings,
  User,
  DollarSign,
  Activity,
  AlertTriangle,
  CheckCircle,
  Server,
  Database,
  BarChart3,
  Globe,
  Eye,
  TrendingUp,
  Cpu,
  HardDrive,
  Wifi,
} from "lucide-react"

export default function AdminDashboard() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalUsers: 12847,
      transactionVolume: 2400000,
      systemUptime: 99.99,
      securityScore: 98.7,
    },
    systemHealth: [
      { name: "API Gateway", status: "healthy", load: 78, instances: 3 },
      { name: "Auth Service", status: "healthy", load: 65, instances: 2 },
      { name: "Payment Service", status: "healthy", load: 82, instances: 5 },
      { name: "Database Cluster", status: "warning", load: 91, instances: 4 },
      { name: "Cache Layer", status: "healthy", load: 45, instances: 2 },
      { name: "Message Queue", status: "healthy", load: 67, instances: 3 },
    ],
    recentAlerts: [
      {
        id: "1",
        type: "warning",
        message: "Database CPU usage above 90%",
        time: "2 minutes ago",
        severity: "medium",
      },
      {
        id: "2",
        type: "info",
        message: "Scheduled maintenance completed successfully",
        time: "1 hour ago",
        severity: "low",
      },
      {
        id: "3",
        type: "success",
        message: "Security scan completed - no vulnerabilities found",
        time: "3 hours ago",
        severity: "low",
      },
      {
        id: "4",
        type: "warning",
        message: "High transaction volume detected",
        time: "5 hours ago",
        severity: "medium",
      },
    ],
    performanceMetrics: {
      transactionsPerHour: 12400,
      avgResponseTime: 45,
      successRate: 99.97,
      activeConnections: 8472,
    },
  })

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "bank_admin")) {
      router.push("/auth/login")
    }
  }, [user, isLoading, router])

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: Home, current: true },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Transactions", href: "/admin/transactions", icon: CreditCard },
    { name: "Security", href: "/admin/security", icon: Shield },
    { name: "System", href: "/admin/system", icon: Server },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { name: "Settings", href: "/admin/settings", icon: Settings },
    { name: "Profile", href: "/admin/profile", icon: User },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-4 w-4 text-emerald-600" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-600" />
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <CheckCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-emerald-500"
      case "warning":
        return "bg-amber-500"
      case "critical":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-600" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-emerald-600" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Activity className="h-4 w-4 text-blue-600" />
    }
  }

  const getAlertBadgeColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-red-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
          <p className="text-gray-600 animate-pulse">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-red-50">
      <DashboardLayout navigation={navigation} title="System Administration">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-red-600 rounded-2xl p-8 text-white shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">System Administration 🛡️</h1>
                <p className="text-purple-100 text-lg">Monitor and manage the entire payment gateway infrastructure.</p>
                <div className="flex items-center space-x-6 mt-4">
                  <div className="flex items-center space-x-2">
                    <Server className="w-5 h-5" />
                    <span>All systems operational</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5" />
                    <span>Security level: Maximum</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="w-5 h-5" />
                    <span>Global infrastructure</span>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
                  <Shield className="w-16 h-16 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Total Users",
                value: dashboardData.stats.totalUsers.toLocaleString(),
                change: "+12.5%",
                icon: Users,
                color: "text-blue-600",
                bgColor: "bg-blue-100",
                progress: 78,
              },
              {
                title: "Transaction Volume",
                value: `$${(dashboardData.stats.transactionVolume / 1000000).toFixed(1)}M`,
                change: "+8.2%",
                icon: DollarSign,
                color: "text-emerald-600",
                bgColor: "bg-emerald-100",
                progress: 85,
              },
              {
                title: "System Uptime",
                value: `${dashboardData.stats.systemUptime}%`,
                change: "+0.01%",
                icon: Activity,
                color: "text-purple-600",
                bgColor: "bg-purple-100",
                progress: 99,
              },
              {
                title: "Security Score",
                value: `${dashboardData.stats.securityScore}%`,
                change: "+1.2%",
                icon: Shield,
                color: "text-orange-600",
                bgColor: "bg-orange-100",
                progress: 98,
              },
            ].map((stat, index) => (
              <Card
                key={index}
                className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                  <div className={`p-2 ${stat.bgColor} rounded-lg group-hover:scale-110 transition-transform`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                  <p className="text-xs text-gray-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1 text-emerald-600" />
                    <span className="text-emerald-600">{stat.change}</span> from last month
                  </p>
                  <Progress value={stat.progress} className="mt-3 h-2" />
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* System Health */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-xl font-semibold text-gray-900">
                  <Server className="h-5 w-5" />
                  <span>System Health</span>
                </CardTitle>
                <CardDescription>Real-time microservices monitoring</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {dashboardData.systemHealth.map((service, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl bg-gray-50/50 space-y-3 hover:bg-gray-100/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(service.status)}`} />
                        <div>
                          <p className="font-semibold text-sm text-gray-900">{service.name}</p>
                          <p className="text-xs text-gray-500">{service.instances} instances running</p>
                        </div>
                      </div>
                      {getStatusIcon(service.status)}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">CPU Load</span>
                      <span className="text-xs font-medium text-gray-900">{service.load}%</span>
                    </div>
                    <Progress value={service.load} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Alerts */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-xl font-semibold text-gray-900">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Recent Alerts</span>
                </CardTitle>
                <CardDescription>System notifications and security events</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {dashboardData.recentAlerts.map((alert, index) => (
                  <div
                    key={alert.id}
                    className="flex items-start space-x-3 p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200 bg-white/50"
                  >
                    <div className="mt-0.5">{getAlertIcon(alert.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                    </div>
                    <Badge className={`${getAlertBadgeColor(alert.severity)} border text-xs`}>{alert.severity}</Badge>
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-full mt-4 bg-transparent"
                  onClick={() => router.push("/admin/system")}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View All Alerts
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900">Performance Dashboard</CardTitle>
              <CardDescription>Real-time system performance and resource utilization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-6 rounded-xl bg-gradient-to-b from-blue-50 to-blue-100 hover:shadow-md transition-all duration-200">
                  <Cpu className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                  <div className="text-3xl font-bold text-blue-700">68%</div>
                  <div className="text-sm text-blue-600 mb-2">CPU Usage</div>
                  <Progress value={68} className="h-2" />
                </div>

                <div className="text-center p-6 rounded-xl bg-gradient-to-b from-emerald-50 to-emerald-100 hover:shadow-md transition-all duration-200">
                  <HardDrive className="h-8 w-8 mx-auto mb-3 text-emerald-600" />
                  <div className="text-3xl font-bold text-emerald-700">45%</div>
                  <div className="text-sm text-emerald-600 mb-2">Memory Usage</div>
                  <Progress value={45} className="h-2" />
                </div>

                <div className="text-center p-6 rounded-xl bg-gradient-to-b from-purple-50 to-purple-100 hover:shadow-md transition-all duration-200">
                  <Database className="h-8 w-8 mx-auto mb-3 text-purple-600" />
                  <div className="text-3xl font-bold text-purple-700">73%</div>
                  <div className="text-sm text-purple-600 mb-2">Disk Usage</div>
                  <Progress value={73} className="h-2" />
                </div>

                <div className="text-center p-6 rounded-xl bg-gradient-to-b from-orange-50 to-orange-100 hover:shadow-md transition-all duration-200">
                  <Wifi className="h-8 w-8 mx-auto mb-3 text-orange-600" />
                  <div className="text-3xl font-bold text-orange-700">
                    {dashboardData.performanceMetrics.transactionsPerHour.toLocaleString()}
                  </div>
                  <div className="text-sm text-orange-600 mb-2">Transactions/hour</div>
                  <Progress value={85} className="h-2" />
                </div>
              </div>

              <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-emerald-600" />
                    <div>
                      <p className="font-semibold text-gray-900">System Health Score</p>
                      <p className="text-sm text-gray-600">All systems operational with optimal performance</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-emerald-600">98.7%</div>
                    <div className="text-sm text-gray-500">Overall Health</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card
              className="cursor-pointer hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
              onClick={() => router.push("/admin/users")}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-200 rounded-xl">
                    <Users className="h-6 w-6 text-blue-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900">Manage Users</h3>
                    <p className="text-sm text-blue-700">User accounts & roles</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200"
              onClick={() => router.push("/admin/transactions")}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-emerald-200 rounded-xl">
                    <CreditCard className="h-6 w-6 text-emerald-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-emerald-900">Transactions</h3>
                    <p className="text-sm text-emerald-700">Monitor payments</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200"
              onClick={() => router.push("/admin/security")}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-200 rounded-xl">
                    <Shield className="h-6 w-6 text-purple-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-900">Security</h3>
                    <p className="text-sm text-purple-700">Security controls</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200"
              onClick={() => router.push("/admin/system")}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-orange-200 rounded-xl">
                    <Database className="h-6 w-6 text-orange-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-orange-900">System</h3>
                    <p className="text-sm text-orange-700">Infrastructure</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alert Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-xl bg-emerald-200">
                    <CheckCircle className="h-6 w-6 text-emerald-700" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-emerald-900">847</div>
                    <div className="text-sm text-emerald-700">Services Running</div>
                    <div className="text-xs text-emerald-600 mt-1">All systems operational</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-xl bg-amber-200">
                    <AlertTriangle className="h-6 w-6 text-amber-700" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-amber-900">3</div>
                    <div className="text-sm text-amber-700">Active Warnings</div>
                    <div className="text-xs text-amber-600 mt-1">Requires attention</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-xl bg-blue-200">
                    <Activity className="h-6 w-6 text-blue-700" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-900">99.99%</div>
                    <div className="text-sm text-blue-700">Uptime SLA</div>
                    <div className="text-xs text-blue-600 mt-1">847 days uptime</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </div>
  )
}
