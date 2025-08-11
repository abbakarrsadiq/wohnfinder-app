interface NeighborhoodRule {
  lifestyle: string[]
  neighborhoods: Array<{
    name: string
    city: string
    score: number
    description: string
  }>
}

const neighborhoodRules: NeighborhoodRule[] = [
  {
    lifestyle: ["familyFriendly", "green", "quiet"],
    neighborhoods: [
      {
        name: "Zehlendorf",
        city: "Berlin",
        score: 95,
        description: "Quiet residential area with excellent schools and green spaces",
      },
      {
        name: "Bogenhausen",
        city: "Munich",
        score: 92,
        description: "Upscale family neighborhood with parks and good schools",
      },
      {
        name: "Blankenese",
        city: "Hamburg",
        score: 90,
        description: "Picturesque area with family homes and Elbe river access",
      },
    ],
  },
  {
    lifestyle: ["nightlife", "cultural", "central"],
    neighborhoods: [
      {
        name: "Kreuzberg",
        city: "Berlin",
        score: 98,
        description: "Vibrant nightlife and cultural scene in the heart of Berlin",
      },
      {
        name: "Glockenbachviertel",
        city: "Munich",
        score: 94,
        description: "Trendy district with bars, restaurants, and cultural venues",
      },
      {
        name: "St. Pauli",
        city: "Hamburg",
        score: 96,
        description: "Famous entertainment district with legendary nightlife",
      },
    ],
  },
  {
    lifestyle: ["shopping", "central", "transport"],
    neighborhoods: [
      {
        name: "Charlottenburg",
        city: "Berlin",
        score: 93,
        description: "Shopping paradise with excellent transport connections",
      },
      {
        name: "Maxvorstadt",
        city: "Munich",
        score: 91,
        description: "Central location with shopping and cultural attractions",
      },
      {
        name: "Neustadt",
        city: "Düsseldorf",
        score: 89,
        description: "Premium shopping district with luxury boutiques",
      },
    ],
  },
]

export function getNeighborhoodSuggestions(selectedLifestyle: string[]) {
  if (selectedLifestyle.length === 0) return []

  const suggestions = neighborhoodRules
    .filter((rule) => {
      const overlap = rule.lifestyle.filter((tag) => selectedLifestyle.includes(tag))
      return overlap.length >= Math.min(2, rule.lifestyle.length)
    })
    .flatMap((rule) => rule.neighborhoods)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)

  return suggestions
}
