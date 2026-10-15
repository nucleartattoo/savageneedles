import { Check, Compass, Info, Layers, ShieldCheck, Sparkles, Zap } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { CatalogProduct, ProductChildVariant } from '~/lib/catalog'
import { formatPrice } from '~/lib/utils'

interface TattooNeedleSelectorProps {
  product: CatalogProduct
  selectedVariant: ProductChildVariant | null
  onSelectVariant: (variant: ProductChildVariant) => void
}

interface NeedleTypeConfig {
  key: string
  code: string
  name: string
  shortDesc: string
  iconLabel: string
}

const NEEDLE_TYPES: NeedleTypeConfig[] = [
  {
    key: 'Round Liner',
    code: 'RL',
    name: 'Round Liner',
    shortDesc: 'Tight lining, fine line & dotwork',
    iconLabel: 'RL',
  },
  {
    key: 'Round Shader',
    code: 'RS',
    name: 'Round Shader',
    shortDesc: 'Small shading, fill & bold line',
    iconLabel: 'RS',
  },
  {
    key: 'Round Magnum',
    code: 'RM',
    name: 'Curved Magnum',
    shortDesc: 'Soft blending, realism & grey wash',
    iconLabel: 'RM',
  },
  {
    key: 'Magnum',
    code: 'M1',
    name: 'Standard Magnum',
    shortDesc: 'Color packing & heavy saturation',
    iconLabel: 'M1',
  },
]

interface GaugeConfig {
  key: string
  label: string
  diameter: string
  desc: string
}

const GAUGES: GaugeConfig[] = [
  {
    key: '#8 Bugpin',
    label: '#08 Bugpin',
    diameter: '0.25mm',
    desc: 'Ultra-fine, minimal trauma',
  },
  {
    key: '#10 Bugpin',
    label: '#10 Bugpin',
    diameter: '0.30mm',
    desc: 'Realism & silky shading',
  },
  {
    key: '#12 Standard',
    label: '#12 Standard',
    diameter: '0.35mm',
    desc: 'Classic bold & fast packing',
  },
]

export function TattooNeedleSelector({
  product,
  selectedVariant,
  onSelectVariant,
}: TattooNeedleSelectorProps) {
  const variants = product.variants || []

  // Extract initial type and gauge from current selectedVariant or defaults
  const [selectedType, setSelectedType] = useState<string>(() => {
    return selectedVariant?.needle_type || 'Round Liner'
  })

  const [selectedGauge, setSelectedGauge] = useState<string>(() => {
    if (selectedVariant?.gauge_raw) {
      if (selectedVariant.gauge_raw.includes('8')) return '#8 Bugpin'
      if (selectedVariant.gauge_raw.includes('10')) return '#10 Bugpin'
      if (selectedVariant.gauge_raw.includes('12')) return '#12 Standard'
    }
    return '#10 Bugpin'
  })

  // Filter available variants matching current Type and Gauge
  const matchingVariants = useMemo(() => {
    return variants
      .filter((v) => {
        const typeMatch = v.needle_type === selectedType
        const rawG = v.gauge_raw || ''
        const gaugeMatch =
          (selectedGauge === '#8 Bugpin' && (rawG.includes('8') || rawG.includes('08'))) ||
          (selectedGauge === '#10 Bugpin' && rawG.includes('10')) ||
          (selectedGauge === '#12 Standard' && rawG.includes('12'))
        return typeMatch && gaugeMatch
      })
      .sort((a, b) => {
        const numA = parseInt(a.size || '0', 10)
        const numB = parseInt(b.size || '0', 10)
        return numA - numB
      })
  }, [variants, selectedType, selectedGauge])

  // Sync selected variant when type/gauge changes if current selection is outside match
  useEffect(() => {
    if (matchingVariants.length > 0) {
      const isCurrentStillValid = matchingVariants.some((v) => v.id === selectedVariant?.id)
      if (!isCurrentStillValid) {
        // Pick median or first size
        const defaultVar = matchingVariants[Math.min(1, matchingVariants.length - 1)]
        onSelectVariant(defaultVar)
      }
    }
  }, [matchingVariants, selectedVariant?.id, onSelectVariant])

  const activeTypeConfig =
    NEEDLE_TYPES.find((t) => t.key === selectedType) || NEEDLE_TYPES[0]
  const activeGaugeConfig =
    GAUGES.find((g) => g.key === selectedGauge) || GAUGES[1]

  return (
    <div className="space-y-6 rounded-2xl border border-zinc-800 bg-[#161616] p-5 shadow-xl">
      {/* 1. Header with Badge & Info */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded bg-red-600 text-[10px] font-black text-white">
            ★
          </span>
          <span className="text-xs font-black uppercase tracking-wider text-white">
            Savage Professional Needle Matrix
          </span>
        </div>
        <span className="text-[11px] font-mono font-medium text-zinc-400">
          117 Pro Studio Configurations
        </span>
      </div>

      {/* 2. Step 1: Needle Type Selector (RL / RS / RM / M1) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-600/20 text-red-400 text-[10px] font-bold">
              1
            </span>
            Needle Configuration (Group Type)
          </span>
          <span className="font-semibold text-amber-400 text-[11px]">
            {activeTypeConfig.name} ({activeTypeConfig.code})
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {NEEDLE_TYPES.map((t) => {
            const isSelected = selectedType === t.key
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setSelectedType(t.key)}
                className={`relative flex flex-col items-start p-3 rounded-xl border text-left transition duration-150 cursor-pointer ${
                  isSelected
                    ? 'border-red-600 bg-red-600/10 text-white shadow-sm ring-1 ring-red-600/40'
                    : 'border-zinc-800 bg-[#1f1f1f]/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <span
                    className={`rounded px-1.5 py-0.5 font-mono text-[11px] font-black tracking-wider ${
                      isSelected ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-300'
                    }`}
                  >
                    {t.code}
                  </span>
                  {isSelected && <Check className="h-3.5 w-3.5 text-red-500 stroke-[3]" />}
                </div>
                <span className="mt-2 text-xs font-bold text-white leading-tight">
                  {t.name}
                </span>
                <span className="mt-1 text-[10px] text-zinc-400 line-clamp-1 leading-snug">
                  {t.shortDesc}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 3. Step 2: Gauge / Wire Diameter Selector */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-600/20 text-red-400 text-[10px] font-bold">
              2
            </span>
            Needle Gauge & Wire Diameter
          </span>
          <span className="font-semibold text-emerald-400 text-[11px]">
            {activeGaugeConfig.label} ({activeGaugeConfig.diameter})
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {GAUGES.map((g) => {
            const isSelected = selectedGauge === g.key
            return (
              <button
                key={g.key}
                type="button"
                onClick={() => setSelectedGauge(g.key)}
                className={`flex items-center justify-between p-3 rounded-xl border transition duration-150 cursor-pointer ${
                  isSelected
                    ? 'border-emerald-500/80 bg-emerald-500/10 text-white ring-1 ring-emerald-500/30'
                    : 'border-zinc-800 bg-[#1f1f1f]/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-white">{g.label}</span>
                    <span className="rounded bg-zinc-800 px-1.5 py-0.2 font-mono text-[10px] text-zinc-300">
                      {g.diameter}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[10px] text-zinc-400">{g.desc}</p>
                </div>
                {isSelected && <Check className="h-4 w-4 text-emerald-400 shrink-0 stroke-[2.5]" />}
              </button>
            )
          })}
        </div>
      </div>

      {/* 4. Step 3: Needle Size Matrix (Industry Standard Codes) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-600/20 text-red-400 text-[10px] font-bold">
              3
            </span>
            Needle Size & Grouping (Count)
          </span>
          <span className="font-mono text-zinc-400 text-[11px]">
            {matchingVariants.length} Sizes Available
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {matchingVariants.map((v) => {
            const isSelected = selectedVariant?.id === v.id
            const displayCode = v.code || `${v.size}${activeTypeConfig.code}`

            return (
              <button
                key={v.id}
                type="button"
                onClick={() => onSelectVariant(v)}
                className={`group flex flex-col items-center justify-center rounded-xl border p-2.5 transition duration-150 cursor-pointer ${
                  isSelected
                    ? 'border-red-600 bg-red-600 text-white shadow-md shadow-red-900/40 ring-2 ring-red-400'
                    : 'border-zinc-800 bg-[#1e1e1e] text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800'
                }`}
              >
                <span
                  className={`font-mono text-sm font-black tracking-tight ${
                    isSelected ? 'text-white' : 'text-white group-hover:text-amber-400'
                  }`}
                >
                  {displayCode}
                </span>
                <span
                  className={`mt-0.5 text-[10px] font-medium ${
                    isSelected ? 'text-red-100' : 'text-zinc-400'
                  }`}
                >
                  {v.size} Needles
                </span>
                <span
                  className={`mt-1 font-mono text-[11px] font-black ${
                    isSelected ? 'text-white' : 'text-amber-400'
                  }`}
                >
                  {formatPrice(v.price)}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 5. Selected Spec Summary & Studio Certification Card */}
      {selectedVariant && (
        <div className="rounded-xl border border-zinc-700/60 bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-black p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="rounded bg-red-600/20 border border-red-500/40 px-2 py-0.5 font-mono text-xs font-black text-red-400">
                SKU: {selectedVariant.sku}
              </span>
              <span className="font-mono text-sm font-black text-white">
                CODE: {selectedVariant.code || selectedVariant.size_display}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>In Stock • Ready to Dispatch</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1">
            <div className="rounded bg-zinc-800/60 p-2">
              <span className="text-zinc-500 block text-[10px] uppercase font-semibold">
                Configuration
              </span>
              <span className="font-bold text-white">
                {activeTypeConfig.name} ({activeTypeConfig.code})
              </span>
            </div>
            <div className="rounded bg-zinc-800/60 p-2">
              <span className="text-zinc-500 block text-[10px] uppercase font-semibold">
                Diameter
              </span>
              <span className="font-bold text-white">
                {activeGaugeConfig.diameter} ({activeGaugeConfig.label})
              </span>
            </div>
            <div className="rounded bg-zinc-800/60 p-2">
              <span className="text-zinc-500 block text-[10px] uppercase font-semibold">
                Packaging
              </span>
              <span className="font-bold text-white">20 Pcs / Box (Sterile)</span>
            </div>
            <div className="rounded bg-zinc-800/60 p-2">
              <span className="text-zinc-500 block text-[10px] uppercase font-semibold">
                Safety Feature
              </span>
              <span className="font-bold text-white">Full Safety Membrane</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
