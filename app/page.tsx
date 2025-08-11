"use client"

import { useState, useEffect } from "react"
import { useApp } from "./providers"
import { useTranslation } from "@/lib/translations"
import { useIndexedDB } from "@/hooks/useIndexedDB"
import { mockApartments } from "@/lib/mockData"
import type { Apartment, SearchFilters } from "@/types"
import { Header } from "@/components/Header"
import { SearchBar } from "@/components/SearchBar"
import { FiltersPanel } from "@/components/FiltersPanel"
import { ApartmentList } from "@/components/ApartmentList"
import { MapView } from "@/components/MapView"
import { FavoritesView } from "@/components/FavoritesView"
import { HistoryView } from "@/components/HistoryView"
import { ApartmentDetail } from "@/components/ApartmentDetail"
import { Toaster } from "@/components/ui/toaster"
import { ComparisonTool } from "@/components/ComparisonTool"
import { SavedSearches } from "@/components/SavedSearches"
import { AdvancedAnalytics } from "@/components/AdvancedAnalytics"
import { VirtualTour } from "@/components/VirtualTour"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { PerformanceMonitor } from "@/components/PerformanceMonitor"

export default function Home() {
  const [currentView, setCurrentView] = useState<"list" | "map" | "favorites" | "history" | "analytics">("list")
  const [filteredApartments, setFilteredApartments] = useState<Apartment[]>([])
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null)
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    city: "",
    priceRange: [0, 3000],
    sizeRange: [20, 200],
    rooms: [1, 5],
    lifestyle: [],
  })
  const [showComparison, setShowComparison] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showVirtualTour, setShowVirtualTour] = useState(false)
  const [tourApartment, setTourApartment] = useState<Apartment | null>(null)
  const [error, setError] = useState<string | null>(null)

  const { language, apartments, setApartments } = useApp()
  const t = useTranslation(language)
  const { saveData } = useIndexedDB("wohnfinder", 1)

  // Initialize apartments data
  useEffect(() => {
    try {
      if (apartments.length === 0) {
        setApartments(mockApartments)
        saveData("apartments", mockApartments).catch(console.warn)
      }
      setFilteredApartments(apartments)
    } catch (err) {
      setError("Failed to load apartments")
      console.error(err)
    }
  }, [apartments, setApartments, saveData])

  // Filter apartments based on current filters
  useEffect(() => {
    const filterApartments = () => {
      setIsLoading(true)

      setTimeout(() => {
        let filtered = apartments

        if (filters.city) {
          filtered = filtered.filter((apt) => apt.city.toLowerCase().includes(filters.city.toLowerCase()))
        }

        filtered = filtered.filter(
          (apt) =>
            apt.price >= filters.priceRange[0] &&
            apt.price <= filters.priceRange[1] &&
            apt.size >= filters.sizeRange[0] &&
            apt.size <= filters.sizeRange[1] &&
            apt.rooms >= filters.rooms[0] &&
            apt.rooms <= filters.rooms[1],
        )

        if (filters.lifestyle.length > 0) {
          filtered = filtered.filter((apt) => filters.lifestyle.some((tag) => apt.lifestyleTags.includes(tag)))
        }

        setFilteredApartments(filtered)
        setIsLoading(false)
      }, 300)
    }

    filterApartments()
  }, [filters, apartments])

  const handleCitySelect = (city: string) => {
    setFilters((prev) => ({ ...prev, city }))
  }

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters)
  }

  const handleViewDetails = (apartment: Apartment) => {
    setSelectedApartment(apartment)
  }

  const renderCurrentView = () => {
    if (error) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Reload Page</Button>
          </div>
        </div>
      )
    }

    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">{t.loading}</p>
          </div>
        </div>
      )
    }

    switch (currentView) {
      case "map":
        return <MapView apartments={filteredApartments} onViewDetails={handleViewDetails} />
      case "favorites":
        return <FavoritesView onViewDetails={handleViewDetails} />
      case "history":
        return <HistoryView onViewDetails={handleViewDetails} />
      case "analytics":
        return <AdvancedAnalytics />
      default:
        return (
          <ApartmentList
            apartments={filteredApartments}
            onViewDetails={handleViewDetails}
            onStartTour={(apartment) => {
              setTourApartment(apartment)
              setShowVirtualTour(true)
            }}
            onAddToComparison={(apartment) => {
              setShowComparison(true)
            }}
          />
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentView={currentView} onViewChange={setCurrentView} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search and Filters */}
        {(currentView === "list" || currentView === "map") && (
          <div className="mb-6 space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <SearchBar onCitySelect={handleCitySelect} selectedCity={filters.city} />
              <FiltersPanel
                filters={filters}
                onFiltersChange={handleFiltersChange}
                isOpen={isFiltersOpen}
                onToggle={() => setIsFiltersOpen(!isFiltersOpen)}
              />
              <SavedSearches currentFilters={filters} onLoadSearch={handleFiltersChange} />
            </div>

            {/* Results Summary */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                {filteredApartments.length} {filteredApartments.length === 1 ? "apartment" : "apartments"} found
                {filters.city && ` in ${filters.city}`}
              </span>
            </div>
          </div>
        )}

        {/* Main Content */}
        {renderCurrentView()}

        {/* Advanced Components */}
        <ComparisonTool
          isOpen={showComparison}
          onClose={() => setShowComparison(false)}
          onViewDetails={handleViewDetails}
        />

        {showAnalytics && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
            <div className="min-h-screen px-4 py-8">
              <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
                  <Button variant="ghost" size="sm" onClick={() => setShowAnalytics(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <AdvancedAnalytics />
              </div>
            </div>
          </div>
        )}

        {tourApartment && (
          <VirtualTour
            apartment={tourApartment}
            isOpen={showVirtualTour}
            onClose={() => {
              setShowVirtualTour(false)
              setTourApartment(null)
            }}
          />
        )}
      </main>

      {/* Apartment Detail Modal */}
      {selectedApartment && (
        <ApartmentDetail apartment={selectedApartment} onClose={() => setSelectedApartment(null)} />
      )}

      <Toaster />
      {/* <PerformanceMonitor /> */}
    </div>
  )
}
