"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Shield, AlertTriangle, Lock } from "lucide-react"

export default function AdminSecurityPage() {
  const { user } = useAuth()
  const [securityMetrics, setSecurityMetrics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: Shield },
    { name: "Users", href: "/admin/users", icon: Shield },
    { name: "Transactions", href: "/admin/transactions", icon: Shield },
    { name: "Security", href: "/admin/security", icon: Shield, current: true },
    { name: "System", href: "/admin/system", icon: Shield },
    { name: "Analytics", href: "/admin/analytics", icon: Shield },
    { name: "Settings", href: "/admin/settings", icon: Shield },
  ]

  useEffect(() => {
    if (user?.id && user?.role === "bank_admin") {
      fetchSecurityMetrics()
    }
  }, [user?.id, user?.role])

  const fetchSecurityMetrics = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/security")

      if (!response.ok) {
        throw new Error("Failed to fetch security metrics")
      }

      const data = await response.json()
      setSecurityMetrics(data)
    } catch (error) {
      console.error("Failed to fetch security metrics:", error)
      setSecurityMetrics(mockSecurityData)
    } finally {
      setLoading(false)
    }
  }

  const mockSecurityData = {
    threatLevel: "medium",
    activeThreats: 3,
    blockedAttempts: 147,
    securityScore: 85,
    recentAlerts: [
      {
        id: "alert_001",
        type: "login_attempt",
        severity: "high",
        message: "Multiple failed login attempts detected",
        timestamp: "2024-01-20T10:30:00Z",
        resolved: false,
      },
      {
        id: "alert_002",
        type: "fraud_detection",
        severity: "medium",
        message: "Suspicious transaction pattern detected",
        timestamp: "2024-01-20T09:15:00Z",
        resolved: true,
      },
    ],
    securitySettings: {
      twoFactorAuth: true,
      fraudDetection: true,
      realTimeMonitoring: true,
      autoBlocking: false,
      emailAlerts: true,
    },
  }

  const data = securityMetrics || mockSecurityData

  if (loading) {
    return (
      <DashboardLayout navigation={navigation} title="Security Center">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading security metrics...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout navigation={navigation} title="Security Center">
      <div className="space-y-6">
        {/* Security Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Threat Level</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">{data.threatLevel}</div>
              <Badge
                className={
                  data.threatLevel === "high"
                    ? "bg-red-100 text-red-800"
                    : data.threatLevel === "medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                }
              >
                {data.threatLevel.toUpperCase()}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Threats</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{data.activeThreats}</div>
              <p className="text-xs text-muted-foreground">Require immediate attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blocked Attempts</CardTitle>
              <Lock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.blockedAttempts}</div>
              <p className="text-xs text-muted-foreground">Last 24 hours</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Security Score</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.securityScore}%</div>
              <Progress value={data.securityScore} className="h-2 mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Security Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Security Alerts</CardTitle>
            <CardDescription>Monitor and respond to security incidents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentAlerts.map((alert: any) => (
                <Alert key={alert.id} variant={alert.severity === "high" ? "destructive" : "default"}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{alert.message}</p>
                        <p className="text-sm text-gray-500 mt-1">{new Date(alert.timestamp).toLocaleString()}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={alert.severity === "high" ? "destructive" : "secondary"}>
                          {alert.severity}
                        </Badge>
                        {alert.resolved && <Badge className="bg-green-100 text-green-800">Resolved</Badge>}
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>Configure security features and monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                  <p className="text-sm text-gray-500">Require 2FA for all admin accounts</p>
                </div>
                <Switch id="two-factor" checked={data.securitySettings.twoFactorAuth} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="fraud-detection">Fraud Detection</Label>
                  <p className="text-sm text-gray-500">Automatically detect suspicious transactions</p>
                </div>
                <Switch id="fraud-detection" checked={data.securitySettings.fraudDetection} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="real-time">Real-time Monitoring</Label>
                  <p className="text-sm text-gray-500">Monitor all activities in real-time</p>
                </div>
                <Switch id="real-time" checked={data.securitySettings.realTimeMonitoring} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-blocking">Auto-blocking</Label>
                  <p className="text-sm text-gray-500">Automatically block suspicious accounts</p>
                </div>
                <Switch id="auto-blocking" checked={data.securitySettings.autoBlocking} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-alerts">Email Alerts</Label>
                  <p className="text-sm text-gray-500">Send email notifications for security events</p>
                </div>
                <Switch id="email-alerts" checked={data.securitySettings.emailAlerts} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
