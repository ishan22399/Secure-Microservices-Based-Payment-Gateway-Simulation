"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Shield, Settings, Save, Bell, Lock } from "lucide-react"
import { supabase } from "@/lib/supabase-client"
import { Database } from "@/types/supabase"

export default function AdminSettingsPage() {
  const { user, isLoading } = useAuth()
  const [settings, setSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: Shield },
    { name: "Users", href: "/admin/users", icon: Shield },
    { name: "Transactions", href: "/admin/transactions", icon: Shield },
    { name: "Security", href: "/admin/security", icon: Shield },
    { name: "System", href: "/admin/system", icon: Shield },
    { name: "Analytics", href: "/admin/analytics", icon: Shield },
    { name: "Settings", href: "/admin/settings", icon: Shield, current: true },
  ]

  useEffect(() => {
    if (!isLoading && user?.id && user?.role === "bank_admin") {
      fetchSettings()
    }
  }, [user?.id, user?.role, isLoading])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      // In a real application, these settings would likely be stored in a dedicated 'settings' table
      // or as configuration in your backend. For this simulation, we'll use mock data.
      setSettings(mockSettings)
    } catch (error) {
      console.error("Failed to fetch settings:", error)
      setSettings(mockSettings)
    } finally {
      setLoading(false)
    }
  }

  const mockSettings = {
    general: {
      platformName: "SecurePay Gateway",
      supportEmail: "support@securepay.com",
      timezone: "UTC",
      language: "en",
    },
    security: {
      requireTwoFactor: true,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      passwordPolicy: "strong",
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      webhookNotifications: true,
      alertThreshold: 1000,
    },
    payment: {
      defaultCurrency: "USD",
      maxTransactionAmount: 10000,
      processingFeeRate: 2.9,
      settlementPeriod: 2,
    },
  }

  const data = settings || mockSettings

  const handleSave = async () => {
    setSaving(true)
    try {
      // In a real application, you would send these settings to your backend API to save them.
      // For this simulation, we'll just log them.
      console.log("Saving settings:", data)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Show success message
      console.log("Settings saved successfully")
    } catch (error) {
      console.error("Failed to save settings:", error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout navigation={navigation} title="System Settings">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading settings...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout navigation={navigation} title="System Settings">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">System Settings</h2>
            <p className="text-muted-foreground">Configure platform settings and preferences</p>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              General Settings
            </CardTitle>
            <CardDescription>Basic platform configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="platform-name">Platform Name</Label>
                <Input
                  id="platform-name"
                  value={data.general.platformName}
                  onChange={(e) =>
                    setSettings({
                      ...data,
                      general: { ...data.general, platformName: e.target.value },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="support-email">Support Email</Label>
                <Input
                  id="support-email"
                  type="email"
                  value={data.general.supportEmail}
                  onChange={(e) =>
                    setSettings({
                      ...data,
                      general: { ...data.general, supportEmail: e.target.value },
                    })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  value={data.general.timezone}
                  onValueChange={(value) =>
                    setSettings({
                      ...data,
                      general: { ...data.general, timezone: value },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="EST">Eastern Time</SelectItem>
                    <SelectItem value="PST">Pacific Time</SelectItem>
                    <SelectItem value="GMT">GMT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="language">Language</Label>
                <Select
                  value={data.general.language}
                  onValueChange={(value) =>
                    setSettings({
                      ...data,
                      general: { ...data.general, language: value },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="h-5 w-5 mr-2" />
              Security Settings
            </CardTitle>
            <CardDescription>Configure security policies and restrictions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Require Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">Force 2FA for all admin users</p>
              </div>
              <Switch
                checked={data.security.requireTwoFactor}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...data,
                    security: { ...data.security, requireTwoFactor: checked },
                  })
                }
              />
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                <Input
                  id="session-timeout"
                  type="number"
                  value={data.security.sessionTimeout}
                  onChange={(e) =>
                    setSettings({
                      ...data,
                      security: { ...data.security, sessionTimeout: Number(e.target.value) },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="max-login">Max Login Attempts</Label>
                <Input
                  id="max-login"
                  type="number"
                  value={data.security.maxLoginAttempts}
                  onChange={(e) =>
                    setSettings({
                      ...data,
                      security: { ...data.security, maxLoginAttempts: Number(e.target.value) },
                    })
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password-policy">Password Policy</Label>
              <Select
                value={data.security.passwordPolicy}
                onValueChange={(value) =>
                  setSettings({
                    ...data,
                    security: { ...data.security, passwordPolicy: value },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="strong">Strong</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Notification Settings
            </CardTitle>
            <CardDescription>Configure notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Send notifications via email</p>
              </div>
              <Switch
                checked={data.notifications.emailNotifications}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...data,
                    notifications: { ...data.notifications, emailNotifications: checked },
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">Send notifications via SMS</p>
              </div>
              <Switch
                checked={data.notifications.smsNotifications}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...data,
                    notifications: { ...data.notifications, smsNotifications: checked },
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Webhook Notifications</Label>
                <p className="text-sm text-muted-foreground">Send notifications via webhooks</p>
              </div>
              <Switch
                checked={data.notifications.webhookNotifications}
                onCheckedChange={(checked) =>
                  setSettings({
                    ...data,
                    notifications: { ...data.notifications, webhookNotifications: checked },
                  })
                }
              />
            </div>

            <Separator />

            <div>
              <Label htmlFor="alert-threshold">Alert Threshold ($)</Label>
              <Input
                id="alert-threshold"
                type="number"
                value={data.notifications.alertThreshold}
                onChange={(e) =>
                  setSettings({
                    ...data,
                    notifications: { ...data.notifications, alertThreshold: Number(e.target.value) },
                  })
                }
              />
              <p className="text-xs text-muted-foreground mt-1">Send alerts for transactions above this amount</p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Settings</CardTitle>
            <CardDescription>Configure payment processing parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="default-currency">Default Currency</Label>
                <Select
                  value={data.payment.defaultCurrency}
                  onValueChange={(value) =>
                    setSettings({
                      ...data,
                      payment: { ...data.payment, defaultCurrency: value },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="JPY">JPY</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="max-transaction">Max Transaction Amount</Label>
                <Input
                  id="max-transaction"
                  type="number"
                  value={data.payment.maxTransactionAmount}
                  onChange={(e) =>
                    setSettings({
                      ...data,
                      payment: { ...data.payment, maxTransactionAmount: Number(e.target.value) },
                    })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fee-rate">Processing Fee Rate (%)</Label>
                <Input
                  id="fee-rate"
                  type="number"
                  step="0.1"
                  value={data.payment.processingFeeRate}
                  onChange={(e) =>
                    setSettings({
                      ...data,
                      payment: { ...data.payment, processingFeeRate: Number(e.target.value) },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="settlement-period">Settlement Period (days)</Label>
                <Input
                  id="settlement-period"
                  type="number"
                  value={data.payment.settlementPeriod}
                  onChange={(e) =>
                    setSettings({
                      ...data,
                      payment: { ...data.payment, settlementPeriod: Number(e.target.value) },
                    })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
