"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Shield, Zap, Users, ArrowRight, CheckCircle, Globe, Lock } from 'lucide-react'
import Link from "next/link"

export default function LandingPage() {
  const features = [
    {
      icon: Shield,
      title: "Bank-Grade Security",
      description: "PCI DSS Level 1 compliant with end-to-end encryption and fraud detection",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Process transactions in under 50ms with 99.99% uptime guarantee",
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Accept payments from 190+ countries with multi-currency support",
    },
    {
      icon: Users,
      title: "Multi-Role Access",
      description: "Dedicated dashboards for customers, merchants, and administrators",
    },
  ]

  const stats = [
    { value: "$2.4B+", label: "Processed Monthly" },
    { value: "99.99%", label: "Uptime SLA" },
    { value: "50ms", label: "Avg Response Time" },
    { value: "10K+", label: "Active Merchants" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                SecurePay Gateway
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth/register">
                <Button className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-4 bg-red-100 text-red-800">
            Enterprise Payment Solution
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-transparent">
            Secure Payment Gateway
            <br />
            <span className="text-red-500">Built for Scale</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Enterprise-grade payment processing with microservices architecture, multi-role authentication, and
            real-time transaction monitoring.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button
                size="lg"
                className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-white/50">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose SecurePay?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built with modern microservices architecture and enterprise security standards
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow"
              >
                <CardHeader>
                  <feature.icon className="h-12 w-12 text-red-500 mb-4" />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Role-Based Access Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-gray-50 to-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Multi-Role Dashboard</h2>
            <p className="text-xl text-gray-600">Tailored experiences for every user type</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0 shadow-lg">
              <CardHeader>
                <Users className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle className="text-xl text-blue-900">Customer Portal</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-blue-800">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Secure payment processing
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Transaction history
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Payment methods management
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-0 shadow-lg">
              <CardHeader>
                <CreditCard className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle className="text-xl text-green-900">Merchant Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-green-800">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Real-time analytics
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Transaction monitoring
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Settlement management
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-0 shadow-lg">
              <CardHeader>
                <Lock className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle className="text-xl text-purple-900">Admin Control</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-purple-800">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    System monitoring
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    User management
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Security controls
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-red-500 to-orange-500">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform Your Payments?</h2>
          <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses processing billions in secure transactions
          </p>
          <Link href="/auth/register">
            <Button size="lg" variant="secondary" className="bg-white text-red-600 hover:bg-gray-100">
              Get Started Today
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-900 text-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">SecurePay</span>
              </div>
              <p className="text-gray-400">Enterprise payment gateway built for the modern world.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Payment Processing</li>
                <li>Security Features</li>
                <li>Analytics</li>
                <li>API Documentation</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Careers</li>
                <li>Contact</li>
                <li>Support</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Compliance</li>
                <li>Security</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SecurePay Gateway. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
