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
import { CreditCard, Save, Upload, User, Mail, Phone, MapPin, Calendar, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase-client"
import { Database } from "@/types/supabase"

type Profile = Database['public']['Tables']['profiles']['Row']
type Transaction = Database['public']['Tables']['transactions']['Row']

export default function CustomerProfilePage() {
  const { user, isLoading } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [profileData, setProfileData] = useState<Partial<Profile>>({
    full_name: user?.full_name || "",
    email: user?.email || "",
    phone: "", // Assuming these are not in Supabase auth.users or profiles yet
    address: "",
    created_at: user?.created_at || "",
  })
  const [accountStats, setAccountStats] = useState({
    memberSince: "",
    totalTransactions: 0,
    totalSpent: 0,
    // favoriteCategories: [], // This would require more complex analytics
    loyaltyPoints: 0,
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
      .select('*')
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
        created_at: data.created_at || "",
      })
    }
  }

  const fetchAccountStats = async () => {
    if (!user) return

    // Fetch total transactions and total spent
    const { data: transactionsData, error: transactionsError } = await supabase
      .from('transactions')
      .select('amount, created_at')
      .eq('customer_id', user.id)

    if (transactionsError) {
      console.error("Error fetching transactions for stats:", transactionsError)
    } else {
      const totalSpent = transactionsData?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0
      const totalTransactions = transactionsData?.length || 0
      const memberSince = transactionsData && transactionsData.length > 0
        ? transactionsData.reduce((minDate, t) => {
            const currentTxnDate = new Date(t.created_at || '')
            const minTxnDate = new Date(minDate)
            return currentTxnDate < minTxnDate ? t.created_at : minDate
          }, transactionsData[0].created_at || '')
        : user.created_at // Fallback to user creation date

      setAccountStats({
        memberSince: memberSince ? new Date(memberSince).toISOString() : "",
        totalTransactions,
        totalSpent,
        loyaltyPoints: Math.floor(totalSpent / 10), // Example: 10 points per $1 spent
      })
    }
  }

  const navigation = [
    { name: "Dashboard", href: "/customer/dashboard", icon: CreditCard },
    { name: "Make Payment", href: "/customer/payment", icon: CreditCard },
    { name: "Transactions", href: "/customer/transactions", icon: CreditCard },
    { name: "Payment Methods", href: "/customer/payment-methods", icon: CreditCard },
    { name: "Profile", href: "/customer/profile", icon: User, current: true },
    { name: "Settings", href: "/customer/settings", icon: CreditCard },
  ]

  const handleSaveProfile = async () => {
    setLoading(true)
    if (!user) return

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.full_name,
          phone: profileData.phone,
          address: profileData.address,
          // Add other fields as needed
        })
        .eq('id', user.id)

      if (error) {
        throw error
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
    <DashboardLayout navigation={navigation} title="My Profile">
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
                <p className="text-muted-foreground">Valued Customer</p>
                <Badge className="mt-2 bg-blue-100 text-blue-800">{user?.role?.replace("_", " ").toUpperCase()}</Badge>
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
                <div className="flex items-center text-sm">
                  <Shield className="h-4 w-4 mr-2 text-muted-foreground" />
                  {accountStats.loyaltyPoints} Loyalty Points
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
            <CardTitle>Account Activity</CardTitle>
            <CardDescription>Overview of your account activity and preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{accountStats.totalTransactions}</div>
                <div className="text-sm text-muted-foreground">Total Transactions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">${accountStats.totalSpent.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Spent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{accountStats.loyaltyPoints}</div>
                <div className="text-sm text-muted-foreground">Loyalty Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {accountStats.memberSince ? Math.floor((Date.now() - new Date(accountStats.memberSince).getTime()) / (1000 * 60 * 60 * 24)) : 'N/A'}
                </div>
                <div className="text-sm text-muted-foreground">Days Active</div>
              </div>
            </div>

            {/* <div className="mt-6 pt-6 border-t">
              <h4 className="font-medium mb-3">Favorite Categories</h4>
              <div className="flex flex-wrap gap-2">
                {accountStats.favoriteCategories.map((category, index) => (
                  <Badge key={index} variant="secondary">
                    {category}
                  </Badge>
                ))}
              </div>
            </div> */}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
