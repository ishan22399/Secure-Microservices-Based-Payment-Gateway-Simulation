"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Activity,
  Server,
  Database,
  Cpu,
  HardDrive,
  Wifi,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Zap,
} from "lucide-react"

export default function SystemMonitoring() {
  const systemMetrics = [
    {
      title: "System Uptime",
      value: "99.99%",
      subtitle: "847 days",
      icon: Activity,
      color: "text-green-600",
      status: "excellent",
    },
    {
      title: "Response Time",
      value: "45ms",
      subtitle: "Avg latency",
      icon: Zap,
      color: "text-blue-600",
      status: "optimal",
    },
    {
      title: "Throughput",
      value: "12.4K",
      subtitle: "TPS",
      icon: TrendingUp,
      color: "text-purple-600",
      status: "high",
    },
    {
      title: "Error Rate",
      value: "0.01%",
      subtitle: "Last 24h",
      icon: AlertTriangle,
      color: "text-green-600",
      status: "minimal",
    },
  ]

  const microservices = [
    {
      name: "API Gateway",
      status: "healthy",
      cpu: 78,
      memory: 65,
      instances: 3,
      requests: "2.4K/min",
    },
    {
      name: "Auth Service",
      status: "healthy",
      cpu: 45,
      memory: 52,
      instances: 2,
      requests: "890/min",
    },
    {
      name: "Transaction Service",
      status: "healthy",
      cpu: 82,
      memory: 71,
      instances: 5,
      requests: "5.2K/min",
    },
    {
      name: "Notification Service",
      status: "healthy",
      cpu: 34,
      memory: 28,
      instances: 2,
      requests: "1.1K/min",
    },
    {
      name: "Fraud Detection",
      status: "warning",
      cpu: 91,
      memory: 88,
      instances: 4,
      requests: "3.7K/min",
    },
    {
      name: "Settlement Service",
      status: "healthy",
      cpu: 56,
      memory: 43,
      instances: 3,
      requests: "670/min",
    },
  ]

  const infrastructure = [
    {
      component: "Load Balancer",
      status: "healthy",
      utilization: 67,
      connections: "12.4K",
    },
    {
      component: "Database Cluster",
      status: "healthy",
      utilization: 73,
      connections: "847",
    },
    {
      component: "Redis Cache",
      status: "healthy",
      utilization: 45,
      connections: "2.1K",
    },
    {
      component: "Message Queue",
      status: "healthy",
      utilization: 82,
      connections: "5.6K",
    },
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

  return (
    <div className="space-y-6">
      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemMetrics.map((metric, index) => (
          <Card key={index} className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{metric.title}</CardTitle>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-gray-600 mt-1">{metric.subtitle}</p>
              <Badge
                variant="secondary"
                className={`mt-2 ${
                  metric.status === "excellent"
                    ? "bg-green-100 text-green-800"
                    : metric.status === "optimal"
                      ? "bg-blue-100 text-blue-800"
                      : metric.status === "high"
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
        {/* Microservices Health */}
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Server className="h-5 w-5" />
              <span>Microservices Health</span>
            </CardTitle>
            <CardDescription>Real-time monitoring of all microservices</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {microservices.map((service, index) => (
              <div key={index} className="p-4 rounded-lg bg-gray-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(service.status)}`} />
                    <div>
                      <p className="font-medium text-sm">{service.name}</p>
                      <p className="text-xs text-gray-500">
                        {service.instances} instances • {service.requests}
                      </p>
                    </div>
                  </div>
                  {getStatusIcon(service.status)}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>CPU</span>
                      <span>{service.cpu}%</span>
                    </div>
                    <Progress value={service.cpu} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Memory</span>
                      <span>{service.memory}%</span>
                    </div>
                    <Progress value={service.memory} className="h-2" />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Infrastructure Status */}
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>Infrastructure Status</span>
            </CardTitle>
            <CardDescription>Core infrastructure components monitoring</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {infrastructure.map((component, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-50/50">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(component.status)}`} />
                  <div>
                    <p className="font-medium text-sm">{component.component}</p>
                    <p className="text-xs text-gray-500">{component.connections} connections</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-24">
                    <Progress value={component.utilization} className="h-2" />
                  </div>
                  <span className="text-xs text-gray-500 w-8">{component.utilization}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Performance Dashboard</CardTitle>
          <CardDescription>Real-time system performance and resource utilization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 rounded-lg bg-gradient-to-b from-blue-50 to-blue-100">
              <Cpu className="h-8 w-8 mx-auto mb-3 text-blue-600" />
              <div className="text-2xl font-bold text-blue-700">68%</div>
              <div className="text-sm text-blue-600">CPU Usage</div>
              <Progress value={68} className="mt-2 h-2" />
            </div>

            <div className="text-center p-6 rounded-lg bg-gradient-to-b from-green-50 to-green-100">
              <HardDrive className="h-8 w-8 mx-auto mb-3 text-green-600" />
              <div className="text-2xl font-bold text-green-700">45%</div>
              <div className="text-sm text-green-600">Memory Usage</div>
              <Progress value={45} className="mt-2 h-2" />
            </div>

            <div className="text-center p-6 rounded-lg bg-gradient-to-b from-purple-50 to-purple-100">
              <Database className="h-8 w-8 mx-auto mb-3 text-purple-600" />
              <div className="text-2xl font-bold text-purple-700">73%</div>
              <div className="text-sm text-purple-600">Disk Usage</div>
              <Progress value={73} className="mt-2 h-2" />
            </div>

            <div className="text-center p-6 rounded-lg bg-gradient-to-b from-orange-50 to-orange-100">
              <Wifi className="h-8 w-8 mx-auto mb-3 text-orange-600" />
              <div className="text-2xl font-bold text-orange-700">12.4K</div>
              <div className="text-sm text-orange-600">Network TPS</div>
              <Progress value={85} className="mt-2 h-2" />
            </div>
          </div>

          <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <div>
                  <p className="font-semibold">System Health Score</p>
                  <p className="text-sm text-gray-600">All systems operational with optimal performance</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">98.7%</div>
                <div className="text-sm text-gray-500">Health Score</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-lg bg-green-200">
                <CheckCircle className="h-6 w-6 text-green-700" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-900">847</div>
                <div className="text-sm text-green-700">Services Running</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-lg bg-yellow-200">
                <AlertTriangle className="h-6 w-6 text-yellow-700" />
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-900">3</div>
                <div className="text-sm text-yellow-700">Warnings</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-lg bg-blue-200">
                <Activity className="h-6 w-6 text-blue-700" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-900">99.99%</div>
                <div className="text-sm text-blue-700">Uptime SLA</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
