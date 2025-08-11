"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useApp } from "@/app/providers"
import { useTranslation } from "@/lib/translations"
import type { Apartment } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { X, Heart, MapPin, Home, Users, Calendar, ChevronLeft, ChevronRight, Send } from "lucide-react"
import Image from "next/image"

interface ApartmentDetailProps {
  apartment: Apartment
  onClose: () => void
}

export function ApartmentDetail({ apartment, onClose }: ApartmentDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showInquiryForm, setShowInquiryForm] = useState(false)
  const [inquiryForm, setInquiryForm] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { language, favorites, toggleFavorite, addToViewed, addToContacted } = useApp()
  const t = useTranslation(language)
  const isFavorite = favorites.includes(apartment.id)

  useEffect(() => {
    addToViewed(apartment)
  }, [apartment, addToViewed])

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === apartment.images.length - 1 ? 0 : prev + 1))
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? apartment.images.length - 1 : prev - 1))
  }

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    addToContacted(apartment.id)
    setIsSubmitting(false)
    setShowInquiryForm(false)
    setInquiryForm({ name: "", email: "", message: "" })

    try {
      toast({
        title: t.inquirySent,
        description: "We'll get back to you soon!",
      })
    } catch (error) {
      console.log("Toast notification sent")
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div className="min-h-screen px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h1 className="text-2xl font-bold">{apartment.title}</h1>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleFavorite(apartment.id)}
                className={isFavorite ? "text-red-500" : "text-gray-600"}
              >
                <Heart className={`w-4 h-4 mr-2 ${isFavorite ? "fill-current" : ""}`} />
                {isFavorite ? t.removeFromFavorites : t.addToFavorites}
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <Image
                  src={apartment.images[currentImageIndex] || "/placeholder.svg"}
                  alt={`${apartment.title} - Image ${currentImageIndex + 1}`}
                  fill
                  className="object-cover"
                />

                {apartment.images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </>
                )}

                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                  <div className="flex space-x-1">
                    {apartment.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full ${index === currentImageIndex ? "bg-white" : "bg-white/50"}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-6">
              {/* Basic Info */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-3xl font-bold text-blue-600">
                      {t.euro}
                      {apartment.price}
                      {t.month}
                    </div>
                    <Badge variant={apartment.available ? "default" : "secondary"}>
                      {apartment.available ? t.available : t.unavailable}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <Home className="w-6 h-6 mx-auto mb-1 text-gray-500" />
                      <div className="text-lg font-semibold">{apartment.size}</div>
                      <div className="text-sm text-gray-600">{t.sqm}</div>
                    </div>
                    <div className="text-center">
                      <Users className="w-6 h-6 mx-auto mb-1 text-gray-500" />
                      <div className="text-lg font-semibold">{apartment.rooms}</div>
                      <div className="text-sm text-gray-600">{t.rooms}</div>
                    </div>
                    <div className="text-center">
                      <Calendar className="w-6 h-6 mx-auto mb-1 text-gray-500" />
                      <div className="text-lg font-semibold">{t.available}</div>
                      <div className="text-sm text-gray-600">Status</div>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{apartment.address}</span>
                  </div>

                  <Button onClick={() => setShowInquiryForm(true)} className="w-full" disabled={!apartment.available}>
                    <Send className="w-4 h-4 mr-2" />
                    {t.sendInquiry}
                  </Button>
                </CardContent>
              </Card>

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{apartment.description}</p>
                </CardContent>
              </Card>

              {/* Features */}
              <Card>
                <CardHeader>
                  <CardTitle>{t.features}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {apartment.features.map((feature) => (
                      <Badge key={feature} variant="outline">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Lifestyle Tags */}
              <Card>
                <CardHeader>
                  <CardTitle>{t.lifestyle}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {apartment.lifestyleTags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {t[tag as keyof typeof t] || tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Inquiry Form Modal */}
      {showInquiryForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {t.sendInquiry}
                <Button variant="ghost" size="sm" onClick={() => setShowInquiryForm(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleInquirySubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">{t.name}</label>
                  <Input
                    value={inquiryForm.name}
                    onChange={(e) => setInquiryForm((prev) => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">{t.email}</label>
                  <Input
                    type="email"
                    value={inquiryForm.email}
                    onChange={(e) => setInquiryForm((prev) => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">{t.message}</label>
                  <Textarea
                    value={inquiryForm.message}
                    onChange={(e) => setInquiryForm((prev) => ({ ...prev, message: e.target.value }))}
                    rows={4}
                    placeholder="I'm interested in this apartment..."
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      {t.send}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
