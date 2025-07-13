"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { apiFetch } from "@/lib/api"
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
} from "lucide-react"

export default function AdminDashboard() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  const [stats, setStats] = useState<any[]>([])
  const [systemHealth, setSystemHealth] = useState<any[]>([])
  const [recentAlerts, setRecentAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "bank_admin")) {
      router.push("/auth/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true)
      try {
        // Example endpoints, adjust as needed for your backend
        const statsRes = await apiFetch("/api/admin/dashboard/stats")
        const healthRes = await apiFetch("/api/admin/dashboard/system-health")
        const alertsRes = await apiFetch("/api/admin/dashboard/alerts")

        const statsData = statsRes.ok ? await statsRes.json() : null
        const healthData = healthRes.ok ? await healthRes.json() : null
        const alertsData = alertsRes.ok ? await alertsRes.json() : null

        setStats(statsData?.stats || [])
        setSystemHealth(healthData?.systemHealth || [])
        setRecentAlerts(alertsData?.alerts || [])
      } catch (e) {
        // fallback to empty or mock data if needed
        setStats([])
        setSystemHealth([])
        setRecentAlerts([])
      } finally {
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [])

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
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <CheckCircle className="h-4 w-4 text-gray-600" />
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

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <DashboardLayout navigation={navigation} title="Admin Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-purple-500 to-red-600 rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">System Administration</h1>
          <p className="text-purple-100">Monitor and manage the entire payment gateway infrastructure.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
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
                    {getStatusIcon(service.status)}
                    <span className="font-medium">{service.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20">
                      <Progress value={service.load} className="h-2" />
                    </div>
                    <span className="text-sm text-gray-500 w-8">{service.load}%</span>
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
                <span>Recent Alerts</span>
              </CardTitle>
              <CardDescription>System notifications and alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs text-gray-500">{alert.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Manage Users</h3>
                  <p className="text-sm text-gray-500">User accounts & roles</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CreditCard className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Transactions</h3>
                  <p className="text-sm text-gray-500">Monitor payments</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Security</h3>
                  <p className="text-sm text-gray-500">Security controls</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Database className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold">System</h3>
                  <p className="text-sm text-gray-500">Infrastructure</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Real-time system performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">12.4K</div>
                <div className="text-sm text-gray-500">Transactions/hour</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">45ms</div>
                <div className="text-sm text-gray-500">Avg response time</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-purple-600">99.97%</div>
                <div className="text-sm text-gray-500">Success rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
