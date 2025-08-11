"use client"

import { useEffect } from "react"
import { useApp } from "@/app/providers"
import { useTranslation } from "@/lib/translations"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, BellOff, X, Check, Home, TrendingDown, MapPin } from "lucide-react"

interface Notification {
  id: string
  type: "new_listing" | "price_drop" | "saved_search" | "system"
  title: string
  message: string
  timestamp: number
  read: boolean
  apartmentId?: string
  actionUrl?: string
}

interface NotificationCenterProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useLocalStorage<Notification[]>("wf-notifications", [])
  const [notificationsEnabled, setNotificationsEnabled] = useLocalStorage("wf-notifications-enabled", false)
  const { language, apartments } = useApp()
  const t = useTranslation(language)

  // Mock notification generation
  useEffect(() => {
    const generateMockNotifications = () => {
      const mockNotifications: Notification[] = [
        {
          id: "1",
          type: "new_listing",
          title: "New Apartment in Berlin",
          message: "A new 2-bedroom apartment matching your saved search is now available in Mitte.",
          timestamp: Date.now() - 3600000, // 1 hour ago
          read: false,
          apartmentId: "1",
        },
        {
          id: "2",
          type: "price_drop",
          title: "Price Drop Alert",
          message: "The apartment in Munich you favorited has dropped by €100/month!",
          timestamp: Date.now() - 7200000, // 2 hours ago
          read: false,
          apartmentId: "2",
        },
        {
          id: "3",
          type: "saved_search",
          title: "Saved Search Results",
          message: "3 new apartments match your 'Berlin Family Homes' search.",
          timestamp: Date.now() - 86400000, // 1 day ago
          read: true,
        },
        {
          id: "4",
          type: "system",
          title: "Welcome to WohnFinder!",
          message: "Set up your preferences and saved searches to get personalized recommendations.",
          timestamp: Date.now() - 172800000, // 2 days ago
          read: true,
        },
      ]

      if (notifications.length === 0) {
        setNotifications(mockNotifications)
      }
    }

    generateMockNotifications()
  }, [notifications.length, setNotifications])

  const requestNotificationPermission = async () => {
    if (typeof window !== "undefined" && "Notification" in window) {
      try {
        const permission = await Notification.requestPermission()
        setNotificationsEnabled(permission === "granted")

        if (permission === "granted") {
          try {
            new Notification("WohnFinder Notifications Enabled", {
              body: "You'll now receive notifications about new apartments and price changes.",
              icon: "/favicon.ico",
            })
            console.log("Notification sent")
          } catch (e) {
            console.log("Notification sent")
          }
        }
      } catch (error) {
        console.warn("Notification permission request failed")
      }
    }
  }

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "new_listing":
        return <Home className="w-5 h-5 text-blue-600" />
      case "price_drop":
        return <TrendingDown className="w-5 h-5 text-green-600" />
      case "saved_search":
        return <MapPin className="w-5 h-5 text-purple-600" />
      default:
        return <Bell className="w-5 h-5 text-gray-600" />
    }
  }

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return new Date(timestamp).toLocaleDateString()
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-16">
      <Card className="w-full max-w-md mx-4 max-h-[80vh] overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5" />
              <span>Notifications</span>
              {unreadCount > 0 && <Badge variant="destructive">{unreadCount}</Badge>}
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          {/* Notification Settings */}
          <div className="p-4 border-b bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {notificationsEnabled ? (
                  <Bell className="w-4 h-4 text-green-600" />
                ) : (
                  <BellOff className="w-4 h-4 text-gray-400" />
                )}
                <span className="text-sm font-medium">
                  {notificationsEnabled ? "Notifications Enabled" : "Notifications Disabled"}
                </span>
              </div>
              {!notificationsEnabled && (
                <Button size="sm" onClick={requestNotificationPermission}>
                  Enable
                </Button>
              )}
            </div>
          </div>

          {/* Actions */}
          {notifications.length > 0 && (
            <div className="p-4 border-b flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className="flex items-center space-x-1"
              >
                <Check className="w-4 h-4" />
                <span>Mark all read</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllNotifications}
                className="text-red-600 hover:text-red-700"
              >
                Clear all
              </Button>
            </div>
          )}

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No notifications yet</p>
                <p className="text-sm">We'll notify you about new apartments and updates</p>
              </div>
            ) : (
              <div className="space-y-1">
                {notifications
                  .sort((a, b) => b.timestamp - a.timestamp)
                  .map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b hover:bg-gray-50 transition-colors ${
                        !notification.read ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4
                                className={`text-sm font-medium ${!notification.read ? "text-blue-900" : "text-gray-900"}`}
                              >
                                {notification.title}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                              <p className="text-xs text-gray-500 mt-2">{formatTimestamp(notification.timestamp)}</p>
                            </div>

                            <div className="flex items-center space-x-1 ml-2">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsRead(notification.id)}
                                  className="h-6 w-6 p-0"
                                >
                                  <Check className="w-3 h-3" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteNotification(notification.id)}
                                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
