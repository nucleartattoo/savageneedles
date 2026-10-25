import { Link } from '@tanstack/react-router'
import { ArrowUpRight, Check, Crosshair, Layers, ShieldCheck, ShoppingBag } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '~/lib/cart'
import type { CatalogProduct } from '~/lib/catalog'
import { formatPrice } from '~/lib/utils'

interface NetflixBillboardProps {
  product: CatalogProduct
  onOpenPreview: (product: CatalogProduct) => void
}

export function NetflixBillboard({ product, onOpenPreview }: NetflixBillboardProps) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  const gallery = product.gallery?.length ? product.gallery : product.image ? [product.image] : []
  const [activeImgIdx, setActiveImgIdx] = useState(0)

  const currentImage = gallery[activeImgIdx] || product.image
  const variantCount = product.variants?.length || 1
  const isMachine =
    product.name.toLowerCase().includes('pen') ||
    product.name.toLowerCase().includes('machine') ||
    product.name.toLowerCase().includes('rotary')

  const handleQuickAdd = () => {
    addItem({
      productId: product.id,
      slug: product.slug,
      sku: product.sku,
      name: product.name,
      price: product.price,
      image: currentImage,
      options: [],
      quantity: 1,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <section className="relative w-full overflow-hidden border-b border-zinc-800/80 bg-[#09090b] bg-studio-grid text-zinc-100">
      {/* Subtle Industrial Radial Lighting (Single Accent Rule: Savage Crimson) */}
      <div
        className="pointer-events-none absolute -top-32 right-1/4 h-[460px] w-[460px] rounded-full bg-[#E50914]/8 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[#09090b]/40 to-[#09090b]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-8 pb-12 sm:px-6 lg:px-8 lg:pt-12 lg:pb-16">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left Column (7 cols): Surgical Hardware Typography & Telemetry */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Eyebrow (Max 1 per Hero Stack Discipline) */}
            <div className="inline-flex flex-wrap items-center gap-2.5 rounded-full border border-zinc-800 bg-zinc-900/90 px-3.5 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
              <span className="h-2 w-2 rounded-full bg-[#E50914]" />
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-200">
                ISO-13485 Studio Hardware
              </span>
              <span className="text-zinc-700">/</span>
              <span className="font-mono text-[11px] text-zinc-400">SKU {product.sku}</span>
            </div>

            {/* 2. Headline (Max 2 lines on desktop, tight tracking) */}
            <h1 className="text-4xl font-black tracking-tighter text-white sm:text-5xl lg:text-6xl leading-[0.98] line-clamp-2">
              {product.name}
            </h1>

            {/* 3. Subtext (Max 20 words, high legibility) */}
            <p className="max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base">
              Engineered in Los Angeles for zero-rebound needle stabilization, surgical membrane
              sealing, and relentless multi-hour tattoo session consistency.
            </p>

            {/* Telemetry Readout Grid (Tabular Monospace Numbers) */}
            <div className="grid grid-cols-3 gap-3 max-w-lg rounded-xl border border-zinc-800/90 bg-zinc-900/60 p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
              <div>
                <span className="block font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                  Studio Price
                </span>
                <div className="mt-0.5 flex items-baseline gap-2">
                  <span className="font-mono text-xl sm:text-2xl font-black text-white tabular-nums">
                    {formatPrice(product.price)}
                  </span>
                  {product.special_price && (
                    <span className="font-mono text-xs text-zinc-500 line-through tabular-nums">
                      {formatPrice(product.special_price)}
                    </span>
                  )}
                </div>
              </div>

              <div className="border-l border-zinc-800 pl-3">
                <span className="block font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                  {isMachine ? 'Drive System' : 'Sterilization'}
                </span>
                <span className="mt-1 block font-mono text-xs sm:text-sm font-bold text-zinc-200">
                  {isMachine ? 'Coreless 4.0mm' : 'E.O. Gas + 316L'}
                </span>
              </div>

              <div className="border-l border-zinc-800 pl-3">
                <span className="block font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                  Availability
                </span>
                <span className="mt-1 flex items-center gap-1.5 font-mono text-xs sm:text-sm font-bold text-emerald-400">
                  <span>{variantCount > 1 ? `${variantCount} Specs` : 'LA Hub Ready'}</span>
                </span>
              </div>
            </div>

            {/* 4. Primary & Secondary CTAs (Emil Kowalski tactile press scale-[0.97]) */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={handleQuickAdd}
                className={`inline-flex items-center gap-2.5 rounded-xl px-6 py-3.5 text-sm font-bold cursor-pointer transition-[transform,background-color,color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] ${
                  added
                    ? 'bg-emerald-500 text-zinc-950'
                    : 'bg-white text-zinc-950 hover:bg-zinc-200 shadow-lg shadow-black/40'
                }`}
              >
                {added ? (
                  <>
                    <Check className="h-4 w-4 stroke-[2.5]" />
                    <span>Added to Studio Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4 stroke-[2.2]" />
                    <span>Add to Studio Bag</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => onOpenPreview(product)}
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-700/80 bg-zinc-900/90 px-5 py-3.5 text-sm font-semibold text-zinc-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] cursor-pointer transition-[transform,background-color,border-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-zinc-500 hover:bg-zinc-800 active:scale-[0.97]"
              >
                <Layers className="h-4 w-4 text-zinc-400" />
                <span>Inspect Spec Sheet</span>
              </button>

              <Link
                to="/products/$slug"
                params={{ slug: product.slug }}
                className="inline-flex items-center gap-1 px-2 py-2 text-xs font-mono font-semibold text-zinc-400 transition-colors duration-150 hover:text-white"
              >
                <span>Open Full Matrix</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Column (5 cols): Optical Hardware Stage */}
          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-2xl border border-zinc-800/90 bg-zinc-900/50 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md">
              {/* Top Optical Stage Telemetry Header */}
              <div className="mb-3 flex items-center justify-between border-b border-zinc-800/80 pb-2.5 font-mono text-[10px] text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Crosshair className="h-3.5 w-3.5 text-[#E50914]" />
                  <span>OPTICAL INSPECTION STAGE</span>
                </span>
                <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-300">
                  {activeImgIdx + 1}/{Math.max(gallery.length, 1)}
                </span>
              </div>

              {/* Main Product Stage with Soft Studio Backlight */}
              <Link
                to="/products/$slug"
                params={{ slug: product.slug }}
                className="group relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-xl bg-white p-6 shadow-inner"
              >
                {currentImage ? (
                  <img
                    src={currentImage}
                    alt={product.name}
                    className="h-full w-full object-contain transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-105"
                  />
                ) : (
                  <ShoppingBag className="h-12 w-12 text-zinc-400" />
                )}

                <span className="absolute bottom-2.5 right-2.5 rounded-md bg-zinc-950/85 px-2 py-1 font-mono text-[10px] font-semibold text-zinc-200 backdrop-blur-xs">
                  {isMachine ? 'CNC AIRCRAFT AL-6061' : '316L SURGICAL MEMBRANE'}
                </span>
              </Link>

              {/* Multi-Angle Thumbnail Selector (if product has multiple gallery images) */}
              {gallery.length > 1 ? (
                <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
                  {gallery.slice(0, 5).map((imgUrl, idx) => (
                    <button
                      key={imgUrl}
                      type="button"
                      onClick={() => setActiveImgIdx(idx)}
                      aria-label={`Inspect angle ${idx + 1}`}
                      className={`relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border bg-white p-1 cursor-pointer transition-[transform,border-color,opacity] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-95 ${
                        activeImgIdx === idx
                          ? 'border-[#E50914] ring-1 ring-[#E50914] opacity-100'
                          : 'border-zinc-700 opacity-65 hover:opacity-100'
                      }`}
                    >
                      <img src={imgUrl} alt="" className="h-full w-full object-contain" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                  <span className="flex items-center gap-1.5 text-zinc-300">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Zero-Solder Defect QC Passed</span>
                  </span>
                  <span>20 Pcs / Sterile Blister</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
