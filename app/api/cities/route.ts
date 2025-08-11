import { NextResponse } from "next/server"
import { germanCities } from "@/lib/mockData"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")

  let filteredCities = germanCities

  if (query) {
    filteredCities = germanCities.filter(
      (city) =>
        city.name.toLowerCase().includes(query.toLowerCase()) || city.state.toLowerCase().includes(query.toLowerCase()),
    )
  }

  return NextResponse.json(filteredCities)
}
