"use client"

import { useState, useRef, useEffect } from "react"
import { useApp } from "@/app/providers"
import { useTranslation } from "@/lib/translations"
import type { Apartment } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, RotateCcw, Maximize, Volume2, VolumeX, Camera, X } from "lucide-react"

interface VirtualTourProps {
  apartment: Apartment
  isOpen: boolean
  onClose: () => void
}

export function VirtualTour({ apartment, isOpen, onClose }: VirtualTourProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentRoom, setCurrentRoom] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [rotation, setRotation] = useState(0)
  const tourRef = useRef<HTMLDivElement>(null)
  const { language } = useApp()
  const t = useTranslation(language)

  // Mock room data for virtual tour
  const rooms = [
    {
      name: "Living Room",
      image: "/modern-living-room.png",
      description: "Spacious living area with large windows",
    },
    { name: "Kitchen", image: "/modern-kitchen.png", description: "Fully equipped modern kitchen" },
    { name: "Bedroom", image: "/modern-bedroom.png", description: "Comfortable bedroom with built-in storage" },
    {
      name: "Bathroom",
      image: "/modern-bathroom.png",
      description: "Contemporary bathroom with premium fixtures",
    },
  ]

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentRoom((prev) => (prev + 1) % rooms.length)
      }, 3000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, rooms.length])

  const toggleFullscreen = () => {
    try {
      if (!document.fullscreenElement && tourRef.current) {
        if (tourRef.current.requestFullscreen) {
          tourRef.current.requestFullscreen()
          setIsFullscreen(true)
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen()
          setIsFullscreen(false)
        }
      }
    } catch (error) {
      console.warn("Fullscreen not supported")
    }
  }

  const resetView = () => {
    setRotation(0)
    setCurrentRoom(0)
    setIsPlaying(false)
  }

  const takeScreenshot = () => {
    try {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      canvas.width = 800
      canvas.height = 600

      if (ctx) {
        ctx.fillStyle = "#f0f0f0"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = "#333"
        ctx.font = "24px Arial"
        ctx.textAlign = "center"
        ctx.fillText(`${apartment.title} - ${rooms[currentRoom].name}`, canvas.width / 2, canvas.height / 2)

        const link = document.createElement("a")
        link.download = `${apartment.title}-${rooms[currentRoom].name}.png`
        link.href = canvas.toDataURL()
        link.click()
      }
    } catch (error) {
      console.warn("Screenshot not supported")
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      <div
        ref={tourRef}
        className={`bg-white rounded-lg shadow-xl overflow-hidden ${
          isFullscreen ? "w-full h-full" : "w-full max-w-6xl h-[80vh] mx-4"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <div>
            <h2 className="text-xl font-bold">{apartment.title}</h2>
            <p className="text-sm text-gray-600">Virtual Tour - {rooms[currentRoom].name}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">
              {currentRoom + 1} of {rooms.length}
            </Badge>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Main Tour Area */}
        <div className="relative flex-1 bg-black">
          <div
            className="w-full h-96 lg:h-[500px] relative overflow-hidden"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            <img
              src={rooms[currentRoom].image || "/placeholder.svg"}
              alt={rooms[currentRoom].name}
              className="w-full h-full object-cover transition-all duration-500"
            />

            {/* Room Info Overlay */}
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white p-3 rounded-lg">
              <h3 className="font-semibold">{rooms[currentRoom].name}</h3>
              <p className="text-sm opacity-90">{rooms[currentRoom].description}</p>
            </div>

            {/* Navigation Dots */}
            <div className="absolute bottom-4 right-4 flex space-x-2">
              {rooms.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentRoom(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentRoom ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="flex items-center justify-between">
              {/* Playback Controls */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="text-white hover:bg-white/20"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>

                <Button variant="ghost" size="sm" onClick={resetView} className="text-white hover:bg-white/20">
                  <RotateCcw className="w-4 h-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-white hover:bg-white/20"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
              </div>

              {/* Room Navigation */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentRoom((prev) => (prev > 0 ? prev - 1 : rooms.length - 1))}
                  className="text-white hover:bg-white/20"
                >
                  ←
                </Button>

                <span className="text-white text-sm px-2">{rooms[currentRoom].name}</span>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentRoom((prev) => (prev + 1) % rooms.length)}
                  className="text-white hover:bg-white/20"
                >
                  →
                </Button>
              </div>

              {/* View Controls */}
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={takeScreenshot} className="text-white hover:bg-white/20">
                  <Camera className="w-4 h-4" />
                </Button>

                <Button variant="ghost" size="sm" onClick={toggleFullscreen} className="text-white hover:bg-white/20">
                  <Maximize className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Room List Sidebar */}
        {!isFullscreen && (
          <div className="w-full lg:w-80 border-l bg-gray-50 p-4 space-y-3 max-h-96 overflow-y-auto">
            <h3 className="font-semibold mb-3">Tour Rooms</h3>
            {rooms.map((room, index) => (
              <Card
                key={index}
                className={`cursor-pointer transition-colors ${
                  index === currentRoom ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-gray-100"
                }`}
                onClick={() => setCurrentRoom(index)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={room.image || "/placeholder.svg"}
                        alt={room.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm">{room.name}</h4>
                      <p className="text-xs text-gray-600 line-clamp-2">{room.description}</p>
                    </div>
                    {index === currentRoom && <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
