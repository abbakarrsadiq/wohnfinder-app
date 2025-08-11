"use client"

import { useApp } from "@/app/providers"
import { useTranslation } from "@/lib/translations"
import { ApartmentList } from "./ApartmentList"
import type { Apartment } from "@/types"

interface FavoritesViewProps {
  onViewDetails: (apartment: Apartment) => void
}

export function FavoritesView({ onViewDetails }: FavoritesViewProps) {
  const { language, favorites, apartments } = useApp()
  const t = useTranslation(language)

  const favoriteApartments = apartments.filter((apt) => favorites.includes(apt.id))

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
        <p className="text-gray-500">Start exploring apartments and add them to your favorites</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t.favorites}</h2>
        <span className="text-sm text-gray-600">{favorites.length} apartments</span>
      </div>
      <ApartmentList apartments={favoriteApartments} onViewDetails={onViewDetails} />
    </div>
  )
}
