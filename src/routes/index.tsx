import { Link, createFileRoute } from '@tanstack/react-router'
import {
  ArrowUpRight,
  Award,
  Check,
  ChevronRight,
  Crosshair,
  Layers,
  ShieldCheck,
  ShoppingBag,
  Truck,
  Zap,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { NetflixBillboard } from '~/components/NetflixBillboard'
import { NetflixQuickPreviewModal } from '~/components/NetflixQuickPreviewModal'
import { NetflixRow } from '~/components/NetflixRow'
import { useCart } from '~/lib/cart'
import {
  type CatalogProduct,
  getCartridgeNeedles,
  getHeroProduct,
  getProductBySlug,
  getTop10Products,
  getTopCategories,
  getWirelessMachines,
} from '~/lib/catalog'
import { formatPrice } from '~/lib/utils'

export const Route = createFileRoute('/')({
  component: StudioHomePage,
})

const NEEDLE_TYPES = [
  { code: 'RL', name: 'Round Liner', spec: 'Tight grouping for crisp linework & dotwork' },
  { code: 'RS', name: 'Round Shader', spec: 'Open cylindrical matrix for bold lines & fill' },
  { code: 'RM', name: 'Curved Magnum', spec: 'Arched tip for soft edges & realism shading' },
  { code: 'M1', name: 'Standard Magnum', spec: 'Flat weave for high-saturation color packing' },
] as const

const NEEDLE_GAUGES = [
  { code: '08', label: '#08 Bugpin', mm: '0.25mm' },
  { code: '10', label: '#10 Bugpin', mm: '0.30mm' },
  { code: '12', label: '#12 Standard', mm: '0.35mm' },
] as const

function StudioHomePage() {
  const heroProduct = getHeroProduct()
  const top10Products = getTop10Products()
  const wirelessMachines = getWirelessMachines(12)
  const cartridgeNeedles = getCartridgeNeedles(12)
  const topCategories = getTopCategories()
  const matrixProduct = getProductBySlug('BNC-03') || cartridgeNeedles[0]
  const rotarySpotlight = wirelessMachines[0] || heroProduct

  const { addItem } = useCart()

  // Interactive Needle Matrix Bento State
  const [selectedType, setSelectedType] = useState<string>('RL')
  const [selectedGauge, setSelectedGauge] = useState<string>('10')
  const [selectedVariantSku, setSelectedVariantSku] = useState<string>('')
  const [matrixAdded, setMatrixAdded] = useState(false)

  const matchingVariants = useMemo(() => {
    const allVars = matrixProduct?.variants || []
    return allVars.filter((v) => {
      const code = v.code || ''
      const matchesType = v.needle_type_code === selectedType || code.endsWith(selectedType)
      const matchesGauge = code.startsWith(selectedGauge)
      return matchesType && matchesGauge
    })
  }, [matrixProduct, selectedType, selectedGauge])

  const activeVariant = useMemo(() => {
    if (matchingVariants.length === 0) return matrixProduct?.variants?.[0]
    return matchingVariants.find((v) => v.sku === selectedVariantSku) || matchingVariants[0]
  }, [matchingVariants, selectedVariantSku, matrixProduct])

  const handleAddMatrixVariant = () => {
    if (!matrixProduct || !activeVariant) return
    addItem({
      productId: matrixProduct.id,
      slug: matrixProduct.slug,
      sku: activeVariant.sku,
      name: `${matrixProduct.name} (${activeVariant.code || activeVariant.name})`,
      price: activeVariant.price || matrixProduct.price,
      image: matrixProduct.image,
      options: [
        { label: 'Code', value: activeVariant.code || activeVariant.sku },
        { label: 'Gauge', value: `${selectedGauge} (${activeVariant.gauge || ''})` },
      ],
      quantity: 1,
    })
    setMatrixAdded(true)
    setTimeout(() => setMatrixAdded(false), 1800)
  }

  // State for Quick Spec Sheet Modal
  const [previewProduct, setPreviewProduct] = useState<CatalogProduct | null>(null)

  return (
    <div className="min-h-screen bg-[#09090b] pb-20 text-zinc-100 space-y-16">
      {/* 1. Asymmetric Split Hardware Showcase */}
      <NetflixBillboard product={heroProduct} onOpenPreview={(p) => setPreviewProduct(p)} />

      {/* 2. Asymmetric 3-Cell Hardware Bento: Live Needle Matrix + CNC Rotary + Wholesale Tiers */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Cell 1 (7 Cols): Live Interactive Needle Cartridge Matrix Configurator */}
          <div className="lg:col-span-7 flex flex-col justify-between rounded-2xl border border-zinc-800/90 bg-[#121215] p-6 sm:p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 pb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                    Interactive Needle Matrix Explorer
                  </h2>
                  <p className="mt-0.5 text-xs text-zinc-400">
                    Configure needle grouping, wire gauge, and tip count for instant box dispatch
                  </p>
                </div>
                <span className="rounded-md border border-zinc-700/80 bg-zinc-900 px-2.5 py-1 font-mono text-[11px] font-bold text-zinc-200">
                  {matrixProduct?.variants?.length || 117} Pro Specs
                </span>
              </div>

              {/* Step A: Needle Configuration Group (RL / RS / RM / M1) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between font-mono text-[11px] text-zinc-400">
                  <span>01 / GROUPING CONFIGURATION</span>
                  <span className="text-zinc-200 font-bold">
                    {NEEDLE_TYPES.find((t) => t.code === selectedType)?.spec}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {NEEDLE_TYPES.map((type) => {
                    const active = selectedType === type.code
                    return (
                      <button
                        key={type.code}
                        type="button"
                        onClick={() => setSelectedType(type.code)}
                        className={`rounded-xl border p-3 text-left cursor-pointer transition-[transform,border-color,background-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] ${
                          active
                            ? 'border-[#E50914] bg-[#E50914]/12 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]'
                            : 'border-zinc-800 bg-zinc-900/70 text-zinc-300 hover:border-zinc-600'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-sm font-black">{type.code}</span>
                          {active && <span className="h-1.5 w-1.5 rounded-full bg-[#E50914]" />}
                        </div>
                        <span className="mt-1 block text-xs font-semibold text-zinc-300">
                          {type.name}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Step B: Wire Gauge (#08 / #10 / #12) */}
              <div className="space-y-2">
                <span className="block font-mono text-[11px] text-zinc-400">
                  02 / WIRE DIAMETER GAUGE
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {NEEDLE_GAUGES.map((g) => {
                    const active = selectedGauge === g.code
                    return (
                      <button
                        key={g.code}
                        type="button"
                        onClick={() => setSelectedGauge(g.code)}
                        className={`flex items-center justify-between rounded-xl border px-3.5 py-2.5 cursor-pointer transition-[transform,border-color,background-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] ${
                          active
                            ? 'border-white bg-white text-zinc-950 font-bold'
                            : 'border-zinc-800 bg-zinc-900/70 text-zinc-300 hover:border-zinc-600'
                        }`}
                      >
                        <span className="text-xs font-bold">{g.label}</span>
                        <span
                          className={`font-mono text-[11px] ${
                            active ? 'text-zinc-700' : 'text-zinc-500'
                          }`}
                        >
                          {g.mm}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Step C: Available Size Codes */}
              <div className="space-y-2">
                <div className="flex items-center justify-between font-mono text-[11px] text-zinc-400">
                  <span>03 / SELECT NEEDLE COUNT CODE</span>
                  <span>{matchingVariants.length} sizes in stock</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {matchingVariants.map((v) => {
                    const isSelected = activeVariant?.sku === v.sku
                    return (
                      <button
                        key={v.sku}
                        type="button"
                        onClick={() => setSelectedVariantSku(v.sku)}
                        className={`rounded-lg border px-3 py-1.5 font-mono text-xs cursor-pointer transition-[transform,border-color,background-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-95 ${
                          isSelected
                            ? 'border-[#E50914] bg-[#E50914] text-white font-black'
                            : 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-600 hover:text-white'
                        }`}
                      >
                        {v.code || v.size_display || v.sku}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Action Readout Bar */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-950/90 p-4">
              <div className="flex items-center gap-4">
                <div>
                  <span className="block font-mono text-[10px] uppercase text-zinc-500">
                    Active SKU
                  </span>
                  <span className="font-mono text-xs sm:text-sm font-bold text-white">
                    {activeVariant?.sku || 'BNC-03'}
                  </span>
                </div>
                <div className="border-l border-zinc-800 pl-4">
                  <span className="block font-mono text-[10px] uppercase text-zinc-500">
                    Box of 20 Pcs
                  </span>
                  <span className="font-mono text-lg font-black text-white tabular-nums">
                    {formatPrice(activeVariant?.price || matrixProduct?.price || 15.99)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleAddMatrixVariant}
                  className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold cursor-pointer transition-[transform,background-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] ${
                    matrixAdded
                      ? 'bg-emerald-500 text-zinc-950'
                      : 'bg-white text-zinc-950 hover:bg-zinc-200'
                  }`}
                >
                  {matrixAdded ? (
                    <>
                      <Check className="h-4 w-4 stroke-[2.5]" />
                      <span>Box Added</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-4 w-4 stroke-[2.2]" />
                      <span>Add Box to Bag</span>
                    </>
                  )}
                </button>

                {matrixProduct && (
                  <Link
                    to="/products/$slug"
                    params={{ slug: matrixProduct.slug }}
                    className="inline-flex items-center gap-1 rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-2.5 font-mono text-xs font-semibold text-zinc-200 transition-colors duration-150 hover:border-zinc-500 hover:text-white"
                  >
                    <span>Full Matrix</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Right Column (5 Cols): 2 Stacked Asymmetric Bento Cells */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Cell 2: CNC Wireless Rotary Hardware Spotlight */}
            <div className="flex-1 rounded-2xl border border-zinc-800/90 bg-[#121215] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] flex flex-col justify-between">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#E50914]">
                    <Crosshair className="h-3 w-3" /> CNC ROTARY ARCHITECTURE
                  </span>
                  <h3 className="text-lg font-black tracking-tight text-white line-clamp-1">
                    {rotarySpotlight.name}
                  </h3>
                  <p className="text-xs text-zinc-400 line-clamp-2">
                    Aircraft-grade aluminum chassis with brushless direct drive and dual 2400mAh
                    hot-swappable power cells.
                  </p>
                </div>

                {rotarySpotlight.image && (
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white p-2">
                    <img
                      src={rotarySpotlight.image}
                      alt={rotarySpotlight.name}
                      className="h-full w-full object-contain"
                    />
                  </div>
                )}
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-zinc-800/80 pt-4">
                <div className="flex items-center gap-3 font-mono text-xs">
                  <span className="font-black text-white tabular-nums">
                    {formatPrice(rotarySpotlight.price)}
                  </span>
                  <span className="rounded bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-300">
                    5.0V - 12.0V
                  </span>
                </div>

                <Link
                  to="/categories/$slug"
                  params={{ slug: 'papa-machines' }}
                  className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap font-mono text-xs font-bold text-zinc-200 transition-colors duration-150 hover:text-white"
                >
                  <span>Explore Machines</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Cell 3: Studio B2B Volume Pricing Matrix */}
            <div className="flex-1 rounded-2xl border border-zinc-800/90 bg-gradient-to-br from-[#16161a] to-[#0f0f12] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    STUDIO PRO ACCREDITATION
                  </span>
                  <span className="rounded bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-400">
                    Tax-Exempt B2B
                  </span>
                </div>

                <h3 className="text-lg font-black tracking-tight text-white">
                  Direct Factory Case Pricing
                </h3>

                <div className="grid grid-cols-3 gap-2 pt-1 font-mono">
                  <div className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-2.5">
                    <span className="block text-[10px] text-zinc-500">10+ Boxes</span>
                    <span className="mt-0.5 block text-sm font-black text-white">-15%</span>
                  </div>
                  <div className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-2.5">
                    <span className="block text-[10px] text-zinc-500">25+ Boxes</span>
                    <span className="mt-0.5 block text-sm font-black text-white">-25%</span>
                  </div>
                  <div className="rounded-lg border border-[#E50914]/50 bg-[#E50914]/10 p-2.5">
                    <span className="block text-[10px] text-zinc-300">50+ Case</span>
                    <span className="mt-0.5 block text-sm font-black text-white">-35%</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-2 border-t border-zinc-800/80 pt-3">
                <span className="text-[11px] text-zinc-400">
                  Same-day dispatch from Los Angeles Hub
                </span>
                <Link
                  to="/wholesale"
                  className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap font-mono text-xs font-bold text-white transition-colors duration-150 hover:text-zinc-300"
                >
                  <span>Calculate Tiers</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Dispatch Volume Ranked Shelf: Top 10 in USA Studios */}
      <section>
        <NetflixRow
          title="Most Re-Ordered by USA Studios"
          subtitle="High-turnover sterile cartridges, rotary pens, and power supplies ranked by studio dispatch volume"
          products={top10Products}
          isRanked={true}
          onOpenPreview={(p) => setPreviewProduct(p)}
        />
      </section>

      {/* 4. Precision Cartridge Needles Shelf */}
      <section>
        <NetflixRow
          title="316L Surgical Membrane Cartridges"
          subtitle="100% E.O. gas sterilized blister packs with high-tension silicone rebound membrane"
          categorySlug="papa-cartridges"
          products={cartridgeNeedles}
          onOpenPreview={(p) => setPreviewProduct(p)}
        />
      </section>

      {/* 5. Explore All Studio Categories (Taxonomy Matrix) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between border-b border-zinc-800/80 pb-4">
          <div>
            <h2 className="text-xl font-black tracking-tight text-white">
              Studio Equipment Taxonomy
            </h2>
            <p className="mt-0.5 text-xs text-zinc-400">
              Complete hardware & sterile supply catalog indexed in Saleor GraphQL
            </p>
          </div>
          <Link
            to="/categories/$slug"
            params={{ slug: 'papa-products' }}
            className="font-mono text-xs font-semibold text-zinc-400 transition-colors duration-150 hover:text-white flex items-center gap-1"
          >
            <span>Browse All 368 SKUs</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {topCategories.map((cat) => (
            <Link
              key={cat.id}
              to="/categories/$slug"
              params={{ slug: cat.slug }}
              className="studio-card-interactive group flex flex-col justify-between rounded-xl border border-zinc-800/90 bg-[#121215] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] hover:border-zinc-600"
            >
              <div>
                <div className="flex items-center justify-between font-mono text-[10px] text-zinc-500">
                  <span>INDEX #{cat.id}</span>
                  <span className="text-zinc-400 tabular-nums">{cat.product_count} SKUs</span>
                </div>
                <h3 className="mt-1.5 text-sm font-bold text-zinc-100 transition-colors duration-150 group-hover:text-white">
                  {cat.name}
                </h3>
                {cat.subcategories && cat.subcategories.length > 0 && (
                  <p className="mt-1 text-[11px] text-zinc-500 line-clamp-1">
                    {cat.subcategories.map((s) => s.name).join(', ')}
                  </p>
                )}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-zinc-800/70 pt-2.5 font-mono text-[11px] text-zinc-400 group-hover:text-white">
                <span>Open Department</span>
                <ChevronRight className="h-3.5 w-3.5 transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.5 text-[#E50914]" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. Wireless Rotary Machines Shelf */}
      <section>
        <NetflixRow
          title="Wireless Rotary Pens & Stroke Drives"
          subtitle="Coreless motors, precision stroke cams, and ergonomic CNC aluminum grips"
          categorySlug="papa-machines"
          products={wirelessMachines}
          onOpenPreview={(p) => setPreviewProduct(p)}
        />
      </section>

      {/* 7. The Savage Needles Studio Engineering Standard */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-zinc-800/90 bg-[#121215] p-6 sm:p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900">
                <Truck className="h-5 w-5 text-[#E50914]" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  LA Hub Express Dispatch
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                  Same-day UPS & DHL tracked fulfillment from our Los Angeles sterile warehouse.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900">
                <ShieldCheck className="h-5 w-5 text-[#E50914]" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  100% E.O. Gas Certified
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                  Every blister box carries lot-level sterilization indicators and 316L steel QC.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900">
                <Award className="h-5 w-5 text-[#E50914]" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  1-Year Rotary Warranty
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                  Direct factory replacement coverage on coreless motors, PCBs, and battery cells.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900">
                <Zap className="h-5 w-5 text-[#E50914]" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  Direct B2B Wholesale
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                  Up to 35% volume discounts for accredited tattoo studios and resident artists.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Floating Spec Sheet Modal */}
      <NetflixQuickPreviewModal product={previewProduct} onClose={() => setPreviewProduct(null)} />
    </div>
  )
}
