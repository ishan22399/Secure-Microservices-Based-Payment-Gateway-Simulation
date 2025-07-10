"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"

export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  timestamp: Date
  read: boolean
  userId?: string
  role?: string
}

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void
  markAsRead: (id: string) => void
  clearAll: () => void
  unreadCount: number
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const { toast } = useToast()

  useEffect(() => {
    // Simulate real-time notifications
    const interval = setInterval(() => {
      const randomNotifications = [
        {
          title: "New Transaction",
          message: "Payment of $299.99 processed successfully",
          type: "success" as const,
        },
        {
          title: "Security Alert",
          message: "Unusual login attempt detected",
          type: "warning" as const,
        },
        {
          title: "System Update",
          message: "Maintenance scheduled for tonight",
          type: "info" as const,
        },
      ]

      if (Math.random() > 0.7) {
        const notification = randomNotifications[Math.floor(Math.random() * randomNotifications.length)]
        addNotification(notification)
      }
    }, 30000) // Every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const addNotification = (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    }

    setNotifications((prev) => [newNotification, ...prev.slice(0, 49)]) // Keep last 50

    // Show toast
    toast({
      title: notification.title,
      description: notification.message,
      variant: notification.type === "error" ? "destructive" : "default",
    })
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const clearAll = () => {
    setNotifications([])
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        clearAll,
        unreadCount,
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
