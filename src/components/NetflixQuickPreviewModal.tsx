import { Link } from '@tanstack/react-router'
import { Check, ExternalLink, Plus, ShoppingBag, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useCart } from '~/lib/cart'
import type { CatalogProduct, ProductChildVariant } from '~/lib/catalog'
import { formatPrice } from '~/lib/utils'

interface NetflixQuickPreviewModalProps {
  product: CatalogProduct | null
  onClose: () => void
}

export function NetflixQuickPreviewModal({ product, onClose }: NetflixQuickPreviewModalProps) {
  if (!product) return null

  const { addItem } = useCart()
  const [selectedChild, setSelectedChild] = useState<ProductChildVariant | null>(() => {
    return product.children && product.children.length > 0 ? product.children[0] : null
  })
  const [activeImage, setActiveImage] = useState(product.image)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    setSelectedChild(product.children && product.children.length > 0 ? product.children[0] : null)
    setActiveImage(product.image)
    setAdded(false)
  }, [product])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const currentPrice = selectedChild?.price || product.price
  const currentSku = selectedChild?.sku || product.sku
  const currentName = selectedChild?.name || product.name
  const isMachine =
    product.name.toLowerCase().includes('pen') ||
    product.name.toLowerCase().includes('machine') ||
    product.name.toLowerCase().includes('rotary')

  const handleAdd = () => {
    addItem({
      productId: product.id,
      slug: product.slug,
      sku: currentSku,
      name: currentName,
      price: currentPrice,
      image: activeImage,
      options: selectedChild ? [{ label: 'Variant', value: selectedChild.name }] : [],
      quantity: 1,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-y-auto">
      {/* Backdrop with @starting-style entrance */}
      <button
        type="button"
        className="studio-modal-backdrop fixed inset-0 h-full w-full border-0 bg-black/80 backdrop-blur-md cursor-default"
        onClick={onClose}
        aria-label="Close modal backdrop"
      />

      {/* Modal Dialog Card with @starting-style scale(0.96) -> scale(1) */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={product.name}
        className="studio-modal-panel relative z-10 w-full max-w-3xl overflow-hidden rounded-2xl border border-zinc-700/90 bg-[#121215] text-white shadow-2xl shadow-black/80"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900/90 text-zinc-300 cursor-pointer transition-[transform,background-color,color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-white hover:text-zinc-950 active:scale-95"
          aria-label="Close Preview"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Top Split Header & Optical Stage */}
        <div className="grid grid-cols-1 sm:grid-cols-12 border-b border-zinc-800/90">
          <div className="sm:col-span-5 flex items-center justify-center bg-white p-6">
            {activeImage ? (
              <img src={activeImage} alt={currentName} className="max-h-52 w-full object-contain" />
            ) : (
              <ShoppingBag className="h-14 w-14 text-zinc-400" />
            )}
          </div>

          <div className="sm:col-span-7 flex flex-col justify-between p-6 space-y-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-zinc-400">
                <span className="rounded bg-[#E50914] px-1.5 py-0.5 font-bold text-white">
                  SPEC SHEET
                </span>
                <span>SKU {currentSku}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                {product.name}
              </h2>
              <p className="text-xs leading-relaxed text-zinc-400 line-clamp-3">
                {product.short_description ||
                  product.description ||
                  'Professional studio hardware engineered for high stability, clean needle drive, and low skin trauma.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-zinc-800/80">
              <div>
                <span className="font-mono text-2xl font-black text-white tabular-nums">
                  {formatPrice(currentPrice)}
                </span>
                <span className="block font-mono text-[10px] font-semibold text-emerald-400">
                  In Stock • LA Hub
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleAdd}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-xs font-bold cursor-pointer transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] ${
                    added
                      ? 'bg-emerald-500 text-zinc-950'
                      : 'bg-white text-zinc-950 hover:bg-zinc-200'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="h-4 w-4 stroke-[2.5]" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 stroke-[2.5]" />
                      <span>Add to Studio Bag</span>
                    </>
                  )}
                </button>

                <Link
                  to="/products/$slug"
                  params={{ slug: product.slug }}
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-2.5 text-xs font-semibold text-zinc-200 transition-colors duration-150 hover:border-zinc-500 hover:text-white"
                >
                  <span>Full Page</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Lower Telemetry & Variant Selector */}
        <div className="p-6 space-y-5">
          {product.children && product.children.length > 1 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  Select Studio Configuration ({product.children.length} Variants)
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                {product.children.map((child) => {
                  const isSelected = selectedChild?.id === child.id
                  return (
                    <button
                      key={child.id}
                      type="button"
                      onClick={() => setSelectedChild(child)}
                      className={`rounded-lg px-2.5 py-1.5 font-mono text-xs cursor-pointer border transition-[transform,border-color,background-color,color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-95 ${
                        isSelected
                          ? 'border-[#E50914] bg-[#E50914]/15 text-white font-bold'
                          : 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-600 hover:text-white'
                      }`}
                    >
                      <span>{child.code || child.label || child.name}</span>
                      <span className="ml-1.5 text-zinc-500 tabular-nums">${child.price}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Dynamic Spec Grid based on Product Type */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
            <div className="rounded-xl border border-zinc-800/90 bg-zinc-900/60 p-3">
              <span className="block text-[10px] uppercase text-zinc-500">
                {isMachine ? 'Motor Spec' : 'Metallurgy'}
              </span>
              <span className="mt-0.5 block font-bold text-zinc-200">
                {isMachine ? 'Japan Coreless' : '316L Surgical Steel'}
              </span>
            </div>
            <div className="rounded-xl border border-zinc-800/90 bg-zinc-900/60 p-3">
              <span className="block text-[10px] uppercase text-zinc-500">
                {isMachine ? 'Stroke Length' : 'Sterilization'}
              </span>
              <span className="mt-0.5 block font-bold text-zinc-200">
                {isMachine ? '4.0mm Direct' : '100% E.O. Gas'}
              </span>
            </div>
            <div className="rounded-xl border border-zinc-800/90 bg-zinc-900/60 p-3">
              <span className="block text-[10px] uppercase text-zinc-500">Compatibility</span>
              <span className="mt-0.5 block font-bold text-zinc-200">Universal Twist</span>
            </div>
            <div className="rounded-xl border border-zinc-800/90 bg-zinc-900/60 p-3">
              <span className="block text-[10px] uppercase text-zinc-500">Studio QC</span>
              <span className="mt-0.5 block font-bold text-emerald-400">LA Hub Verified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
