"use client"

import { useState } from "react"
import { useApp } from "@/app/providers"
import { useTranslation } from "@/lib/translations"
import { lifestyleOptions } from "@/lib/mockData"
import { getNeighborhoodSuggestions } from "@/lib/neighborhoodSuggestions"
import type { SearchFilters } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Filter, X, MapPin } from "lucide-react"

interface FiltersPanelProps {
  filters: SearchFilters
  onFiltersChange: (filters: SearchFilters) => void
  isOpen: boolean
  onToggle: () => void
}

export function FiltersPanel({ filters, onFiltersChange, isOpen, onToggle }: FiltersPanelProps) {
  const { language } = useApp()
  const t = useTranslation(language)
  const [localFilters, setLocalFilters] = useState(filters)

  const suggestions = getNeighborhoodSuggestions(localFilters.lifestyle)

  const handleLifestyleToggle = (lifestyle: string) => {
    const newLifestyle = localFilters.lifestyle.includes(lifestyle)
      ? localFilters.lifestyle.filter((l) => l !== lifestyle)
      : [...localFilters.lifestyle, lifestyle]

    setLocalFilters((prev) => ({ ...prev, lifestyle: newLifestyle }))
  }

  const applyFilters = () => {
    onFiltersChange(localFilters)
    onToggle()
  }

  const clearFilters = () => {
    const clearedFilters: SearchFilters = {
      city: localFilters.city,
      priceRange: [0, 3000],
      sizeRange: [20, 200],
      rooms: [1, 5],
      lifestyle: [],
    }
    setLocalFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        variant="outline"
        className="fixed top-20 right-4 z-40 md:relative md:top-0 md:right-0 bg-transparent"
      >
        <Filter className="w-4 h-4 mr-2" />
        {t.filters}
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:relative md:bg-transparent md:inset-auto">
      <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-lg overflow-y-auto md:relative md:max-w-none md:shadow-none">
        <Card className="h-full rounded-none md:rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>{t.filters}</span>
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onToggle}>
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Price Range */}
            <div>
              <label className="text-sm font-medium mb-3 block">
                {t.price}: {t.euro}
                {localFilters.priceRange[0]} - {t.euro}
                {localFilters.priceRange[1]}
              </label>
              <Slider
                value={localFilters.priceRange}
                onValueChange={(value) =>
                  setLocalFilters((prev) => ({ ...prev, priceRange: value as [number, number] }))
                }
                max={3000}
                min={0}
                step={50}
                className="w-full"
              />
            </div>

            {/* Size Range */}
            <div>
              <label className="text-sm font-medium mb-3 block">
                {t.size}: {localFilters.sizeRange[0]}
                {t.sqm} - {localFilters.sizeRange[1]}
                {t.sqm}
              </label>
              <Slider
                value={localFilters.sizeRange}
                onValueChange={(value) =>
                  setLocalFilters((prev) => ({ ...prev, sizeRange: value as [number, number] }))
                }
                max={200}
                min={20}
                step={5}
                className="w-full"
              />
            </div>

            {/* Rooms */}
            <div>
              <label className="text-sm font-medium mb-3 block">
                {t.rooms}: {localFilters.rooms[0]} - {localFilters.rooms[1]}
              </label>
              <Slider
                value={localFilters.rooms}
                onValueChange={(value) => setLocalFilters((prev) => ({ ...prev, rooms: value as [number, number] }))}
                max={5}
                min={1}
                step={1}
                className="w-full"
              />
            </div>

            {/* Lifestyle Tags */}
            <div>
              <label className="text-sm font-medium mb-3 block">{t.lifestyle}</label>
              <div className="flex flex-wrap gap-2">
                {lifestyleOptions.map((lifestyle) => (
                  <Badge
                    key={lifestyle}
                    variant={localFilters.lifestyle.includes(lifestyle) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleLifestyleToggle(lifestyle)}
                  >
                    {t[lifestyle as keyof typeof t] || lifestyle}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Neighborhood Suggestions */}
            {suggestions.length > 0 && (
              <div>
                <label className="text-sm font-medium mb-3 block">Recommended Areas</label>
                <div className="space-y-2">
                  {suggestions.map((suggestion) => (
                    <div key={`${suggestion.city}-${suggestion.name}`} className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-sm">
                          {suggestion.name}, {suggestion.city}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {suggestion.score}% match
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600">{suggestion.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-2 pt-4 border-t">
              <Button onClick={applyFilters} className="flex-1">
                {t.apply}
              </Button>
              <Button onClick={clearFilters} variant="outline" className="flex-1 bg-transparent">
                {t.clear}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
