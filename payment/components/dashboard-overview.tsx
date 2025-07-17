"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DollarSign, CreditCard, TrendingUp, Shield, Activity, Users, Globe, Zap } from "lucide-react"

export default function DashboardOverview() {
  const metrics = [
    {
      title: "Total Transactions",
      value: "$2.4M",
      change: "+12.5%",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Success Rate",
      value: "99.97%",
      change: "+0.03%",
      icon: Shield,
      color: "text-blue-600",
    },
    {
      title: "Active Merchants",
      value: "1,247",
      change: "+8.2%",
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Avg Response Time",
      value: "45ms",
      change: "-12ms",
      icon: Zap,
      color: "text-orange-600",
    },
  ]

  const microservices = [
    { name: "Auth Service", status: "healthy", load: 85, instances: 3 },
    { name: "Transaction Service", status: "healthy", load: 72, instances: 5 },
    { name: "Notification Service", status: "healthy", load: 45, instances: 2 },
    { name: "Fraud Detection", status: "healthy", load: 91, instances: 4 },
    { name: "Settlement Service", status: "warning", load: 95, instances: 2 },
    { name: "Reporting Service", status: "healthy", load: 38, instances: 2 },
  ]

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index} className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{metric.title}</CardTitle>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-gray-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                {metric.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Microservices Health */}
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Microservices Health</span>
            </CardTitle>
            <CardDescription>Real-time status of all microservices</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {microservices.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50/50">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      service.status === "healthy"
                        ? "bg-green-500"
                        : service.status === "warning"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                  />
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

        {/* Transaction Flow */}
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span>Global Transaction Flow</span>
            </CardTitle>
            <CardDescription>Real-time transaction processing across regions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100">
                <div>
                  <p className="font-semibold">North America</p>
                  <p className="text-sm text-gray-600">847 TPS</p>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Active
                </Badge>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-green-50 to-green-100">
                <div>
                  <p className="font-semibold">Europe</p>
                  <p className="text-sm text-gray-600">623 TPS</p>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Active
                </Badge>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-purple-50 to-purple-100">
                <div>
                  <p className="font-semibold">Asia Pacific</p>
                  <p className="text-sm text-gray-600">1,234 TPS</p>
                </div>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  Peak Load
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Architecture Overview */}
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Microservices Architecture</CardTitle>
          <CardDescription>Distributed system design with fault tolerance and high availability</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-lg bg-gradient-to-b from-gray-50 to-gray-100">
              <Shield className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <h3 className="font-semibold mb-1">Security Layer</h3>
              <p className="text-sm text-gray-600">JWT, OAuth2, RBAC</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-gradient-to-b from-gray-50 to-gray-100">
              <Activity className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <h3 className="font-semibold mb-1">Service Mesh</h3>
              <p className="text-sm text-gray-600">Circuit Breakers, Load Balancing</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-gradient-to-b from-gray-50 to-gray-100">
              <CreditCard className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <h3 className="font-semibold mb-1">Payment Processing</h3>
              <p className="text-sm text-gray-600">Multi-threaded, Async Messaging</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
