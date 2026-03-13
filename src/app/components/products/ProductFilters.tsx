'use client'

import { useState, useEffect } from 'react'
import { 
  ChevronDown, 
  ChevronUp, 
  SlidersHorizontal,
  X,
  Search,
  Star,
  DollarSign,
  Check,
  RotateCcw,
  Filter,
  Grid,
  List,
  LayoutGrid,
  ArrowUpDown
} from 'lucide-react'

interface FilterCategory {
  id: string
  name: string
  type: 'checkbox' | 'radio' | 'range' | 'rating' | 'color' | 'size'
  options?: FilterOption[]
  min?: number
  max?: number
  step?: number
  unit?: string
}

interface FilterOption {
  id: string
  name: string
  value: string
  count?: number
  color?: string
  disabled?: boolean
}

interface PriceRange {
  min: number
  max: number
}

interface ProductFiltersProps {
  categories: FilterCategory[]
  selectedFilters: Record<string, any>
  onFilterChange: (filters: Record<string, any>) => void
  onClearAll?: () => void
  totalResults?: number
  sortOptions?: SortOption[]
  selectedSort?: string
  onSortChange?: (sort: string) => void
  viewMode?: 'grid' | 'list'
  onViewModeChange?: (mode: 'grid' | 'list') => void
  showSearch?: boolean
  showViewToggle?: boolean
  showSort?: boolean
  showFilterToggle?: boolean
  defaultOpen?: boolean
  mobileBreakpoint?: number
  className?: string
}

interface SortOption {
  id: string
  name: string
  value: string
}

export function ProductFilters({
  categories,
  selectedFilters = {},
  onFilterChange,
  onClearAll,
  totalResults,
  sortOptions = [
    { id: 'popular', name: 'Most Popular', value: 'popular' },
    { id: 'newest', name: 'Newest', value: 'newest' },
    { id: 'price-asc', name: 'Price: Low to High', value: 'price-asc' },
    { id: 'price-desc', name: 'Price: High to Low', value: 'price-desc' },
    { id: 'rating', name: 'Top Rated', value: 'rating' }
  ],
  selectedSort = 'popular',
  onSortChange,
  viewMode = 'grid',
  onViewModeChange,
  showSearch = true,
  showViewToggle = true,
  showSort = true,
  showFilterToggle = true,
  defaultOpen = true,
  mobileBreakpoint = 768,
  className = ''
}: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [isMobile, setIsMobile] = useState(false)
  const [expandedSections, setExpandedSections] = useState<string[]>(
    categories.map(c => c.id)
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [priceRange, setPriceRange] = useState<PriceRange>({ min: 0, max: 1000 })
  const [tempPriceRange, setTempPriceRange] = useState<PriceRange>({ min: 0, max: 1000 })

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < mobileBreakpoint)
      if (window.innerWidth < mobileBreakpoint) {
        setIsOpen(false)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [mobileBreakpoint])

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const handleFilterChange = (categoryId: string, value: any, isChecked?: boolean) => {
    const currentValues = selectedFilters[categoryId] || []
    
    let newValues
    if (Array.isArray(currentValues)) {
      if (isChecked) {
        newValues = [...currentValues, value]
      } else {
        newValues = currentValues.filter(v => v !== value)
      }
    } else {
      newValues = value
    }

    onFilterChange({
      ...selectedFilters,
      [categoryId]: newValues
    })
  }

  const handlePriceRangeChange = (type: 'min' | 'max', value: number) => {
    setTempPriceRange(prev => ({ ...prev, [type]: value }))
  }

  const applyPriceRange = () => {
    onFilterChange({
      ...selectedFilters,
      price: tempPriceRange
    })
    setPriceRange(tempPriceRange)
  }

  const handleClearAll = () => {
    setPriceRange({ min: 0, max: 1000 })
    setTempPriceRange({ min: 0, max: 1000 })
    setSearchQuery('')
    if (onClearAll) {
      onClearAll()
    } else {
      onFilterChange({})
    }
  }

  const getActiveFilterCount = () => {
    return Object.values(selectedFilters).reduce((count, value) => {
      if (Array.isArray(value)) return count + value.length
      if (value && typeof value === 'object') return count + 1
      return count
    }, 0)
  }

  const activeFilterCount = getActiveFilterCount()

  const renderFilterSection = (category: FilterCategory) => {
    const isExpanded = expandedSections.includes(category.id)

    return (
      <div key={category.id} className="border-b border-gray-200 dark:border-gray-800 py-4">
        <button
          onClick={() => toggleSection(category.id)}
          className="flex items-center justify-between w-full text-left font-medium text-gray-900 dark:text-white hover:text-primary-600"
        >
          <span>{category.name}</span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {isExpanded && (
          <div className="mt-4 space-y-3">
            {category.type === 'checkbox' && category.options?.map(option => (
              <label
                key={option.id}
                className="flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={(selectedFilters[category.id] || []).includes(option.value)}
                    onChange={(e) => handleFilterChange(category.id, option.value, e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-primary-600">
                    {option.name}
                  </span>
                </div>
                {option.count !== undefined && (
                  <span className="text-xs text-gray-400">({option.count})</span>
                )}
              </label>
            ))}

            {category.type === 'radio' && category.options?.map(option => (
              <label
                key={option.id}
                className="flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={category.id}
                    value={option.value}
                    checked={selectedFilters[category.id] === option.value}
                    onChange={(e) => handleFilterChange(category.id, e.target.value)}
                    className="border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-primary-600">
                    {option.name}
                  </span>
                </div>
                {option.count !== undefined && (
                  <span className="text-xs text-gray-400">({option.count})</span>
                )}
              </label>
            ))}

            {category.type === 'rating' && (
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <label
                    key={rating}
                    className="flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={(selectedFilters[category.id] || []).includes(rating.toString())}
                        onChange={(e) => handleFilterChange(category.id, rating.toString(), e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < rating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                          />
                        ))}
                        <span className="text-sm text-gray-500 ml-1">& Up</span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}

            {category.type === 'color' && (
              <div className="flex flex-wrap gap-3">
                {category.options?.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleFilterChange(
                      category.id,
                      option.value,
                      !(selectedFilters[category.id] || []).includes(option.value)
                    )}
                    className={`
                      relative w-8 h-8 rounded-full border-2 transition-all
                      ${(selectedFilters[category.id] || []).includes(option.value)
                        ? 'border-primary-600 scale-110'
                        : 'border-transparent hover:scale-105'
                      }
                    `}
                    style={{ backgroundColor: option.color }}
                    title={option.name}
                  >
                    {(selectedFilters[category.id] || []).includes(option.value) && (
                      <Check className="absolute inset-0 m-auto w-4 h-4 text-white drop-shadow-md" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {category.type === 'size' && (
              <div className="flex flex-wrap gap-2">
                {category.options?.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleFilterChange(
                      category.id,
                      option.value,
                      !(selectedFilters[category.id] || []).includes(option.value)
                    )}
                    disabled={option.disabled}
                    className={`
                      min-w-[40px] px-3 py-2 text-sm font-medium border rounded-lg transition-colors
                      ${(selectedFilters[category.id] || []).includes(option.value)
                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-600'
                        : option.disabled
                        ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                        : 'border-gray-300 dark:border-gray-700 hover:border-primary-400 hover:text-primary-600'
                      }
                    `}
                  >
                    {option.name}
                  </button>
                ))}
              </div>
            )}

            {category.type === 'range' && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">Min</label>
                    <div className="relative">
                      {category.unit && (
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                          {category.unit}
                        </span>
                      )}
                      <input
                        type="number"
                        value={tempPriceRange.min}
                        onChange={(e) => handlePriceRangeChange('min', Number(e.target.value))}
                        min={category.min || 0}
                        max={tempPriceRange.max}
                        step={category.step || 1}
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                      />
                    </div>
                  </div>
                  <span className="text-gray-400 mt-6">-</span>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">Max</label>
                    <div className="relative">
                      {category.unit && (
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                          {category.unit}
                        </span>
                      )}
                      <input
                        type="number"
                        value={tempPriceRange.max}
                        onChange={(e) => handlePriceRangeChange('max', Number(e.target.value))}
                        min={tempPriceRange.min}
                        max={category.max || 1000}
                        step={category.step || 1}
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                      />
                    </div>
                  </div>
                </div>

                {/* Range slider */}
                <div className="relative px-2">
                  <input
                    type="range"
                    min={category.min || 0}
                    max={category.max || 1000}
                    value={tempPriceRange.min}
                    onChange={(e) => setTempPriceRange(prev => ({ 
                      ...prev, 
                      min: Math.min(Number(e.target.value), tempPriceRange.max - 1)
                    }))}
                    className="absolute w-full h-2 opacity-0 cursor-pointer z-20"
                  />
                  <input
                    type="range"
                    min={category.min || 0}
                    max={category.max || 1000}
                    value={tempPriceRange.max}
                    onChange={(e) => setTempPriceRange(prev => ({ 
                      ...prev, 
                      max: Math.max(Number(e.target.value), tempPriceRange.min + 1)
                    }))}
                    className="absolute w-full h-2 opacity-0 cursor-pointer z-20"
                  />
                  <div className="relative h-2">
                    <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 rounded-full" />
                    <div
                      className="absolute h-full bg-primary-600 rounded-full"
                      style={{
                        left: `${(tempPriceRange.min / (category.max || 1000)) * 100}%`,
                        right: `${100 - (tempPriceRange.max / (category.max || 1000)) * 100}%`
                      }}
                    />
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-primary-600 rounded-full shadow cursor-pointer"
                      style={{ left: `${(tempPriceRange.min / (category.max || 1000)) * 100}%` }}
                    />
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-primary-600 rounded-full shadow cursor-pointer"
                      style={{ left: `${(tempPriceRange.max / (category.max || 1000)) * 100}%` }}
                    />
                  </div>
                </div>

                <button
                  onClick={applyPriceRange}
                  className="w-full py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700"
                >
                  Apply
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={className}>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          {showFilterToggle && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg"
            >
              <Filter className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-primary-600 text-white text-xs rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>
          )}

          {showSearch && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500"
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Results count */}
          {totalResults !== undefined && (
            <span className="text-sm text-gray-500">
              {totalResults} products
            </span>
          )}

          {/* Sort dropdown */}
          {showSort && sortOptions && onSortChange && (
            <div className="relative">
              <select
                value={selectedSort}
                onChange={(e) => onSortChange(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-primary-500"
              >
                {sortOptions.map(option => (
                  <option key={option.id} value={option.value}>
                    {option.name}
                  </option>
                ))}
              </select>
              <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          )}

          {/* View toggle */}
          {showViewToggle && onViewModeChange && (
            <div className="flex items-center gap-1 border border-gray-200 dark:border-gray-800 rounded-lg p-1">
              <button
                onClick={() => onViewModeChange('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => onViewModeChange('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex gap-8">
        {/* Filters sidebar */}
        {(isOpen || !isMobile) && (
          <div className={`
            ${isMobile 
              ? 'fixed inset-0 z-50 bg-white dark:bg-gray-900 overflow-auto p-4'
              : 'w-64 flex-shrink-0'
            }
          `}>
            {/* Mobile header */}
            {isMobile && (
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Active filters */}
            {activeFilterCount > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Active Filters</span>
                  <button
                    onClick={handleClearAll}
                    className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(selectedFilters).map(([key, value]) => {
                    if (Array.isArray(value)) {
                      return value.map(v => (
                        <span
                          key={`${key}-${v}`}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 text-sm rounded"
                        >
                          {v}
                          <button
                            onClick={() => handleFilterChange(key, v, false)}
                            className="hover:text-primary-800"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))
                    }
                    return null
                  })}
                </div>
              </div>
            )}

            {/* Filter sections */}
            <div className="space-y-2">
              {categories.map(renderFilterSection)}
            </div>

            {/* Mobile apply button */}
            {isMobile && (
              <button
                onClick={() => setIsOpen(false)}
                className="sticky bottom-4 w-full mt-4 py-3 bg-primary-600 text-white rounded-lg font-medium"
              >
                Apply Filters
              </button>
            )}
          </div>
        )}

        {/* Content area */}
        <div className="flex-1">
          {/* Active filters pill for mobile */}
          {isMobile && activeFilterCount > 0 && (
            <div className="mb-4">
              <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 rounded-lg"
              >
                <Filter className="w-4 h-4" />
                {activeFilterCount} active filters
              </button>
            </div>
          )}

          {/* Product grid/list would go here */}
          <div className="text-center py-12 text-gray-500">
            Product grid/list will be rendered here
          </div>
        </div>
      </div>
    </div>
  )
}