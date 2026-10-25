import catalogData from '~/data/catalog.json'

export interface CatalogCategory {
  id: string
  name: string
  slug: string
  parent_id: string | null
  product_count: number
  is_active: boolean
  children_ids: string[]
  subcategories?: CatalogCategory[]
}

export interface ProductOptionValue {
  index: string
  label: string
}

export interface ProductOption {
  id: string
  attribute_id: string
  label: string
  values: ProductOptionValue[]
}

export interface ProductChildVariant {
  id: string
  sku: string
  name: string
  price: number
  in_stock?: boolean
  stock_quantity?: number
  label?: string
  code?: string
  needle_type?: string
  needle_type_code?: string
  gauge?: string
  gauge_raw?: string
  size?: string
  size_display?: string
  attributes?: Record<string, string>
}

export interface CatalogProduct {
  id: string
  sku: string
  name: string
  slug: string
  price: number
  special_price?: number | null
  image: string
  gallery: string[]
  category_ids: string[]
  type: string
  is_needle_matrix?: boolean
  description: string
  short_description?: string
  options: ProductOption[]
  children: ProductChildVariant[]
  variants: ProductChildVariant[]
  is_visible_individually: boolean
  is_available: boolean
}

// Convert categories array or object to map
const rawCategoriesList: CatalogCategory[] = Array.isArray(catalogData.categories)
  ? (catalogData.categories as CatalogCategory[])
  : Object.values(catalogData.categories as Record<string, CatalogCategory>)

const rawCategoriesMap: Record<string, CatalogCategory> = {}
for (const cat of rawCategoriesList) {
  rawCategoriesMap[cat.id] = cat
}

interface RawCatalogProduct
  extends Omit<
    CatalogProduct,
    | 'description'
    | 'short_description'
    | 'gallery'
    | 'children'
    | 'is_visible_individually'
    | 'is_available'
  > {
  desc_idx?: number
  description?: string
  short_description?: string
  gallery?: string[]
  children?: ProductChildVariant[]
  is_visible_individually?: boolean
  is_available?: boolean
}

const descriptionsTable: string[] = Array.isArray(
  (catalogData as { descriptions?: string[] }).descriptions,
)
  ? (catalogData as { descriptions: string[] }).descriptions
  : []

const allProducts: CatalogProduct[] = (catalogData.products as unknown as RawCatalogProduct[]).map(
  (raw) => {
    const description =
      typeof raw.desc_idx === 'number'
        ? (descriptionsTable[raw.desc_idx] ?? '')
        : (raw.description ?? '')
    const variants = raw.variants ?? raw.children ?? []
    return {
      ...raw,
      description,
      short_description: raw.short_description ?? description.slice(0, 220),
      gallery: raw.gallery?.length ? raw.gallery : raw.image ? [raw.image] : [],
      variants,
      children: raw.children ?? variants,
      special_price: raw.special_price ?? null,
      is_visible_individually: raw.is_visible_individually ?? true,
      is_available: raw.is_available ?? true,
    }
  },
)

// Primary categories for Sava
export const TOP_CATEGORY_IDS = ['98', '50', '96', '97', '51', '93', '78', '70']

export function getTopCategories(): CatalogCategory[] {
  return rawCategoriesList
    .filter((c) => TOP_CATEGORY_IDS.includes(c.id) || (c.parent_id === '50' && c.product_count > 0))
    .slice(0, 8)
    .map((cat) => {
      const subcategories = (cat.children_ids || [])
        .map((childId) => rawCategoriesMap[childId])
        .filter(Boolean)
      return {
        ...cat,
        subcategories,
      }
    })
}

const CATEGORY_ALIASES: Record<string, string> = {
  'tattoo-machines': 'papa-machines',
  'tattoo-needles': 'savage-cartridges',
  'tattoo-kit': 'cartridge-grips',
  'tattoo-kits': 'cartridge-grips',
  'tattoo-power-supply': 'papa-power-supply',
  'power-supply': 'papa-power-supply',
  grips: 'cartridge-grips',
  all: 'papa-products',
}

export function getCategoryBySlug(slug: string): CatalogCategory | undefined {
  const normalized = (slug || '').toLowerCase().trim()
  const targetSlug = CATEGORY_ALIASES[normalized] || normalized

  const match = rawCategoriesList.find(
    (c) => c.slug === targetSlug || c.slug.toLowerCase() === targetSlug,
  )
  if (!match) return undefined

  const subcategories = (match.children_ids || [])
    .map((cid) => rawCategoriesMap[cid])
    .filter(Boolean)

  return {
    ...match,
    subcategories,
  }
}

export function getAllCategories(): CatalogCategory[] {
  return rawCategoriesList
}

export function getProductsByCategory(
  categorySlug: string,
  options?: {
    sortBy?: 'featured' | 'price-asc' | 'price-desc' | 'name'
    limit?: number
    offset?: number
  },
): {
  products: CatalogProduct[]
  total: number
  category?: CatalogCategory
} {
  const category = getCategoryBySlug(categorySlug)

  let matched: CatalogProduct[] = []
  if (category) {
    const candidateCids = new Set<string>([category.id, ...(category.children_ids || [])])
    matched = allProducts.filter((p) => p.category_ids.some((cid) => candidateCids.has(cid)))
  } else {
    matched = allProducts
  }

  // Fallback if empty
  if (matched.length === 0 && category) {
    matched = allProducts.filter((p) => p.name.toLowerCase().includes(category.name.toLowerCase()))
  }

  const sortBy = options?.sortBy || 'featured'
  if (sortBy === 'price-asc') {
    matched.sort((a, b) => a.price - b.price)
  } else if (sortBy === 'price-desc') {
    matched.sort((a, b) => b.price - a.price)
  } else if (sortBy === 'name') {
    matched.sort((a, b) => a.name.localeCompare(b.name))
  } else {
    matched.sort((a, b) => {
      const aScore = (a.image ? 10 : 0) + (a.variants.length > 1 ? 5 : 0) + (a.price > 0 ? 2 : 0)
      const bScore = (b.image ? 10 : 0) + (b.variants.length > 1 ? 5 : 0) + (b.price > 0 ? 2 : 0)
      return bScore - aScore
    })
  }

  const offset = options?.offset || 0
  const limit = options?.limit || matched.length

  return {
    products: matched.slice(offset, offset + limit),
    total: matched.length,
    category,
  }
}

export function getProductBySlug(slugOrSku: string): CatalogProduct | undefined {
  return (
    allProducts.find((p) => p.slug === slugOrSku) ||
    allProducts.find((p) => p.sku.toLowerCase() === slugOrSku.toLowerCase()) ||
    allProducts.find((p) => p.id === slugOrSku)
  )
}

export function getFeaturedProducts(limit = 8): CatalogProduct[] {
  return allProducts.filter((p) => p.image && p.price > 0).slice(0, limit)
}

export function searchProducts(query: string, limit = 20): CatalogProduct[] {
  if (!query || query.trim() === '') return []
  const q = query.toLowerCase().trim()

  return allProducts
    .filter((p) => {
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        (p.description?.toLowerCase().includes(q) ?? false)
      )
    })
    .slice(0, limit)
}

export function getHeroProduct(): CatalogProduct {
  const hero =
    allProducts.find(
      (p) =>
        p.image &&
        (p.name.toLowerCase().includes('papa pen v3') ||
          p.name.toLowerCase().includes('papa adjustable') ||
          p.name.toLowerCase().includes('savage tattoo needle')),
    ) || allProducts[0]
  return hero
}

export function getTop10Products(): CatalogProduct[] {
  return allProducts
    .filter(
      (p) =>
        p.image &&
        p.price > 0 &&
        (p.name.toLowerCase().includes('papa') ||
          p.name.toLowerCase().includes('savage') ||
          p.name.toLowerCase().includes('cartridge') ||
          p.name.toLowerCase().includes('grip')),
    )
    .slice(0, 10)
}

export function getWirelessMachines(limit = 12): CatalogProduct[] {
  return allProducts
    .filter(
      (p) =>
        p.image &&
        (p.name.toLowerCase().includes('pen') ||
          p.name.toLowerCase().includes('machine') ||
          p.name.toLowerCase().includes('rotary')),
    )
    .slice(0, limit)
}

export function getCartridgeNeedles(limit = 12): CatalogProduct[] {
  return allProducts
    .filter(
      (p) =>
        p.image &&
        (p.name.toLowerCase().includes('cartridge') ||
          p.name.toLowerCase().includes('liner') ||
          p.name.toLowerCase().includes('shader') ||
          p.name.toLowerCase().includes('magnum')),
    )
    .slice(0, limit)
}

export function getPowerSupplies(limit = 12): CatalogProduct[] {
  return allProducts
    .filter(
      (p) =>
        p.name.toLowerCase().includes('power') ||
        p.name.toLowerCase().includes('volt') ||
        p.name.toLowerCase().includes('battery'),
    )
    .slice(0, limit)
}

export function getTattooKits(limit = 12): CatalogProduct[] {
  return allProducts
    .filter(
      (p) =>
        p.name.toLowerCase().includes('grip') ||
        p.name.toLowerCase().includes('stencil') ||
        p.name.toLowerCase().includes('case'),
    )
    .slice(0, limit)
}

export function getRelatedProducts(product: CatalogProduct, limit = 6): CatalogProduct[] {
  const currentCids = new Set(product.category_ids)
  const isMachine =
    product.name.toLowerCase().includes('machine') ||
    product.name.toLowerCase().includes('pen') ||
    product.name.toLowerCase().includes('rotary')

  return allProducts
    .filter((p) => {
      if (p.id === product.id || !p.image || p.price <= 0) {
        return false
      }
      if (isMachine) {
        const isNeedle =
          p.name.toLowerCase().includes('cartridge') || p.name.toLowerCase().includes('needle')
        const isPower =
          p.name.toLowerCase().includes('battery') || p.name.toLowerCase().includes('power')
        if (isNeedle || isPower) return true
      }
      return p.category_ids.some((cid) => currentCids.has(cid))
    })
    .slice(0, limit)
}
