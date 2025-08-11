"use client"

import { useState } from "react"
import { useApp } from "@/app/providers"
import { useTranslation } from "@/lib/translations"
import type { Apartment } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, MapPin, Home, Users, Eye, Play, BarChart3 } from "lucide-react"
import Image from "next/image"

interface ApartmentCardProps {
  apartment: Apartment
  onViewDetails: (apartment: Apartment) => void
  onStartTour?: (apartment: Apartment) => void
  onAddToComparison?: (apartment: Apartment) => void
}

export function ApartmentCard({ apartment, onViewDetails, onStartTour, onAddToComparison }: ApartmentCardProps) {
  const { language, favorites, toggleFavorite } = useApp()
  const t = useTranslation(language)
  const [imageError, setImageError] = useState(false)

  const isFavorite = favorites.includes(apartment.id)

  const handleViewDetails = () => {
    onViewDetails(apartment)
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="relative">
        <div className="aspect-video relative overflow-hidden">
          <Image
            src={imageError ? "/placeholder.svg?height=200&width=300&query=apartment" : apartment.images[0]}
            alt={apartment.title}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
          />
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => toggleFavorite(apartment.id)}
          className={`absolute top-2 right-2 h-8 w-8 p-0 ${
            isFavorite ? "text-red-500 bg-white/90" : "text-gray-600 bg-white/90"
          } hover:bg-white`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
        </Button>

        <div className="absolute bottom-2 left-2">
          <Badge variant={apartment.available ? "default" : "secondary"}>
            {apartment.available ? t.available : t.unavailable}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg line-clamp-1">{apartment.title}</h3>
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="line-clamp-1">{apartment.address}</span>
            </div>
          </div>

          <p className="text-sm text-gray-600 line-clamp-2">{apartment.description}</p>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Home className="w-4 h-4 mr-1 text-gray-500" />
                <span>
                  {apartment.size}
                  {t.sqm}
                </span>
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1 text-gray-500" />
                <span>
                  {apartment.rooms} {t.rooms}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {apartment.lifestyleTags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {t[tag as keyof typeof t] || tag}
              </Badge>
            ))}
            {apartment.lifestyleTags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{apartment.lifestyleTags.length - 3}
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <div className="text-xl font-bold text-blue-600">
              {t.euro}
              {apartment.price}
              {t.month}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={handleViewDetails}
                size="sm"
                className="flex-1 flex items-center justify-center space-x-1"
              >
                <Eye className="w-4 h-4" />
                <span>{t.viewDetails}</span>
              </Button>

              {onStartTour && (
                <Button
                  onClick={() => onStartTour(apartment)}
                  size="sm"
                  variant="outline"
                  className="flex items-center space-x-1"
                >
                  <Play className="w-4 h-4" />
                </Button>
              )}

              {onAddToComparison && (
                <Button
                  onClick={() => onAddToComparison(apartment)}
                  size="sm"
                  variant="outline"
                  className="flex items-center space-x-1"
                >
                  <BarChart3 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
