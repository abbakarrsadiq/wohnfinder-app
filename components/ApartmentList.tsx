"use client"

import { useState } from "react"
import { useApp } from "@/app/providers"
import { useTranslation } from "@/lib/translations"
import type { Apartment } from "@/types"
import { ApartmentCard } from "./ApartmentCard"
import { Button } from "@/components/ui/button"

interface ApartmentListProps {
  apartments: Apartment[]
  onViewDetails: (apartment: Apartment) => void
  onStartTour?: (apartment: Apartment) => void
  onAddToComparison?: (apartment: Apartment) => void
}

export function ApartmentList({ apartments, onViewDetails, onStartTour, onAddToComparison }: ApartmentListProps) {
  const { language } = useApp()
  const t = useTranslation(language)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const totalItems = apartments.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const startIndex = (currentPage - 1) * itemsPerPage
  const currentItems = apartments.slice(startIndex, startIndex + itemsPerPage)

  if (totalItems === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 8v-2a1 1 0 011-1h2a1 1 0 011 1v2m-4 0h4"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{t.noResults}</h3>
        <p className="text-gray-500">Try adjusting your search criteria or filters</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Count */}
      <div className="text-sm text-gray-600">
        Showing {startIndex + 1}–{Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} results
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentItems.map((apartment) => (
          <ApartmentCard
            key={apartment.id}
            apartment={apartment}
            onViewDetails={onViewDetails}
            onStartTour={onStartTour}
            onAddToComparison={onAddToComparison}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Previous
        </Button>
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
