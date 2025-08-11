"use client"

import { useState } from "react"
import { useApp } from "@/app/providers"
import { useTranslation } from "@/lib/translations"
import type { Apartment } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Home, Users, MapPin, Euro, Calendar } from "lucide-react"
import Image from "next/image"

interface ComparisonToolProps {
  isOpen: boolean
  onClose: () => void
  onViewDetails: (apartment: Apartment) => void
}

export function ComparisonTool({ isOpen, onClose, onViewDetails }: ComparisonToolProps) {
  const [comparedApartments, setComparedApartments] = useState<Apartment[]>([])
  const { language, apartments, favorites } = useApp()
  const t = useTranslation(language)

  const addToComparison = (apartment: Apartment) => {
    if (comparedApartments.length < 3 && !comparedApartments.find((apt) => apt.id === apartment.id)) {
      setComparedApartments((prev) => [...prev, apartment])
    }
  }

  const removeFromComparison = (apartmentId: string) => {
    setComparedApartments((prev) => prev.filter((apt) => apt.id !== apartmentId))
  }

  const getComparisonScore = (apartment: Apartment) => {
    let score = 0
    const maxPrice = Math.max(...comparedApartments.map((apt) => apt.price))
    const maxSize = Math.max(...comparedApartments.map((apt) => apt.size))

    // Price score (lower is better)
    score += (1 - apartment.price / maxPrice) * 30

    // Size score (higher is better)
    score += (apartment.size / maxSize) * 25

    // Features score
    score += apartment.features.length * 5

    // Lifestyle tags score
    score += apartment.lifestyleTags.length * 3

    // Availability bonus
    if (apartment.available) score += 15

    // Favorite bonus
    if (favorites.includes(apartment.id)) score += 10

    return Math.round(score)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div className="min-h-screen px-4 py-8">
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-xl">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-bold">Apartment Comparison</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="p-6">
            {comparedApartments.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Plus className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No apartments to compare</h3>
                <p className="text-gray-500 mb-6">Add up to 3 apartments to compare their features</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
                  {apartments.slice(0, 6).map((apartment) => (
                    <Card key={apartment.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="aspect-video relative mb-3 rounded-lg overflow-hidden">
                          <Image
                            src={apartment.images[0] || "/placeholder.svg"}
                            alt={apartment.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <h4 className="font-medium mb-2 line-clamp-1">{apartment.title}</h4>
                        <p className="text-sm text-gray-600 mb-3">{apartment.city}</p>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-blue-600">€{apartment.price}/month</span>
                          <Button
                            size="sm"
                            onClick={() => addToComparison(apartment)}
                            disabled={comparedApartments.length >= 3}
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Comparison Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {comparedApartments.map((apartment) => (
                    <Card key={apartment.id} className="relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromComparison(apartment.id)}
                        className="absolute top-2 right-2 z-10 h-8 w-8 p-0 bg-white/90 hover:bg-white"
                      >
                        <X className="w-4 h-4" />
                      </Button>

                      <div className="aspect-video relative">
                        <Image
                          src={apartment.images[0] || "/placeholder.svg"}
                          alt={apartment.title}
                          fill
                          className="object-cover rounded-t-lg"
                        />
                        <div className="absolute top-2 left-2">
                          <Badge variant="secondary" className="bg-white/90">
                            Score: {getComparisonScore(apartment)}%
                          </Badge>
                        </div>
                      </div>

                      <CardContent className="p-4 space-y-4">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{apartment.title}</h3>
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span>{apartment.address}</span>
                          </div>
                        </div>

                        {/* Key Metrics */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <Euro className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                            <div className="font-bold text-blue-600">€{apartment.price}</div>
                            <div className="text-xs text-gray-600">per month</div>
                          </div>
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <Home className="w-5 h-5 mx-auto mb-1 text-green-600" />
                            <div className="font-bold text-green-600">{apartment.size}m²</div>
                            <div className="text-xs text-gray-600">living space</div>
                          </div>
                          <div className="text-center p-3 bg-purple-50 rounded-lg">
                            <Users className="w-5 h-5 mx-auto mb-1 text-purple-600" />
                            <div className="font-bold text-purple-600">{apartment.rooms}</div>
                            <div className="text-xs text-gray-600">rooms</div>
                          </div>
                          <div className="text-center p-3 bg-orange-50 rounded-lg">
                            <Calendar className="w-5 h-5 mx-auto mb-1 text-orange-600" />
                            <div className="font-bold text-orange-600">{apartment.available ? "Yes" : "No"}</div>
                            <div className="text-xs text-gray-600">available</div>
                          </div>
                        </div>

                        {/* Features */}
                        <div>
                          <h4 className="font-medium mb-2">Features</h4>
                          <div className="flex flex-wrap gap-1">
                            {apartment.features.slice(0, 4).map((feature) => (
                              <Badge key={feature} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                            {apartment.features.length > 4 && (
                              <Badge variant="outline" className="text-xs">
                                +{apartment.features.length - 4}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Lifestyle Tags */}
                        <div>
                          <h4 className="font-medium mb-2">Lifestyle</h4>
                          <div className="flex flex-wrap gap-1">
                            {apartment.lifestyleTags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {t[tag as keyof typeof t] || tag}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <Button onClick={() => onViewDetails(apartment)} className="w-full">
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Add More Card */}
                  {comparedApartments.length < 3 && (
                    <Card className="border-2 border-dashed border-gray-300 flex items-center justify-center min-h-[400px]">
                      <div className="text-center">
                        <Plus className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <h3 className="font-medium text-gray-600 mb-2">Add Another Apartment</h3>
                        <p className="text-sm text-gray-500">Compare up to 3 apartments</p>
                      </div>
                    </Card>
                  )}
                </div>

                {/* Comparison Summary */}
                {comparedApartments.length > 1 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Comparison Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <h4 className="font-medium mb-2 text-green-600">Best Value</h4>
                          {(() => {
                            const bestValue = comparedApartments.reduce((best, apt) =>
                              apt.size / apt.price > best.size / best.price ? apt : best,
                            )
                            return (
                              <div className="p-3 bg-green-50 rounded-lg">
                                <div className="font-medium">{bestValue.title}</div>
                                <div className="text-sm text-gray-600">
                                  {((bestValue.size / bestValue.price) * 1000).toFixed(1)} m²/€1000
                                </div>
                              </div>
                            )
                          })()}
                        </div>

                        <div>
                          <h4 className="font-medium mb-2 text-blue-600">Most Spacious</h4>
                          {(() => {
                            const mostSpacious = comparedApartments.reduce((best, apt) =>
                              apt.size > best.size ? apt : best,
                            )
                            return (
                              <div className="p-3 bg-blue-50 rounded-lg">
                                <div className="font-medium">{mostSpacious.title}</div>
                                <div className="text-sm text-gray-600">{mostSpacious.size}m²</div>
                              </div>
                            )
                          })()}
                        </div>

                        <div>
                          <h4 className="font-medium mb-2 text-purple-600">Most Features</h4>
                          {(() => {
                            const mostFeatures = comparedApartments.reduce((best, apt) =>
                              apt.features.length > best.features.length ? apt : best,
                            )
                            return (
                              <div className="p-3 bg-purple-50 rounded-lg">
                                <div className="font-medium">{mostFeatures.title}</div>
                                <div className="text-sm text-gray-600">{mostFeatures.features.length} features</div>
                              </div>
                            )
                          })()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
