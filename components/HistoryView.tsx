"use client"

import { useApp } from "@/app/providers"
import { useTranslation } from "@/lib/translations"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, MessageSquare, Clock, MapPin } from "lucide-react"
import type { Apartment } from "@/types"
import Image from "next/image"

interface HistoryViewProps {
  onViewDetails: (apartment: Apartment) => void
}

export function HistoryView({ onViewDetails }: HistoryViewProps) {
  const { language, activity, apartments } = useApp()
  const t = useTranslation(language)

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return "Yesterday"
    return date.toLocaleDateString()
  }

  const getContactedApartment = (apartmentId: string) => {
    return apartments.find((apt) => apt.id === apartmentId)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t.history}</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recently Viewed */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="w-5 h-5" />
              <span>{t.viewed}</span>
              <Badge variant="secondary">{activity.viewed.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activity.viewed.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No apartments viewed yet</p>
            ) : (
              activity.viewed.slice(0, 10).map((item) => (
                <div
                  key={`${item.apartment.id}-${item.timestamp}`}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                  onClick={() => onViewDetails(item.apartment)}
                >
                  <div className="w-16 h-16 relative rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.apartment.images[0] || "/placeholder.svg"}
                      alt={item.apartment.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium line-clamp-1">{item.apartment.title}</h4>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span className="line-clamp-1">{item.apartment.city}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-semibold text-blue-600">
                        {t.euro}
                        {item.apartment.price}
                        {t.month}
                      </span>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatDate(item.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Contacted */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5" />
              <span>{t.contacted}</span>
              <Badge variant="secondary">{activity.contacted.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activity.contacted.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No inquiries sent yet</p>
            ) : (
              activity.contacted.slice(0, 10).map((item) => {
                const apartment = getContactedApartment(item.apartmentId)
                if (!apartment) return null

                return (
                  <div
                    key={`${item.apartmentId}-${item.timestamp}`}
                    className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 cursor-pointer transition-colors"
                    onClick={() => onViewDetails(apartment)}
                  >
                    <div className="w-16 h-16 relative rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={apartment.images[0] || "/placeholder.svg"}
                        alt={apartment.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium line-clamp-1">{apartment.title}</h4>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span className="line-clamp-1">{apartment.city}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-semibold text-blue-600">
                          {t.euro}
                          {apartment.price}
                          {t.month}
                        </span>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatDate(item.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
