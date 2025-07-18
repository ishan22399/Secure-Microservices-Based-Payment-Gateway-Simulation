"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Save, Upload, Mail, Phone, MapPin, Calendar, Building } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase-client"
import { Database } from "@/types/supabase"

type Profile = Database['public']['Tables']['profiles']['Row']
type Merchant = Database['public']['Tables']['merchants']['Row']

export default function MerchantProfilePage() {
  const { user, isLoading } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [profileData, setProfileData] = useState<Partial<Profile & Merchant>>({
    full_name: user?.full_name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    company_name: user?.company_name || "",
    // position: "", // Not in schema
    // bio: "", // Not in schema
    // website: "", // Not in schema
  })

  const [accountStats, setAccountStats] = useState({
    memberSince: "",
    totalTransactions: 0,
    totalRevenue: 0,
    activeCustomers: 0,
    successRate: 0,
  })

  useEffect(() => {
    if (!isLoading && user) {
      fetchProfileData()
      fetchAccountStats()
    }
  }, [user, isLoading])

  const fetchProfileData = async () => {
    if (!user) return
    const { data, error } = await supabase
      .from('profiles')
      .select('*, merchants(*)') // Select profile and join with merchants table
      .eq('id', user.id)
      .single()

    if (error) {
      console.error("Error fetching profile:", error)
      toast({
        title: "Error",
        description: "Failed to fetch profile data.",
        variant: "destructive",
      })
    } else if (data) {
      setProfileData({
        full_name: data.full_name || "",
        email: user.email, // Email comes from auth.users
        phone: data.phone || "",
        address: data.address || "",
        company_name: data.merchants?.name || data.company_name || "", // Use merchant name if available, fallback to company_name
        // position: data.position || "",
        // bio: data.bio || "",
        // website: data.website || "",
      })
    }
  }

  const fetchAccountStats = async () => {
    if (!user) return

    // Fetch total transactions and total revenue for the merchant
    const { data: transactionsData, error: transactionsError } = await supabase
      .from('transactions')
      .select('amount, created_at')
      .eq('merchant_id', user.id)

    if (transactionsError) {
      console.error("Error fetching transactions for stats:", transactionsError)
    } else {
      const totalRevenue = transactionsData?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0
      const totalTransactions = transactionsData?.length || 0

      // Fetch active customers (this would require a more complex query or a separate table)
      const { count: activeCustomersCount, error: customersError } = await supabase
        .from('customers')
        .select('id', { count: 'exact' })
        .eq('merchant_id', user.id)

      if (customersError) {
        console.error("Error fetching active customers:", customersError)
      }

      const memberSince = user.created_at // Use user creation date as fallback

      setAccountStats({
        memberSince: memberSince ? new Date(memberSince).toISOString() : "",
        totalTransactions,
        totalRevenue,
        activeCustomers: activeCustomersCount || 0,
        successRate: 98.5, // Placeholder
      })
    }
  }

  const navigation = [
    { name: "Dashboard", href: "/merchant/dashboard", icon: CreditCard },
    { name: "Transactions", href: "/merchant/transactions", icon: CreditCard },
    { name: "Analytics", href: "/merchant/analytics", icon: CreditCard },
    { name: "Customers", href: "/merchant/customers", icon: CreditCard },
    { name: "Payment Links", href: "/merchant/payment-links", icon: CreditCard },
    { name: "Settings", href: "/merchant/settings", icon: CreditCard },
  ]

  const handleSaveProfile = async () => {
    setLoading(true)
    if (!user) return

    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.full_name,
          phone: profileData.phone,
          address: profileData.address,
        })
        .eq('id', user.id)

      if (profileError) {
        throw profileError
      }

      // Update merchant table if company_name is changed
      if (user.role === "merchant" && profileData.company_name !== user.company_name) {
        const { error: merchantError } = await supabase
          .from('merchants')
          .update({ name: profileData.company_name })
          .eq('id', user.id) // Assuming merchant id is same as user id

        if (merchantError) {
          throw merchantError
        }
      }

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error: any) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: `Failed to update profile: ${error.message || "Unknown error"}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout navigation={navigation} title="Profile">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">My Profile</h2>
          <p className="text-muted-foreground">Manage your personal information and account details</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Overview */}
          <Card className="lg:col-span-1">
            <CardHeader className="text-center">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="text-lg">
                    {profileData.full_name
                      ? profileData.full_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                      : user?.email?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Change Photo
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <h3 className="text-xl font-semibold">{profileData.full_name || user?.email}</h3>
                <p className="text-muted-foreground">{user?.role === "merchant" ? "Merchant" : "User"}</p>
                <p className="text-sm text-muted-foreground">{profileData.company_name}</p>
                <Badge className="mt-2 bg-green-100 text-green-800">
                  {user?.role?.replace("_", " ").toUpperCase()}
                </Badge>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  {profileData.email}
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  {profileData.phone || 'N/A'}
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  {profileData.address || 'N/A'}
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  Member since {accountStats.memberSince ? new Date(accountStats.memberSince).toLocaleDateString() : 'N/A'}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Form */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={profileData.full_name}
                    onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    disabled // Email is from auth, not directly editable here
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={profileData.address}
                    onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                  />
                </div>
              </div>

              {user?.role === "merchant" && (
                <div className="space-y-2">
                  <Label htmlFor="company_name">Company Name</Label>
                  <Input
                    id="company_name"
                    value={profileData.company_name}
                    onChange={(e) => setProfileData({ ...profileData, company_name: e.target.value })}
                  />
                </div>
              )}

              <Button onClick={handleSaveProfile} disabled={loading} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Account Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Account Statistics</CardTitle>
            <CardDescription>Overview of your account performance and activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{accountStats.totalTransactions}</div>
                <div className="text-sm text-muted-foreground">Total Transactions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">${accountStats.totalRevenue.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Revenue</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{accountStats.activeCustomers}</div>
                <div className="text-sm text-muted-foreground">Active Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{accountStats.successRate}%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {accountStats.memberSince ? Math.floor((Date.now() - new Date(accountStats.memberSince).getTime()) / (1000 * 60 * 60 * 24)) : 'N/A'}
                </div>
                <div className="text-sm text-muted-foreground">Days Active</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
