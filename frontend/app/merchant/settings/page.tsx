"use client"

import { useState, useEffect } from "react"
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
import { supabase } from "@/lib/supabase-client"
import { Database } from "@/types/supabase"

type Merchant = Database['public']['Tables']['merchants']['Row']

export default function MerchantSettingsPage() {
  const { user, isLoading } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const [businessSettings, setBusinessSettings] = useState<Partial<Merchant>>({
    name: "",
    business_type: "",
    address: "",
    phone: "",
    // website: "", // Not in schema
    // description: "", // Not in schema
    // taxId: "", // Not in schema
  })

  const [paymentSettings, setPaymentSettings] = useState({
    processingFee: "2.9", // This would likely be a global setting or per merchant in a separate table
    settlementPeriod: "daily", // This would likely be a global setting or per merchant in a separate table
    currency: "USD",
    autoSettle: true,
    webhookUrl: "", // This would likely be a global setting or per merchant in a separate table
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

  useEffect(() => {
    if (!isLoading && user?.id) {
      fetchMerchantSettings()
    }
  }, [user?.id, isLoading])

  const fetchMerchantSettings = async () => {
    if (!user?.id) return

    const { data, error } = await supabase
      .from('merchants')
      .select('name, business_type, address, phone')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error("Error fetching merchant settings:", error)
    } else if (data) {
      setBusinessSettings({
        name: data.name || "",
        business_type: data.business_type || "",
        address: data.address || "",
        phone: data.phone || "",
      })
    }
  }

  const handleSaveSettings = async (section: string) => {
    setLoading(true)
    if (!user?.id) return

    try {
      if (section === "Business") {
        const { error } = await supabase
          .from('merchants')
          .update({
            name: businessSettings.name,
            business_type: businessSettings.business_type,
            address: businessSettings.address,
            phone: businessSettings.phone,
          })
          .eq('id', user.id)

        if (error) {
          throw error
        }
      } else if (section === "Payment") {
        // Payment settings are not directly in the merchants table in the inferred schema.
        // This would require a separate table or more complex logic.
        console.warn("Payment settings update not implemented for this schema.")
      } else if (section === "Security") {
        // Security settings are not directly in the merchants table in the inferred schema.
        console.warn("Security settings update not implemented for this schema.")
      } else if (section === "Notification") {
        // Notification settings are not directly in the merchants table in the inferred schema.
        console.warn("Notification settings update not implemented for this schema.")
      }

      toast({
        title: "Settings Saved",
        description: `${section} settings have been updated successfully.`,
      })
    } catch (error: any) {
      console.error("Error saving settings:", error)
      toast({
        title: "Error",
        description: `Failed to save settings: ${error.message || "Unknown error"}`,
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
                <Label htmlFor="name">Business Name</Label>
                <Input
                  id="name"
                  value={businessSettings.name}
                  onChange={(e) => setBusinessSettings({ ...businessSettings, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="business_type">Business Type</Label>
                <Select
                  value={businessSettings.business_type}
                  onValueChange={(value) => setBusinessSettings({ ...businessSettings, business_type: value })}
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
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={businessSettings.phone}
                onChange={(e) => setBusinessSettings({ ...businessSettings, phone: e.target.value })}
              />
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
