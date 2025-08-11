"use client"

import { useEffect, useRef, useState } from "react"
import { useApp } from "@/app/providers"
import { useTranslation } from "@/lib/translations"
import type { Apartment } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Eye, Heart } from "lucide-react"

interface MapViewProps {
  apartments: Apartment[]
  onViewDetails: (apartment: Apartment) => void
}

export function MapView({ apartments, onViewDetails }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null)
  const [map, setMap] = useState<any>(null)
  const [L, setL] = useState<any>(null)
  const { language, favorites, toggleFavorite } = useApp()
  const t = useTranslation(language)

  useEffect(() => {
    const loadLeaflet = async () => {
      if (typeof window !== "undefined") {
        const leaflet = await import("leaflet")
        await import("leaflet/dist/leaflet.css")

        // Fix for default markers
        delete (leaflet.Icon.Default.prototype as any)._getIconUrl
        leaflet.Icon.Default.mergeOptions({
          iconRetinaUrl: "/map-marker.png",
          iconUrl: "/map-marker.png",
          shadowUrl: "/marker-shadow.png",
        })

        setL(leaflet)
      }
    }

    loadLeaflet()
  }, [])

  useEffect(() => {
    if (L && mapRef.current && !map) {
      const newMap = L.map(mapRef.current).setView([52.52, 13.405], 6)

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(newMap)

      setMap(newMap)
    }
  }, [L, map])

  useEffect(() => {
    if (map && L && apartments.length > 0) {
      // Clear existing markers
      map.eachLayer((layer: any) => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer)
        }
      })

      // Add apartment markers
      apartments.forEach((apartment) => {
        const marker = L.marker(apartment.coordinates)
          .addTo(map)
          .bindPopup(`
            <div class="p-2">
              <h3 class="font-semibold">${apartment.title}</h3>
              <p class="text-sm text-gray-600">${apartment.address}</p>
              <p class="font-bold text-blue-600">€${apartment.price}/month</p>
            </div>
          `)
          .on("click", () => {
            setSelectedApartment(apartment)
          })
      })

      // Fit map to show all apartments
      if (apartments.length > 0) {
        const group = new L.featureGroup(apartments.map((apt) => L.marker(apt.coordinates)))
        map.fitBounds(group.getBounds().pad(0.1))
      }
    }
  }, [map, L, apartments])

  if (!L) {
    return (
      <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">{t.loading}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-96 lg:h-[600px]">
      <div ref={mapRef} className="w-full h-full rounded-lg" />

      {selectedApartment && (
        <Card className="absolute bottom-4 left-4 right-4 z-[1000] max-w-sm mx-auto lg:max-w-md">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg line-clamp-1">{selectedApartment.title}</h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedApartment(null)} className="h-6 w-6 p-0">
                ×
              </Button>
            </div>

            <div className="flex items-center text-sm text-gray-600 mb-2">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="line-clamp-1">{selectedApartment.address}</span>
            </div>

            <div className="flex items-center justify-between mb-3">
              <div className="text-xl font-bold text-blue-600">
                {t.euro}
                {selectedApartment.price}
                {t.month}
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>
                  {selectedApartment.size}
                  {t.sqm}
                </span>
                <span>•</span>
                <span>
                  {selectedApartment.rooms} {t.rooms}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                onClick={() => onViewDetails(selectedApartment)}
                size="sm"
                className="flex-1 flex items-center justify-center space-x-1"
              >
                <Eye className="w-4 h-4" />
                <span>{t.viewDetails}</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleFavorite(selectedApartment.id)}
                className={`h-8 w-8 p-0 ${favorites.includes(selectedApartment.id) ? "text-red-500" : "text-gray-600"}`}
              >
                <Heart className={`w-4 h-4 ${favorites.includes(selectedApartment.id) ? "fill-current" : ""}`} />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
