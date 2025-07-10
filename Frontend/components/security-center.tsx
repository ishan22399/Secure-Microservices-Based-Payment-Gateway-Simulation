"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Shield, Lock, Eye, AlertTriangle, CheckCircle, Key, UserCheck, Activity, Globe } from "lucide-react"

export default function SecurityCenter() {
  const securityMetrics = [
    {
      title: "Authentication Success",
      value: "99.98%",
      icon: UserCheck,
      color: "text-green-600",
      status: "excellent",
    },
    {
      title: "Fraud Detection Rate",
      value: "0.02%",
      icon: Eye,
      color: "text-blue-600",
      status: "optimal",
    },
    {
      title: "SSL/TLS Compliance",
      value: "100%",
      icon: Lock,
      color: "text-purple-600",
      status: "secure",
    },
    {
      title: "Security Incidents",
      value: "0",
      icon: AlertTriangle,
      color: "text-green-600",
      status: "clean",
    },
  ]

  const authServices = [
    { name: "JWT Token Service", status: "active", load: 78, threats: 0 },
    { name: "OAuth2 Provider", status: "active", load: 65, threats: 0 },
    { name: "RBAC Controller", status: "active", load: 45, threats: 0 },
    { name: "Session Manager", status: "active", load: 82, threats: 0 },
    { name: "API Gateway", status: "active", load: 91, threats: 2 },
    { name: "Fraud Detection AI", status: "active", load: 88, threats: 1 },
  ]

  const recentSecurityEvents = [
    {
      type: "Blocked Attack",
      description: "SQL injection attempt blocked",
      severity: "high",
      timestamp: "2 minutes ago",
      source: "192.168.1.100",
    },
    {
      type: "Authentication",
      description: "Failed login attempts detected",
      severity: "medium",
      timestamp: "5 minutes ago",
      source: "Multiple IPs",
    },
    {
      type: "Rate Limiting",
      description: "API rate limit exceeded",
      severity: "low",
      timestamp: "8 minutes ago",
      source: "203.45.67.89",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {securityMetrics.map((metric, index) => (
          <Card key={index} className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{metric.title}</CardTitle>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <Badge
                variant="secondary"
                className={`mt-2 ${
                  metric.status === "excellent"
                    ? "bg-green-100 text-green-800"
                    : metric.status === "optimal"
                      ? "bg-blue-100 text-blue-800"
                      : metric.status === "secure"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-green-100 text-green-800"
                }`}
              >
                {metric.status}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Authentication Services */}
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Security Services Status</span>
            </CardTitle>
            <CardDescription>Real-time monitoring of authentication and security services</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {authServices.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50/50">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-2 h-2 rounded-full ${service.status === "active" ? "bg-green-500" : "bg-red-500"}`}
                  />
                  <div>
                    <p className="font-medium text-sm">{service.name}</p>
                    <p className="text-xs text-gray-500">
                      {service.threats > 0 ? `${service.threats} threats detected` : "No threats"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-20">
                    <Progress value={service.load} className="h-2" />
                  </div>
                  <span className="text-xs text-gray-500 w-8">{service.load}%</span>
                  {service.threats > 0 && <AlertTriangle className="h-4 w-4 text-orange-500" />}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Security Events */}
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Recent Security Events</span>
            </CardTitle>
            <CardDescription>Live security monitoring and threat detection</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentSecurityEvents.map((event, index) => (
              <div key={index} className="p-4 rounded-lg border border-gray-200 bg-white/50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        event.severity === "high"
                          ? "bg-red-500"
                          : event.severity === "medium"
                            ? "bg-yellow-500"
                            : "bg-blue-500"
                      }`}
                    />
                    <div>
                      <p className="font-medium text-sm">{event.type}</p>
                      <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>{event.timestamp}</span>
                        <span>Source: {event.source}</span>
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className={
                      event.severity === "high"
                        ? "bg-red-100 text-red-800"
                        : event.severity === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                    }
                  >
                    {event.severity}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Security Features */}
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Security Architecture</CardTitle>
          <CardDescription>Multi-layered security implementation with industry best practices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 rounded-lg bg-gradient-to-b from-blue-50 to-blue-100">
              <Key className="h-8 w-8 mx-auto mb-3 text-blue-600" />
              <h3 className="font-semibold mb-2">JWT Authentication</h3>
              <p className="text-sm text-gray-600">Stateless token-based auth with RS256 signing</p>
              <div className="mt-3">
                <Badge className="bg-blue-100 text-blue-800">Active</Badge>
              </div>
            </div>

            <div className="text-center p-6 rounded-lg bg-gradient-to-b from-green-50 to-green-100">
              <UserCheck className="h-8 w-8 mx-auto mb-3 text-green-600" />
              <h3 className="font-semibold mb-2">OAuth2 & RBAC</h3>
              <p className="text-sm text-gray-600">Role-based access control with OAuth2 flows</p>
              <div className="mt-3">
                <Badge className="bg-green-100 text-green-800">Secured</Badge>
              </div>
            </div>

            <div className="text-center p-6 rounded-lg bg-gradient-to-b from-purple-50 to-purple-100">
              <Eye className="h-8 w-8 mx-auto mb-3 text-purple-600" />
              <h3 className="font-semibold mb-2">Fraud Detection</h3>
              <p className="text-sm text-gray-600">AI-powered real-time fraud analysis</p>
              <div className="mt-3">
                <Badge className="bg-purple-100 text-purple-800">Learning</Badge>
              </div>
            </div>

            <div className="text-center p-6 rounded-lg bg-gradient-to-b from-orange-50 to-orange-100">
              <Globe className="h-8 w-8 mx-auto mb-3 text-orange-600" />
              <h3 className="font-semibold mb-2">API Security</h3>
              <p className="text-sm text-gray-600">Rate limiting, CORS, and input validation</p>
              <div className="mt-3">
                <Badge className="bg-orange-100 text-orange-800">Protected</Badge>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <div>
                  <p className="font-semibold">Security Compliance</p>
                  <p className="text-sm text-gray-600">PCI DSS Level 1, SOC 2 Type II, ISO 27001</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                View Certificates
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
