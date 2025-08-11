import type { Apartment, City } from "@/types"

export const germanCities: City[] = [
  { name: "Berlin", state: "Berlin", coordinates: [52.52, 13.405] },
  { name: "Munich", state: "Bavaria", coordinates: [48.1351, 11.582] },
  { name: "Hamburg", state: "Hamburg", coordinates: [53.5511, 9.9937] },
  { name: "Cologne", state: "North Rhine-Westphalia", coordinates: [50.9375, 6.9603] },
  { name: "Frankfurt", state: "Hesse", coordinates: [50.1109, 8.6821] },
  { name: "Stuttgart", state: "Baden-Württemberg", coordinates: [48.7758, 9.1829] },
  { name: "Düsseldorf", state: "North Rhine-Westphalia", coordinates: [51.2277, 6.7735] },
  { name: "Leipzig", state: "Saxony", coordinates: [51.3397, 12.3731] },
  { name: "Dortmund", state: "North Rhine-Westphalia", coordinates: [51.5136, 7.4653] },
  { name: "Essen", state: "North Rhine-Westphalia", coordinates: [51.4556, 7.0116] },
]

export const lifestyleOptions = [
  "familyFriendly",
  "nightlife",
  "quiet",
  "central",
  "green",
  "transport",
  "shopping",
  "cultural",
]

const neighborhoodsByCity: { [key: string]: string[] } = {
  Berlin: ["Mitte", "Kreuzberg", "Friedrichshain", "Charlottenburg", "Prenzlauer Berg", "Köpenick", "Lichtenberg", "Treptow"],
  Munich: ["Schwabing", "Giesing", "Bogenhausen", "Haidhausen", "Westend", "Altstadt"],
  Hamburg: ["Altona", "St. Pauli", "Blankenese", "Eimsbüttel"],
  Cologne: ["Ehrenfeld", "Nippes", "Deutz", "Altstadt-Nord"],
  Frankfurt: ["Bockenheim", "Sachsenhausen", "Nordend", "Westend"],
  Stuttgart: ["Bad Cannstatt", "Feuerbach", "Möhringen", "Degerloch"],
  Düsseldorf: ["Stadtmitte", "Oberkassel", "Pempelfort", "Bilk"],
  Leipzig: ["Plagwitz", "Südvorstadt", "Gohlis", "Eutritzsch"],
  Dortmund: ["Nordstadt", "Westend", "Hörde", "Brackel"],
  Essen: ["Rüttenscheid", "Stadtkern", "Katernberg", "Altenessen"],
}

const streetNames = ["Hauptstraße", "Schillerstraße", "Goethestraße", "Bahnstraße", "Lindenallee", "Kirchstraße", "Waldweg", "Rosenweg", "Talstraße", "Marktplatz"]

const descriptions = [
  "Beautiful modern apartment with high ceilings and large windows.",
  "Charming studio apartment in a trendy district.",
  "Spacious family apartment with garden access.",
  "Exclusive penthouse with panoramic city views.",
  "Affordable apartment perfect for students.",
  "Cozy loft in a vibrant area.",
  "Bright duplex with modern amenities.",
  "Elegant townhouse in a premium location.",
  "Contemporary flat with all comforts.",
  "Vintage apartment with character.",
]

const featuresList = ["Balcony", "Elevator", "Parking", "Pet-friendly", "Furnished", "Internet included", "Near university", "Garden", "Storage", "Playground nearby", "Terrace", "Concierge", "Gym", "Premium location", "Washing machine", "Kitchen equipped", "Study room", "Dishwasher"]

const titlePrefixes = ["Modern", "Cozy", "Spacious", "Luxury", "Affordable", "Charming", "Bright", "Elegant", "Contemporary", "Vintage"]

const titleTypes = ["Apartment", "Studio", "Family Home", "Penthouse", "Flat", "Loft", "Townhouse", "Duplex"]

const images = [
  "/modern-apartment.png",
  "/cozy-studio-apartment.png",
  "/family-apartment-garden.png",
  "/luxury-penthouse-city-view.png",
  "/student-apartment-near-university.png",
]

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function getRandomSubset<T>(arr: T[], min: number, max: number): T[] {
  const count = Math.floor(Math.random() * (max - min + 1)) + min
  const shuffled = [...arr].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

function generateRandomCoordinates(base: [number, number]): [number, number] {
  const [lat, lon] = base
  const latOffset = (Math.random() - 0.5) * 0.1
  const lonOffset = (Math.random() - 0.5) * 0.1
  return [lat + latOffset, lon + lonOffset]
}

function generateRandomApartments(count: number): Apartment[] {
  const apartments: Apartment[] = []

  for (let i = 1; i <= count; i++) {
    const city = getRandomElement(germanCities)
    const neighborhood = getRandomElement(neighborhoodsByCity[city.name])
    const price = Math.floor(Math.random() * (3000 - 600 + 1)) + 600
    const size = Math.floor(Math.random() * (150 - 20 + 1)) + 20
    const rooms = Math.floor(Math.random() * 5) + 1
    const createdAt = Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)

    apartments.push({
      id: i.toString(),
      title: `${getRandomElement(titlePrefixes)} ${getRandomElement(titleTypes)} in ${neighborhood}`,
      description: `${getRandomElement(descriptions)} in ${neighborhood}.`,
      price,
      size,
      rooms,
      city: city.name,
      address: `${getRandomElement(streetNames)} ${Math.floor(Math.random() * 100) + 1}, ${Math.floor(Math.random() * 90000) + 10000} ${city.name}`,
      coordinates: generateRandomCoordinates(city.coordinates),
      images: [getRandomElement(images)],
      features: getRandomSubset(featuresList, 3, 6),
      neighborhood,
      lifestyleTags: getRandomSubset(lifestyleOptions, 2, 4),
      available: Math.random() > 0.2,
      createdAt,
    })
  }

  return apartments
}

export const mockApartments: Apartment[] = generateRandomApartments(100)
