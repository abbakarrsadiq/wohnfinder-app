"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { useIndexedDB } from "@/hooks/useIndexedDB"
import type { Apartment, UserPreferences, UserActivity } from "@/types"

interface AppContextType {
  language: "en" | "de"
  setLanguage: (lang: "en" | "de") => void
  preferences: UserPreferences
  setPreferences: (prefs: UserPreferences) => void
  favorites: string[]
  toggleFavorite: (id: string) => void
  activity: UserActivity
  addToViewed: (apartment: Apartment) => void
  addToContacted: (apartmentId: string) => void
  apartments: Apartment[]
  setApartments: (apartments: Apartment[]) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within Providers")
  }
  return context
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useLocalStorage<"en" | "de">("wf-language", "en")
  const [preferences, setPreferences] = useLocalStorage<UserPreferences>("wf-preferences", {
    priceRange: [0, 3000],
    sizeRange: [20, 200],
    rooms: [1, 5],
    lifestyle: [],
  })
  const [favorites, setFavorites] = useLocalStorage<string[]>("wf-favorites", [])
  const [activity, setActivity] = useLocalStorage<UserActivity>("wf-activity", {
    viewed: [],
    contacted: [],
  })
  const [apartments, setApartments] = useState<Apartment[]>([])

  const { saveData, loadData } = useIndexedDB("wohnfinder", 1)

  useEffect(() => {
    loadData("apartments").then((data) => {
      if (data && Array.isArray(data)) {
        setApartments(data)
      }
    })
  }, [loadData])

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]))
  }

  const addToViewed = (apartment: Apartment) => {
    const viewedItem = {
      apartment,
      timestamp: Date.now(),
    }
    setActivity((prev) => ({
      ...prev,
      viewed: [viewedItem, ...prev.viewed.filter((v) => v.apartment.id !== apartment.id)].slice(0, 50),
    }))
  }

  const addToContacted = (apartmentId: string) => {
    const contactedItem = {
      apartmentId,
      timestamp: Date.now(),
    }
    setActivity((prev) => ({
      ...prev,
      contacted: [contactedItem, ...prev.contacted.filter((c) => c.apartmentId !== apartmentId)].slice(0, 50),
    }))
  }

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        preferences,
        setPreferences,
        favorites,
        toggleFavorite,
        activity,
        addToViewed,
        addToContacted,
        apartments,
        setApartments,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
