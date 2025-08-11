import { NextResponse } from "next/server"
import { mockApartments } from "@/lib/mockData"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const city = searchParams.get("city")
  const minPrice = Number.parseInt(searchParams.get("minPrice") || "0")
  const maxPrice = Number.parseInt(searchParams.get("maxPrice") || "10000")
  const minSize = Number.parseInt(searchParams.get("minSize") || "0")
  const maxSize = Number.parseInt(searchParams.get("maxSize") || "1000")
  const minRooms = Number.parseInt(searchParams.get("minRooms") || "1")
  const maxRooms = Number.parseInt(searchParams.get("maxRooms") || "10")
  const lifestyle = searchParams.get("lifestyle")?.split(",").filter(Boolean) || []

  let filteredApartments = mockApartments

  if (city) {
    filteredApartments = filteredApartments.filter((apt) => apt.city.toLowerCase().includes(city.toLowerCase()))
  }

  filteredApartments = filteredApartments.filter(
    (apt) =>
      apt.price >= minPrice &&
      apt.price <= maxPrice &&
      apt.size >= minSize &&
      apt.size <= maxSize &&
      apt.rooms >= minRooms &&
      apt.rooms <= maxRooms,
  )

  if (lifestyle.length > 0) {
    filteredApartments = filteredApartments.filter((apt) => lifestyle.some((tag) => apt.lifestyleTags.includes(tag)))
  }

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  return NextResponse.json(filteredApartments)
}
