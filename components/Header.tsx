"use client"
import { useApp } from "@/app/providers"
import { useTranslation } from "@/lib/translations"
import { Button } from "@/components/ui/button"
import { Heart, Map, List, History, Globe, Bell } from "lucide-react"
import { NotificationCenter } from "./NotificationCenter"
import { useState } from "react"

interface HeaderProps {
  currentView: "list" | "map" | "favorites" | "history"
  onViewChange: (view: "list" | "map" | "favorites" | "history") => void
}

export function Header({ currentView, onViewChange }: HeaderProps) {
  const { language, setLanguage, favorites, activity } = useApp()
  const t = useTranslation(language)
  const [showNotifications, setShowNotifications] = useState(false)

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-blue-600">WohnFinder</h1>
          </div>

          <nav className="hidden md:flex items-center space-x-4">
            <Button
              variant={currentView === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewChange("list")}
              className="flex items-center space-x-2"
            >
              <List className="w-4 h-4" />
              <span>{t.list}</span>
            </Button>

            <Button
              variant={currentView === "map" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewChange("map")}
              className="flex items-center space-x-2"
            >
              <Map className="w-4 h-4" />
              <span>{t.map}</span>
            </Button>

            <Button
              variant={currentView === "favorites" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewChange("favorites")}
              className="flex items-center space-x-2 relative"
            >
              <Heart className="w-4 h-4" />
              <span>{t.favorites}</span>
              {favorites.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Button>

            <Button
              variant={currentView === "history" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewChange("history")}
              className="flex items-center space-x-2 relative"
            >
              <History className="w-4 h-4" />
              <span>{t.history}</span>
              {activity.viewed.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {activity.viewed.length}
                </span>
              )}
            </Button>
          </nav>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === "en" ? "de" : "en")}
              className="flex items-center space-x-2"
            >
              <Globe className="w-4 h-4" />
              <span className="uppercase font-medium">{language}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNotifications(true)}
              className="flex items-center space-x-2 relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t bg-white">
        <div className="flex justify-around py-2">
          <Button
            variant={currentView === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewChange("list")}
            className="flex flex-col items-center space-y-1 h-auto py-2"
          >
            <List className="w-4 h-4" />
            <span className="text-xs">{t.list}</span>
          </Button>

          <Button
            variant={currentView === "map" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewChange("map")}
            className="flex flex-col items-center space-y-1 h-auto py-2"
          >
            <Map className="w-4 h-4" />
            <span className="text-xs">{t.map}</span>
          </Button>

          <Button
            variant={currentView === "favorites" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewChange("favorites")}
            className="flex flex-col items-center space-y-1 h-auto py-2 relative"
          >
            <Heart className="w-4 h-4" />
            <span className="text-xs">{t.favorites}</span>
            {favorites.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </Button>

          <Button
            variant={currentView === "history" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewChange("history")}
            className="flex flex-col items-center space-y-1 h-auto py-2 relative"
          >
            <History className="w-4 h-4" />
            <span className="text-xs">{t.history}</span>
            {activity.viewed.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {activity.viewed.length}
              </span>
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowNotifications(true)}
            className="flex flex-col items-center space-y-1 h-auto py-2 relative"
          >
            <Bell className="w-4 h-4" />
            <span className="text-xs">Notifications</span>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              3
            </span>
          </Button>
        </div>
      </div>

      <NotificationCenter isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
    </header>
  )
}
