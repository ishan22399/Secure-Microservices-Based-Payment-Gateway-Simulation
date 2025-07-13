"use client"

import { useState } from "react"
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

export default function CustomerProfilePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [profileData, setProfileData] = useState({
    name: user?.name || "John Customer",
    email: user?.email || "john@customer.com",
    phone: "+1-555-0123",
    address: "123 Main St, New York, NY 10001",
    dateOfBirth: "1990-01-15",
    bio: "Regular customer who enjoys online shopping and digital services.",
    timezone: "America/New_York",
  })

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
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const accountStats = {
    memberSince: "2023-06-15",
    totalTransactions: 45,
    totalSpent: 2450.0,
    favoriteCategories: ["Electronics", "Books", "Clothing"],
    loyaltyPoints: 1250,
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
                    {profileData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
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
                <h3 className="text-xl font-semibold">{profileData.name}</h3>
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
                  {profileData.phone}
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  {profileData.address}
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  Member since {new Date(accountStats.memberSince).toLocaleDateString()}
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
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
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
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={profileData.dateOfBirth}
                    onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={profileData.address}
                  onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Input
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                />
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
                  {Math.floor((Date.now() - new Date(accountStats.memberSince).getTime()) / (1000 * 60 * 60 * 24))}
                </div>
                <div className="text-sm text-muted-foreground">Days Active</div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <h4 className="font-medium mb-3">Favorite Categories</h4>
              <div className="flex flex-wrap gap-2">
                {accountStats.favoriteCategories.map((category, index) => (
                  <Badge key={index} variant="secondary">
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
