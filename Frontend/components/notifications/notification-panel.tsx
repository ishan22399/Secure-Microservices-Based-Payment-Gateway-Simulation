"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useNotifications } from "@/contexts/notification-context"
import { Bell, CheckCircle, AlertTriangle, Info, X, Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface NotificationPanelProps {
  open: boolean
  onClose: () => void
}

export default function NotificationPanel({ open, onClose }: NotificationPanelProps) {
  const { notifications, markAsRead, clearAll, unreadCount } = useNotifications()

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Info className="h-4 w-4 text-blue-600" />
    }
  }

  const getNotificationBg = (type: string, read: boolean) => {
    const opacity = read ? "50" : "100"
    switch (type) {
      case "success":
        return `bg-green-${opacity} border-green-200`
      case "warning":
        return `bg-yellow-${opacity} border-yellow-200`
      case "error":
        return `bg-red-${opacity} border-red-200`
      default:
        return `bg-blue-${opacity} border-blue-200`
    }
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-96">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Notifications</span>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="bg-red-100 text-red-800">
                  {unreadCount}
                </Badge>
              )}
            </SheetTitle>
            {notifications.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAll}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </SheetHeader>

        <ScrollArea className="h-full mt-6">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <Bell className="h-12 w-12 mb-4 opacity-50" />
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border ${getNotificationBg(notification.type, notification.read)} ${
                    !notification.read ? "shadow-sm" : ""
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                          </p>
                        </div>
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="ml-2 h-6 w-6 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
