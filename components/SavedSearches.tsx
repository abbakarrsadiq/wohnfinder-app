"use client"

import { useState } from "react"
import { useApp } from "@/app/providers"
import { useTranslation } from "@/lib/translations"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import type { SearchFilters } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { Save, Search, Trash2, Bell, BellOff, Plus, X } from "lucide-react"
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose
} from "@/components/ui/drawer"

interface SavedSearch {
  id: string
  name: string
  filters: SearchFilters
  notifications: boolean
  createdAt: number
  lastUsed: number
}

interface SavedSearchesProps {
  currentFilters: SearchFilters
  onLoadSearch: (filters: SearchFilters) => void
}

export function SavedSearches({ currentFilters, onLoadSearch }: SavedSearchesProps) {
  const [savedSearches, setSavedSearches] = useLocalStorage<SavedSearch[]>("wf-saved-searches", [])
  const [isCreating, setIsCreating] = useState(false)
  const [searchName, setSearchName] = useState("")
  const { language } = useApp()
  const t = useTranslation(language)

  const saveCurrentSearch = () => {
    if (!searchName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for your search",
        variant: "destructive",
      })
      return
    }

    const newSearch: SavedSearch = {
      id: Date.now().toString(),
      name: searchName.trim(),
      filters: currentFilters,
      notifications: false,
      createdAt: Date.now(),
      lastUsed: Date.now(),
    }

    setSavedSearches((prev) => [newSearch, ...prev])
    setSearchName("")
    setIsCreating(false)

    toast({
      title: "Search Saved",
      description: `"${newSearch.name}" has been saved to your searches`,
    })
  }

  const loadSearch = (search: SavedSearch) => {
    onLoadSearch(search.filters)
    setSavedSearches((prev) => prev.map((s) => (s.id === search.id ? { ...s, lastUsed: Date.now() } : s)))

    toast({
      title: "Search Loaded",
      description: `Applied filters from "${search.name}"`,
    })
  }

  const deleteSearch = (searchId: string) => {
    setSavedSearches((prev) => prev.filter((s) => s.id !== searchId))
    toast({
      title: "Search Deleted",
      description: "Saved search has been removed",
    })
  }

  const toggleNotifications = (searchId: string) => {
    setSavedSearches((prev) => prev.map((s) => (s.id === searchId ? { ...s, notifications: !s.notifications } : s)))
  }

  const getSearchSummary = (filters: SearchFilters) => {
    const parts = []
    if (filters.city) parts.push(filters.city)
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 3000) {
      parts.push(`€${filters.priceRange[0]}-${filters.priceRange[1]}`)
    }
    if (filters.sizeRange[0] > 20 || filters.sizeRange[1] < 200) {
      parts.push(`${filters.sizeRange[0]}-${filters.sizeRange[1]}m²`)
    }
    if (filters.rooms[0] > 1 || filters.rooms[1] < 5) {
      parts.push(`${filters.rooms[0]}-${filters.rooms[1]} rooms`)
    }
    if (filters.lifestyle.length > 0) {
      parts.push(`${filters.lifestyle.length} lifestyle tags`)
    }
    return parts.join(" • ") || "All apartments"
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return "Today"
    if (diffInDays === 1) return "Yesterday"
    if (diffInDays < 7) return `${diffInDays} days ago`
    return date.toLocaleDateString()
  }

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Saved Searches</span>
          <Badge variant="secondary">{savedSearches.length}</Badge>
        </Button>
      </DrawerTrigger>

      <DrawerContent className="bg-white w-[400px] p-4 overflow-y-auto">
        <DrawerHeader className="flex items-center justify-between">
          <DrawerTitle className="flex items-center space-x-2">
            <Save className="w-5 h-5" />
            <span>Saved Searches</span>
            <Badge variant="secondary">{savedSearches.length}</Badge>
          </DrawerTitle>
          <DrawerClose asChild>
            <Button variant="ghost" size="sm">
              <X className="w-4 h-4" />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <div className="space-y-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCreating(true)}
            className="flex items-center space-x-1 w-full"
          >
            <Plus className="w-4 h-4" />
            <span>Save Current</span>
          </Button>

          {isCreating && (
            <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Search Name</label>
                  <Input
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    placeholder="e.g., Berlin 2-bedroom apartments"
                    onKeyDown={(e) => e.key === "Enter" && saveCurrentSearch()}
                  />
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Current filters:</strong> {getSearchSummary(currentFilters)}
                </div>
                <div className="flex space-x-2">
                  <Button onClick={saveCurrentSearch} size="sm">
                    <Save className="w-4 h-4 mr-1" />
                    Save Search
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsCreating(false)
                      setSearchName("")
                    }}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {savedSearches.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Save className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No saved searches yet</p>
              <p className="text-sm">Save your current search to quickly access it later</p>
            </div>
          ) : (
            <div className="space-y-3">
              {savedSearches
                .sort((a, b) => b.lastUsed - a.lastUsed)
                .map((search) => (
                  <div key={search.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium">{search.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{getSearchSummary(search.filters)}</p>
                      </div>
                      <div className="flex items-center space-x-1 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleNotifications(search.id)}
                          className={`h-8 w-8 p-0 ${search.notifications ? "text-blue-600" : "text-gray-400"}`}
                        >
                          {search.notifications ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteSearch(search.id)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        Created {formatDate(search.createdAt)} • Last used {formatDate(search.lastUsed)}
                      </div>
                      <Button
                        onClick={() => loadSearch(search)}
                        size="sm"
                        variant="outline"
                        className="flex items-center space-x-1"
                      >
                        <Search className="w-4 h-4" />
                        <span>Load</span>
                      </Button>
                    </div>

                    {search.notifications && (
                      <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-700">
                        <Bell className="w-3 h-3 inline mr-1" />
                        You'll be notified of new apartments matching this search
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
