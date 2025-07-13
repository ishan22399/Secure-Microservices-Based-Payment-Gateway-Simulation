"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Save, Shield, Bell, Globe, DollarSign } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function MerchantSettingsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const [businessSettings, setBusinessSettings] = useState({
    businessName: "Amazon Store",
    businessType: "e-commerce",
    website: "https://amazon.com",
    description: "Global e-commerce marketplace",
    taxId: "12-3456789",
    phone: "+1-555-0123",
    address: "123 Commerce St, Seattle, WA 98101",
  })

  const [paymentSettings, setPaymentSettings] = useState({
    processingFee: "2.9",
    settlementPeriod: "daily",
    currency: "USD",
    autoSettle: true,
    webhookUrl: "",
  })

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    fraudDetection: true,
    ipWhitelist: "",
    apiKeyRotation: "monthly",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    transactionAlerts: true,
    dailyReports: true,
    weeklyReports: true,
  })

  const navigation = [
    { name: "Dashboard", href: "/merchant/dashboard", icon: CreditCard },
    { name: "Transactions", href: "/merchant/transactions", icon: CreditCard },
    { name: "Analytics", href: "/merchant/analytics", icon: CreditCard },
    { name: "Customers", href: "/merchant/customers", icon: CreditCard },
    { name: "Payment Links", href: "/merchant/payment-links", icon: CreditCard },
    { name: "Settings", href: "/merchant/settings", icon: CreditCard, current: true },
  ]

  const handleSaveSettings = async (section: string) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Settings Saved",
        description: `${section} settings have been updated successfully.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout navigation={navigation} title="Settings">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Account Settings</h2>
          <p className="text-muted-foreground">Manage your merchant account preferences and configurations</p>
        </div>

        {/* Business Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              Business Information
            </CardTitle>
            <CardDescription>Update your business details and contact information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  value={businessSettings.businessName}
                  onChange={(e) => setBusinessSettings({ ...businessSettings, businessName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessType">Business Type</Label>
                <Select
                  value={businessSettings.businessType}
                  onValueChange={(value) => setBusinessSettings({ ...businessSettings, businessType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="e-commerce">E-commerce</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="services">Services</SelectItem>
                    <SelectItem value="saas">SaaS</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                value={businessSettings.website}
                onChange={(e) => setBusinessSettings({ ...businessSettings, website: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Business Description</Label>
              <Input
                id="description"
                value={businessSettings.description}
                onChange={(e) => setBusinessSettings({ ...businessSettings, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="taxId">Tax ID</Label>
                <Input
                  id="taxId"
                  value={businessSettings.taxId}
                  onChange={(e) => setBusinessSettings({ ...businessSettings, taxId: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={businessSettings.phone}
                  onChange={(e) => setBusinessSettings({ ...businessSettings, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Business Address</Label>
              <Input
                id="address"
                value={businessSettings.address}
                onChange={(e) => setBusinessSettings({ ...businessSettings, address: e.target.value })}
              />
            </div>

            <Button onClick={() => handleSaveSettings("Business")} disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              Save Business Settings
            </Button>
          </CardContent>
        </Card>

        {/* Payment Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Payment Settings
            </CardTitle>
            <CardDescription>Configure payment processing and settlement preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="processingFee">Processing Fee (%)</Label>
                <Input
                  id="processingFee"
                  type="number"
                  step="0.1"
                  value={paymentSettings.processingFee}
                  onChange={(e) => setPaymentSettings({ ...paymentSettings, processingFee: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="settlementPeriod">Settlement Period</Label>
                <Select
                  value={paymentSettings.settlementPeriod}
                  onValueChange={(value) => setPaymentSettings({ ...paymentSettings, settlementPeriod: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Default Currency</Label>
                <Select
                  value={paymentSettings.currency}
                  onValueChange={(value) => setPaymentSettings({ ...paymentSettings, currency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="autoSettle"
                checked={paymentSettings.autoSettle}
                onCheckedChange={(checked) => setPaymentSettings({ ...paymentSettings, autoSettle: checked })}
              />
              <Label htmlFor="autoSettle">Enable automatic settlement</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="webhookUrl">Webhook URL</Label>
              <Input
                id="webhookUrl"
                type="url"
                placeholder="https://your-site.com/webhook"
                value={paymentSettings.webhookUrl}
                onChange={(e) => setPaymentSettings({ ...paymentSettings, webhookUrl: e.target.value })}
              />
            </div>

            <Button onClick={() => handleSaveSettings("Payment")} disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              Save Payment Settings
            </Button>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Security Settings
            </CardTitle>
            <CardDescription>Manage security features and access controls</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                </div>
                <Switch
                  checked={securitySettings.twoFactorAuth}
                  onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, twoFactorAuth: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Fraud Detection</Label>
                  <p className="text-sm text-muted-foreground">Enable automatic fraud detection and prevention</p>
                </div>
                <Switch
                  checked={securitySettings.fraudDetection}
                  onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, fraudDetection: checked })}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="ipWhitelist">IP Whitelist</Label>
                <Input
                  id="ipWhitelist"
                  placeholder="192.168.1.1, 10.0.0.1"
                  value={securitySettings.ipWhitelist}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, ipWhitelist: e.target.value })}
                />
                <p className="text-sm text-muted-foreground">Comma-separated list of allowed IP addresses</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiKeyRotation">API Key Rotation</Label>
                <Select
                  value={securitySettings.apiKeyRotation}
                  onValueChange={(value) => setSecuritySettings({ ...securitySettings, apiKeyRotation: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={() => handleSaveSettings("Security")} disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              Save Security Settings
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Notification Settings
            </CardTitle>
            <CardDescription>Configure how you receive notifications and reports</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive critical alerts via SMS</p>
                </div>
                <Switch
                  checked={notificationSettings.smsNotifications}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, smsNotifications: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Transaction Alerts</Label>
                  <p className="text-sm text-muted-foreground">Get notified of new transactions</p>
                </div>
                <Switch
                  checked={notificationSettings.transactionAlerts}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, transactionAlerts: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Daily Reports</Label>
                  <p className="text-sm text-muted-foreground">Receive daily transaction summaries</p>
                </div>
                <Switch
                  checked={notificationSettings.dailyReports}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, dailyReports: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Weekly Reports</Label>
                  <p className="text-sm text-muted-foreground">Receive weekly analytics reports</p>
                </div>
                <Switch
                  checked={notificationSettings.weeklyReports}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, weeklyReports: checked })
                  }
                />
              </div>
            </div>

            <Button onClick={() => handleSaveSettings("Notification")} disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              Save Notification Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
