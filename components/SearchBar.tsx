"use client"

import { useState, useRef, useEffect } from "react"
import { useApp } from "@/app/providers"
import { useTranslation } from "@/lib/translations"
import { useDebounce } from "@/hooks/useDebounce"
import { germanCities } from "@/lib/mockData"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface SearchBarProps {
  onCitySelect: (city: string) => void
  selectedCity: string
}

export function SearchBar({ onCitySelect, selectedCity }: SearchBarProps) {
  const [query, setQuery] = useState(selectedCity)
  const [isOpen, setIsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState(germanCities)
  const { language } = useApp()
  const t = useTranslation(language)
  const debouncedQuery = useDebounce(query, 300)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (debouncedQuery) {
      const filtered = germanCities.filter(
        (city) =>
          city.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          city.state.toLowerCase().includes(debouncedQuery.toLowerCase()),
      )
      setSuggestions(filtered)
    } else {
      setSuggestions(germanCities)
    }
  }, [debouncedQuery])

  useEffect(() => {
    setQuery(selectedCity)
  }, [selectedCity])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleCitySelect = (cityName: string) => {
    setQuery(cityName)
    onCitySelect(cityName)
    setIsOpen(false)
  }

  const clearSearch = () => {
    setQuery("")
    onCitySelect("")
    inputRef.current?.focus()
  }

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={t.searchPlaceholder}
          className="pl-10 pr-10"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto"
        >
          {suggestions.map((city) => (
            <button
              key={city.name}
              onClick={() => handleCitySelect(city.name)}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
            >
              <div className="font-medium">{city.name}</div>
              <div className="text-sm text-gray-500">{city.state}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
