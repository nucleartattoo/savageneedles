import { Link } from '@tanstack/react-router'
import { Check, Eye, Package, Plus } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '~/lib/cart'
import type { CatalogProduct } from '~/lib/catalog'
import type { Product } from '~/lib/saleor/types'
import { formatPrice } from '~/lib/utils'

interface ProductCardProps {
  product: CatalogProduct | Product
  onPreview?: (product: CatalogProduct) => void
}

export function ProductCard({ product, onPreview }: ProductCardProps) {
  const isCatalogProduct = 'gallery' in product

  const name = product.name
  const slug = product.slug
  const sku = isCatalogProduct ? product.sku : product.id
  const rawImage = isCatalogProduct ? product.image : product.thumbnail?.url
  const categoryName = isCatalogProduct ? undefined : product.category?.name
  const priceValue = isCatalogProduct
    ? product.price
    : product.pricing?.priceRange?.start?.gross?.amount || 0

  const [imgSrc, setImgSrc] = useState<string | null>(rawImage || null)
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  const formattedPrice = formatPrice(priceValue)

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      productId: product.id,
      slug,
      sku,
      name,
      price: priceValue,
      image: imgSrc || '',
      options: [],
      quantity: 1,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const handlePreviewClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onPreview && isCatalogProduct) {
      onPreview(product as CatalogProduct)
    }
  }

  return (
    <Link
      to="/products/$slug"
      params={{ slug }}
      className="studio-card-interactive group relative flex flex-col overflow-hidden rounded-xl border border-zinc-800/90 bg-[#121215] p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] hover:border-zinc-600"
    >
      {/* Product Optical Stage */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-white p-3 flex items-center justify-center">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={name}
            onError={() => setImgSrc(null)}
            className="h-full w-full object-contain transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center text-zinc-500 gap-1">
            <Package className="h-8 w-8 text-zinc-400" />
            <span className="font-mono text-[10px] text-zinc-500 font-medium">Studio Hardware</span>
          </div>
        )}

        {/* Floating Quick Action Overlay on Hover */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-zinc-950/55 opacity-0 backdrop-blur-[2px] transition-opacity duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:opacity-100">
          {onPreview && isCatalogProduct && (
            <button
              type="button"
              onClick={handlePreviewClick}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-zinc-900/90 text-white shadow-lg cursor-pointer transition-[transform,background-color,color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-white hover:text-zinc-950 active:scale-95"
              aria-label={`Preview ${name}`}
              title="Quick Studio Preview"
            >
              <Eye className="h-4 w-4" />
            </button>
          )}

          <button
            type="button"
            onClick={handleQuickAdd}
            className={`flex h-9 w-9 items-center justify-center rounded-full shadow-lg cursor-pointer transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-95 ${
              added ? 'bg-emerald-500 text-zinc-950' : 'bg-[#E50914] text-white hover:bg-red-600'
            }`}
            aria-label={`Quick add ${name} to cart`}
            title="Quick Order"
          >
            {added ? (
              <Check className="h-4 w-4 stroke-[2.5]" />
            ) : (
              <Plus className="h-4 w-4 stroke-[2.5]" />
            )}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="mt-3.5 flex flex-1 flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 font-mono text-[10px] text-zinc-500">
            <span className="truncate">
              {isCatalogProduct ? product.sku : categoryName || 'SALEOR'}
            </span>
            {isCatalogProduct && product.variants?.length > 1 && (
              <span className="rounded bg-zinc-800/90 px-1.5 py-0.5 text-zinc-300">
                {product.variants.length} specs
              </span>
            )}
          </div>
          <h3 className="mt-1 line-clamp-2 text-sm font-bold text-zinc-100 transition-colors duration-150 group-hover:text-white">
            {name}
          </h3>
        </div>

        <div className="mt-3.5 flex items-center justify-between border-t border-zinc-800/80 pt-2.5">
          <div>
            <span className="font-mono text-base font-black text-white tabular-nums">
              {formattedPrice}
            </span>
            <span className="block font-mono text-[10px] font-medium text-emerald-400">
              In Stock
            </span>
          </div>
          <span className="rounded-lg border border-zinc-700/80 bg-zinc-900 px-2.5 py-1 text-xs font-semibold text-zinc-200 transition-[background-color,color,border-color] duration-150 group-hover:border-[#E50914] group-hover:bg-[#E50914] group-hover:text-white">
            Inspect
          </span>
        </div>
      </div>
    </Link>
  )
}
