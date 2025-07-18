"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "./auth-context"
import { useToast } from "@/hooks/use-toast"

export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  timestamp: string
  read: boolean
  userId: string
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read" | "userId">) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  clearAll: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const { toast } = useToast()

  // Only load notifications if user is logged in
  useEffect(() => {
    if (user?.id) {
      loadNotifications()
      // Start polling for new notifications
      const interval = setInterval(loadNotifications, 30000) // Poll every 30 seconds
      return () => clearInterval(interval)
    } else {
      // Clear notifications when user logs out
      setNotifications([])
    }
  }, [user?.id])

  const loadNotifications = async () => {
    if (!user?.id) return

    try {
      const response = await fetch(`/api/notifications?userId=${user.id}`)
      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications || [])
      }
    } catch (error) {
      console.error("Failed to load notifications:", error)
      // Load mock notifications for demo
      setNotifications(getMockNotifications(user.id))
    }
  }

  const getMockNotifications = (userId: string): Notification[] => {
    const baseNotifications = [
      {
        id: "notif_001",
        title: "Welcome to SecurePay",
        message: "Your account has been successfully created and verified.",
        type: "success" as const,
        timestamp: new Date().toISOString(),
        read: false,
        userId,
      },
      {
        id: "notif_002",
        title: "Security Alert",
        message: "New login detected from a different device.",
        type: "warning" as const,
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: false,
        userId,
      },
    ]

    // Add role-specific notifications
    if (user?.role === "merchant") {
      baseNotifications.push({
        id: "notif_003",
        title: "Payment Received",
        message: "You received a payment of $150.00 from John Doe.",
        type: "success" as const,
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        read: true,
        userId,
      })
    } else if (user?.role === "bank_admin") {
      baseNotifications.push({
        id: "notif_004",
        title: "High Risk Transaction",
        message: "Transaction tx_123456 flagged for manual review.",
        type: "error" as const,
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        read: false,
        userId,
      })
    }

    return baseNotifications
  }

  const addNotification = (notification: Omit<Notification, "id" | "timestamp" | "read" | "userId">) => {
    if (!user?.id) return

    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
      userId: user.id,
    }

    setNotifications((prev) => [newNotification, ...prev.slice(0, 49)]) // Keep last 50
  }

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      })
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
    }

    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const markAllAsRead = async () => {
    if (!user?.id) return

    try {
      await fetch(`/api/notifications/batch`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "mark_all_read",
          userId: user.id,
        }),
      })
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error)
    }

    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
  }

  const removeNotification = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, {
        method: "DELETE",
      })
    } catch (error) {
      console.error("Failed to remove notification:", error)
    }

    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }

  const clearAll = async () => {
    if (!user?.id) return

    try {
      await fetch(`/api/notifications/batch`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      })
    } catch (error) {
      console.error("Failed to clear all notifications:", error)
    }

    setNotifications([])
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
