import { Link } from '@tanstack/react-router'
import { Check, ChevronLeft, ChevronRight, Eye, Plus, ShoppingBag } from 'lucide-react'
import { useRef, useState } from 'react'
import { useCart } from '~/lib/cart'
import type { CatalogProduct } from '~/lib/catalog'
import { formatPrice } from '~/lib/utils'

interface NetflixRowProps {
  title: string
  subtitle?: string
  categorySlug?: string
  products: CatalogProduct[]
  isRanked?: boolean
  onOpenPreview: (product: CatalogProduct) => void
}

function getHardwareClassification(name: string): string {
  const lower = name.toLowerCase()
  if (
    lower.includes('liner') ||
    lower.includes('shader') ||
    lower.includes('magnum') ||
    lower.includes('cartridge')
  ) {
    return '316L E.O. Sterile'
  }
  if (lower.includes('pen') || lower.includes('machine') || lower.includes('rotary')) {
    return 'CNC Rotary Drive'
  }
  if (lower.includes('power') || lower.includes('battery') || lower.includes('volt')) {
    return 'Regulated Power'
  }
  if (lower.includes('grip')) {
    return 'Autoclave Grip'
  }
  return 'Studio Spec'
}

export function NetflixRow({
  title,
  subtitle,
  categorySlug,
  products,
  isRanked = false,
  onOpenPreview,
}: NetflixRowProps) {
  const rowRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const { addItem } = useCart()
  const [addedSku, setAddedSku] = useState<string | null>(null)
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({})

  const checkScroll = () => {
    if (!rowRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = rowRef.current
    setCanScrollLeft(scrollLeft > 10)
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10)
  }

  const scroll = (direction: 'left' | 'right') => {
    if (!rowRef.current) return
    const offset = rowRef.current.clientWidth * 0.75
    rowRef.current.scrollBy({
      left: direction === 'left' ? -offset : offset,
      behavior: 'smooth',
    })
    setTimeout(checkScroll, 300)
  }

  const handleQuickAdd = (e: React.MouseEvent, product: CatalogProduct) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      productId: product.id,
      slug: product.slug,
      sku: product.sku,
      name: product.name,
      price: product.price,
      image: product.image,
      options: [],
      quantity: 1,
    })
    setAddedSku(product.sku)
    setTimeout(() => setAddedSku(null), 1800)
  }

  if (!products || products.length === 0) return null

  return (
    <div className="relative group/row mx-auto max-w-7xl space-y-4 px-4 sm:px-6 lg:px-8">
      {/* Row Header */}
      <div className="flex items-end justify-between border-b border-zinc-800/80 pb-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg sm:text-xl font-black tracking-tight text-zinc-100">{title}</h2>
            {isRanked && (
              <span className="rounded border border-[#E50914]/40 bg-[#E50914]/10 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#E50914]">
                Dispatch Volume Top 10
              </span>
            )}
          </div>
          {subtitle && <p className="mt-0.5 text-xs text-zinc-400">{subtitle}</p>}
        </div>

        {categorySlug && (
          <Link
            to="/categories/$slug"
            params={{ slug: categorySlug }}
            className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-zinc-400 transition-colors duration-150 hover:text-white group/more"
          >
            <span>View Full Line</span>
            <ChevronRight className="h-3.5 w-3.5 transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/more:translate-x-0.5" />
          </Link>
        )}
      </div>

      {/* Row Slider Container */}
      <div className="relative">
        {/* Left Arrow Button */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-zinc-700 bg-zinc-950/90 text-white shadow-xl backdrop-blur-md cursor-pointer transition-[transform,opacity,background-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] opacity-0 group-hover/row:opacity-100 hover:bg-zinc-800 active:scale-95"
            aria-label="Scroll Left"
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </button>
        )}

        {/* Scrollable Track */}
        <div
          ref={rowRef}
          onScroll={checkScroll}
          className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth py-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product, idx) => {
            const isAdded = addedSku === product.sku
            const specLabel = getHardwareClassification(product.name)
            const rankStr = String(idx + 1).padStart(2, '0')

            return (
              <div
                key={product.id}
                className="w-56 sm:w-64 flex-none group/card relative select-none"
              >
                <div className="studio-card-interactive flex h-full w-full flex-col justify-between overflow-hidden rounded-xl border border-zinc-800/90 bg-[#121215] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] hover:border-zinc-600">
                  {/* Thumbnail Container (Clean Optical Stage) */}
                  <div
                    className={`relative aspect-[4/3] overflow-hidden rounded-lg p-3 flex items-center justify-center ${
                      product.image && !failedImages[product.id] ? 'bg-white' : 'bg-zinc-900'
                    }`}
                  >
                    {product.image && !failedImages[product.id] ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        onError={() => setFailedImages((prev) => ({ ...prev, [product.id]: true }))}
                        className="h-full w-full object-contain transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/card:scale-105"
                        loading={idx < 4 ? 'eager' : 'lazy'}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-1 text-zinc-500">
                        <ShoppingBag className="h-8 w-8 text-zinc-600" />
                        <span className="font-mono text-[10px] uppercase tracking-wider">
                          {product.sku}
                        </span>
                      </div>
                    )}

                    {/* Industrial Rank Index Badge */}
                    {isRanked && (
                      <span className="absolute top-2 left-2 rounded-md border border-zinc-800 bg-zinc-950/90 px-2 py-0.5 font-mono text-[11px] font-black text-white shadow-sm">
                        #{rankStr}
                      </span>
                    )}

                    {/* Quick Action Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-zinc-950/55 p-2 opacity-0 backdrop-blur-[2px] transition-opacity duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/card:opacity-100">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          onOpenPreview(product)
                        }}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-zinc-900/90 text-white shadow-lg cursor-pointer transition-[transform,background-color,color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-white hover:text-zinc-950 active:scale-95"
                        aria-label={`Quick inspect ${product.name}`}
                        title="Inspect Spec Sheet"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleQuickAdd(e, product)}
                        className={`flex h-9 w-9 items-center justify-center rounded-full shadow-lg cursor-pointer transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-95 ${
                          isAdded
                            ? 'bg-emerald-500 text-zinc-950'
                            : 'bg-[#E50914] text-white hover:bg-red-600'
                        }`}
                        aria-label={`Quick add ${product.name} to bag`}
                        title="Add to Studio Bag"
                      >
                        {isAdded ? (
                          <Check className="h-4 w-4 stroke-[2.5]" />
                        ) : (
                          <Plus className="h-4 w-4 stroke-[2.5]" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Card Telemetry Details */}
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between font-mono text-[10px]">
                      <span className="rounded bg-zinc-800/90 px-1.5 py-0.5 font-semibold text-zinc-300">
                        {specLabel}
                      </span>
                      <span className="text-zinc-500 truncate max-w-[96px]">{product.sku}</span>
                    </div>

                    <Link
                      to="/products/$slug"
                      params={{ slug: product.slug }}
                      className="block text-xs font-bold text-zinc-100 line-clamp-1 transition-colors duration-150 hover:text-white"
                      title={product.name}
                    >
                      {product.name}
                    </Link>

                    {/* Price & Variant Count */}
                    <div className="flex items-center justify-between border-t border-zinc-800/80 pt-2">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-mono text-sm font-black text-white tabular-nums">
                          {formatPrice(product.price)}
                        </span>
                        {product.special_price && (
                          <span className="font-mono text-[10px] text-zinc-500 line-through tabular-nums">
                            {formatPrice(product.special_price)}
                          </span>
                        )}
                      </div>

                      <span className="font-mono text-[10px] font-semibold text-emerald-400">
                        {product.variants && product.variants.length > 1
                          ? `${product.variants.length} specs`
                          : 'In Stock'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Right Arrow Button */}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-zinc-700 bg-zinc-950/90 text-white shadow-xl backdrop-blur-md cursor-pointer transition-[transform,opacity,background-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] opacity-0 group-hover/row:opacity-100 hover:bg-zinc-800 active:scale-95"
            aria-label="Scroll Right"
          >
            <ChevronRight className="h-5 w-5 text-white" />
          </button>
        )}
      </div>
    </div>
  )
}
