export interface Apartment {
  id: string
  title: string
  description: string
  price: number
  size: number
  rooms: number
  city: string
  address: string
  coordinates: [number, number]
  images: string[]
  features: string[]
  neighborhood: string
  lifestyleTags: string[]
  available: boolean
  createdAt: number
}

export interface UserPreferences {
  priceRange: [number, number]
  sizeRange: [number, number]
  rooms: [number, number]
  lifestyle: string[]
}

export interface UserActivity {
  viewed: Array<{
    apartment: Apartment
    timestamp: number
  }>
  contacted: Array<{
    apartmentId: string
    timestamp: number
  }>
}

export interface City {
  name: string
  state: string
  coordinates: [number, number]
}

export interface SearchFilters {
  city: string
  priceRange: [number, number]
  sizeRange: [number, number]
  rooms: [number, number]
  lifestyle: string[]
}
