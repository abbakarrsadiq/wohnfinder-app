"use client"

import { useMemo } from "react"
import { useApp } from "@/app/providers"
import { useTranslation } from "@/lib/translations"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart3, TrendingUp, MapPin, Clock, Heart, Eye, MessageSquare, Home } from "lucide-react"

export function AdvancedAnalytics() {
  const { language, apartments, activity, favorites } = useApp()
  const t = useTranslation(language)

  const analytics = useMemo(() => {
    // Price distribution
    const priceRanges = {
      "0-500": apartments.filter((apt) => apt.price <= 500).length,
      "501-1000": apartments.filter((apt) => apt.price > 500 && apt.price <= 1000).length,
      "1001-1500": apartments.filter((apt) => apt.price > 1000 && apt.price <= 1500).length,
      "1501-2000": apartments.filter((apt) => apt.price > 1500 && apt.price <= 2000).length,
      "2000+": apartments.filter((apt) => apt.price > 2000).length,
    }

    // City distribution
    const cityDistribution = apartments.reduce(
      (acc, apt) => {
        acc[apt.city] = (acc[apt.city] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    // Size distribution
    const sizeRanges = {
      "Small (< 50m²)": apartments.filter((apt) => apt.size < 50).length,
      "Medium (50-80m²)": apartments.filter((apt) => apt.size >= 50 && apt.size <= 80).length,
      "Large (80-120m²)": apartments.filter((apt) => apt.size > 80 && apt.size <= 120).length,
      "Extra Large (> 120m²)": apartments.filter((apt) => apt.size > 120).length,
    }

    // Lifestyle preferences
    const lifestyleStats = apartments.reduce(
      (acc, apt) => {
        apt.lifestyleTags.forEach((tag) => {
          acc[tag] = (acc[tag] || 0) + 1
        })
        return acc
      },
      {} as Record<string, number>,
    )

    // User behavior analytics
    const viewedCities = activity.viewed.reduce(
      (acc, item) => {
        acc[item.apartment.city] = (acc[item.apartment.city] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const averagePrice = apartments.reduce((sum, apt) => sum + apt.price, 0) / apartments.length
    const averageSize = apartments.reduce((sum, apt) => sum + apt.size, 0) / apartments.length
    const availabilityRate = (apartments.filter((apt) => apt.available).length / apartments.length) * 100

    return {
      priceRanges,
      cityDistribution,
      sizeRanges,
      lifestyleStats,
      viewedCities,
      averagePrice: Math.round(averagePrice),
      averageSize: Math.round(averageSize),
      availabilityRate: Math.round(availabilityRate),
      totalApartments: apartments.length,
      totalViewed: activity.viewed.length,
      totalContacted: activity.contacted.length,
      totalFavorites: favorites.length,
    }
  }, [apartments, activity, favorites])

  const getTopEntries = (obj: Record<string, number>, limit = 5) => {
    return Object.entries(obj)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <BarChart3 className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold">Market Analytics</h2>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Home className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold">{analytics.totalApartments}</div>
            <div className="text-sm text-gray-600">Total Listings</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold">€{analytics.averagePrice}</div>
            <div className="text-sm text-gray-600">Average Price</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Home className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold">{analytics.averageSize}m²</div>
            <div className="text-sm text-gray-600">Average Size</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 mx-auto mb-2 text-orange-600" />
            <div className="text-2xl font-bold">{analytics.availabilityRate}%</div>
            <div className="text-sm text-gray-600">Available Now</div>
          </CardContent>
        </Card>
      </div>

      {/* User Activity */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Eye className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold">{analytics.totalViewed}</div>
            <div className="text-sm text-gray-600">Apartments Viewed</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Heart className="w-8 h-8 mx-auto mb-2 text-red-600" />
            <div className="text-2xl font-bold">{analytics.totalFavorites}</div>
            <div className="text-sm text-gray-600">Favorites</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold">{analytics.totalContacted}</div>
            <div className="text-sm text-gray-600">Inquiries Sent</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Price Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Price Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(analytics.priceRanges).map(([range, count]) => {
              const percentage = (count / analytics.totalApartments) * 100
              return (
                <div key={range} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">€{range}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{count} apartments</span>
                      <Badge variant="outline">{percentage.toFixed(1)}%</Badge>
                    </div>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* City Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Top Cities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {getTopEntries(analytics.cityDistribution).map(([city, count]) => {
              const percentage = (count / analytics.totalApartments) * 100
              return (
                <div key={city} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium">{city}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{count} listings</span>
                      <Badge variant="outline">{percentage.toFixed(1)}%</Badge>
                    </div>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Size Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Size Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(analytics.sizeRanges).map(([range, count]) => {
              const percentage = (count / analytics.totalApartments) * 100
              return (
                <div key={range} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{range}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{count} apartments</span>
                      <Badge variant="outline">{percentage.toFixed(1)}%</Badge>
                    </div>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Popular Lifestyle Tags */}
        <Card>
          <CardHeader>
            <CardTitle>Popular Lifestyle Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {getTopEntries(analytics.lifestyleStats).map(([tag, count]) => {
              const percentage = (count / analytics.totalApartments) * 100
              return (
                <div key={tag} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{t[tag as keyof typeof t] || tag}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{count} apartments</span>
                      <Badge variant="outline">{percentage.toFixed(1)}%</Badge>
                    </div>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* User Viewing Patterns */}
      {analytics.totalViewed > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Viewing Patterns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Most Viewed Cities</h4>
                <div className="space-y-2">
                  {getTopEntries(analytics.viewedCities, 3).map(([city, count]) => {
                    const percentage = (count / analytics.totalViewed) * 100
                    return (
                      <div key={city} className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">{city}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">{count} views</span>
                          <Badge variant="secondary">{percentage.toFixed(1)}%</Badge>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
