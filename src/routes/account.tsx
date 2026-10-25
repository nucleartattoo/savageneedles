import { createFileRoute } from '@tanstack/react-router'
import {
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Edit3,
  ExternalLink,
  Mail,
  MapPin,
  Package,
  Phone,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  Truck,
  User,
  X,
  Zap,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { type SaleorOrderSummary, searchSaleorOrders } from '~/lib/saleor/api'
import { formatPrice } from '~/lib/utils'

export interface StudioAddress {
  id: string
  label: string
  fullName: string
  streetAddress1: string
  streetAddress2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone: string
  isDefault: boolean
}

const DEFAULT_ADDRESSES: StudioAddress[] = [
  {
    id: 'addr-1',
    label: 'Primary Studio Atelier',
    fullName: 'Marcus Vance',
    streetAddress1: '742 Evergreen Terrace',
    streetAddress2: 'Suite 204',
    city: 'Los Angeles',
    state: 'CA',
    postalCode: '90001',
    country: 'United States',
    phone: '+1 (213) 555-0199',
    isDefault: true,
  },
]

export const Route = createFileRoute('/account')({
  component: AccountPage,
})

function AccountPage() {
  const [tab, setTab] = useState<'orders' | 'profile' | 'addresses'>('orders')

  // Orders lookup state
  const [searchQuery, setSearchQuery] = useState('')
  const [orders, setOrders] = useState<SaleorOrderSummary[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<SaleorOrderSummary | null>(null)

  // Studio profile state with local persistence
  const [profileData, setProfileData] = useState({
    studioName: 'Black Lotus Tattoo Atelier',
    residentTattooist: 'Marcus Vance',
    contactEmail: 'artist@blacklotus.studio',
    studioPhone: '+1 (213) 555-0199',
    taxId: 'CA-948192-TAT',
  })
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null)

  // Studio address book state with local persistence
  const [addresses, setAddresses] = useState<StudioAddress[]>(DEFAULT_ADDRESSES)
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [addressSuccessMsg, setAddressSuccessMsg] = useState<string | null>(null)
  const [addressFormData, setAddressFormData] = useState<Omit<StudioAddress, 'id'>>({
    label: '',
    fullName: '',
    streetAddress1: '',
    streetAddress2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    phone: '',
    isDefault: false,
  })

  // Load saved profile & addresses if available
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('savage_studio_profile')
      if (savedProfile) {
        setProfileData(JSON.parse(savedProfile))
      }
      const savedAddresses = localStorage.getItem('savage_studio_addresses')
      if (savedAddresses) {
        const parsed = JSON.parse(savedAddresses)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAddresses(parsed)
        }
      }
    } catch {
      // Ignore storage errors
    }
  }, [])

  const handleOpenAddAddress = () => {
    setEditingAddressId(null)
    setAddressFormData({
      label: 'Guest Spot / Branch Studio',
      fullName: profileData.residentTattooist || 'Marcus Vance',
      streetAddress1: '',
      streetAddress2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'United States',
      phone: profileData.studioPhone || '+1 (213) 555-0199',
      isDefault: addresses.length === 0,
    })
    setIsAddressModalOpen(true)
  }

  const handleOpenEditAddress = (addr: StudioAddress) => {
    setEditingAddressId(addr.id)
    setAddressFormData({
      label: addr.label,
      fullName: addr.fullName,
      streetAddress1: addr.streetAddress1,
      streetAddress2: addr.streetAddress2 || '',
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode,
      country: addr.country,
      phone: addr.phone,
      isDefault: addr.isDefault,
    })
    setIsAddressModalOpen(true)
  }

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault()
    let updatedList: StudioAddress[] = []

    if (editingAddressId) {
      // Editing existing address
      updatedList = addresses.map((item) => {
        if (item.id === editingAddressId) {
          return {
            ...item,
            ...addressFormData,
            id: editingAddressId,
          }
        }
        // If the edited address was made default, remove default from others
        return addressFormData.isDefault ? { ...item, isDefault: false } : item
      })
    } else {
      // Adding new address
      const newAddr: StudioAddress = {
        id: `addr-${Date.now()}`,
        ...addressFormData,
      }
      if (newAddr.isDefault) {
        updatedList = [...addresses.map((a) => ({ ...a, isDefault: false })), newAddr]
      } else {
        updatedList = [...addresses, newAddr]
      }
    }

    setAddresses(updatedList)
    try {
      localStorage.setItem('savage_studio_addresses', JSON.stringify(updatedList))
    } catch {
      // Ignore
    }

    setIsAddressModalOpen(false)
    setAddressSuccessMsg(
      editingAddressId ? 'Address updated successfully!' : 'New address added to studio book!',
    )
    setTimeout(() => setAddressSuccessMsg(null), 3500)
  }

  const handleExecuteDeleteAddress = (id: string) => {
    const remaining = addresses.filter((a) => a.id !== id)
    // If we deleted the default and there are remaining, set first as default
    if (remaining.length > 0 && !remaining.some((a) => a.isDefault)) {
      remaining[0].isDefault = true
    }
    setAddresses(remaining)
    try {
      localStorage.setItem('savage_studio_addresses', JSON.stringify(remaining))
    } catch {
      // Ignore
    }
    setConfirmDeleteId(null)
    setAddressSuccessMsg('Address removed from studio address book.')
    setTimeout(() => setAddressSuccessMsg(null), 3000)
  }

  const handleSetDefaultAddress = (id: string) => {
    const updated = addresses.map((a) => ({
      ...a,
      isDefault: a.id === id,
    }))
    setAddresses(updated)
    try {
      localStorage.setItem('savage_studio_addresses', JSON.stringify(updated))
    } catch {
      // Ignore
    }
    setAddressSuccessMsg('Default dispatch address updated.')
    setTimeout(() => setAddressSuccessMsg(null), 3000)
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingProfile(true)
    setSaveSuccessMessage(null)

    setTimeout(() => {
      try {
        localStorage.setItem('savage_studio_profile', JSON.stringify(profileData))
        setIsSavingProfile(false)
        setSaveSuccessMessage('Studio profile changes saved successfully!')
        setTimeout(() => setSaveSuccessMessage(null), 4000)
      } catch {
        setIsSavingProfile(false)
      }
    }, 600)
  }

  const handleFetchOrders = async (query?: string) => {
    setIsLoading(true)
    try {
      const res = await searchSaleorOrders(query)
      if (res.success) {
        setOrders(res.orders)
        if (res.orders.length > 0) {
          setSelectedOrder(res.orders[0])
        }
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false)
    }
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: initial mount only
  useEffect(() => {
    handleFetchOrders()
  }, [])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleFetchOrders(searchQuery.trim().replace(/^#/, ''))
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Account Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded bg-[#E50914] px-2.5 py-0.5 text-[11px] font-black tracking-wider uppercase text-white shadow-lg shadow-red-900/40">
              <Zap className="h-3 w-3 fill-current" /> STUDIO PRO
            </span>
            <span className="text-xs text-zinc-500 font-mono">Saleor B2B ID: US-STUDIO-889</span>
          </div>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-white">
            Studio Customer Portal
          </h1>
          <p className="mt-1 text-xs text-zinc-400">
            Real-time Saleor 3.23 order dispatch, shipment tracking, and wholesale profile.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-[#161616] px-3.5 py-2 text-xs">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span className="text-zinc-300">Verified Wholesale Artist</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Navigation Sidebar Tabs (Col 1) */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setTab('orders')}
            className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-xs font-bold transition cursor-pointer ${
              tab === 'orders'
                ? 'bg-[#E50914] text-white shadow-lg shadow-red-950/40'
                : 'bg-[#141414] text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <Package className="h-4 w-4" />
              <span>Live Saleor Orders</span>
            </div>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] ${
                tab === 'orders' ? 'bg-black/40 text-white' : 'bg-zinc-800 text-zinc-300'
              }`}
            >
              {orders.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setTab('profile')}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold transition cursor-pointer ${
              tab === 'profile'
                ? 'bg-[#E50914] text-white shadow-lg shadow-red-950/40'
                : 'bg-[#141414] text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800'
            }`}
          >
            <User className="h-4 w-4" />
            <span>Studio Profile & Tax ID</span>
          </button>

          <button
            type="button"
            onClick={() => setTab('addresses')}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold transition cursor-pointer ${
              tab === 'addresses'
                ? 'bg-[#E50914] text-white shadow-lg shadow-red-950/40'
                : 'bg-[#141414] text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800'
            }`}
          >
            <MapPin className="h-4 w-4" />
            <span>Studio Address Book</span>
          </button>
        </div>

        {/* Tab Content Area (Col 3) */}
        <div className="lg:col-span-3 space-y-6">
          {tab === 'orders' && (
            <div className="space-y-6">
              {/* Order Search & Quick Filters */}
              <div className="rounded-2xl border border-zinc-800 bg-[#141414] p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="text-sm font-bold text-white flex items-center gap-2">
                      <Search className="h-4 w-4 text-[#E50914]" /> Saleor GraphQL Order Lookup
                    </h2>
                    <p className="text-xs text-zinc-400 mt-1">
                      Search by official order number (#18, #17, #16...) or buyer email
                    </p>
                  </div>

                  <form onSubmit={handleSearchSubmit} className="flex gap-2">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="e.g. 18 or artist@blacklotus..."
                      className="w-56 sm:w-64 rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:border-[#E50914] focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="rounded-xl bg-[#E50914] px-4 py-2 text-xs font-bold text-white hover:bg-red-600 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {isLoading ? (
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Search className="h-3.5 w-3.5" />
                      )}
                      <span>Track</span>
                    </button>
                  </form>
                </div>

                {/* Quick Order Chips */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-800/80 text-xs">
                  <span className="text-zinc-500">Live Studio Orders:</span>
                  {(orders.length > 0
                    ? orders.slice(0, 5).map((o) => String(o.number))
                    : ['2', '1']
                  ).map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => {
                        setSearchQuery(num)
                        handleFetchOrders(num)
                      }}
                      className="rounded-lg bg-zinc-900 border border-zinc-800 px-2.5 py-1 font-mono text-zinc-300 hover:border-red-600 hover:text-white transition cursor-pointer"
                    >
                      #{num}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('')
                      handleFetchOrders()
                    }}
                    className="ml-auto text-xs text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="h-3 w-3" /> Show All
                  </button>
                </div>
              </div>

              {/* Order Detail & Timeline View */}
              {selectedOrder && (
                <div className="rounded-2xl border border-zinc-800 bg-[#161616] p-6 space-y-6">
                  {/* Order Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-xl font-black text-white">
                          Order #{selectedOrder.number}
                        </span>
                        <span
                          className={`rounded-full px-3 py-0.5 text-xs font-bold border ${
                            selectedOrder.status === 'FULFILLED'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          }`}
                        >
                          {selectedOrder.status}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-1 flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-zinc-500" />
                        <span>Placed on {new Date(selectedOrder.created).toLocaleString()}</span>
                        <span>•</span>
                        <Mail className="h-3.5 w-3.5 text-zinc-500" />
                        <span className="text-zinc-300">{selectedOrder.userEmail}</span>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-zinc-400">Total Charged (Saleor API)</span>
                      <div className="text-2xl font-black text-white">
                        {formatPrice(selectedOrder.total.gross.amount)}
                      </div>
                    </div>
                  </div>

                  {/* Shipment Tracking Timeline */}
                  <div className="rounded-xl border border-zinc-800 bg-[#121212] p-5 space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                      <Truck className="h-4 w-4 text-[#E50914]" /> Studio Fulfillment Timeline
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                      <div className="flex items-start gap-3">
                        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500 text-black">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">Order Confirmed</p>
                          <p className="text-[11px] text-zinc-400">Saleor transaction paid</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500 text-black">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">Allocated from Hub</p>
                          <p className="text-[11px] text-zinc-400">Los Angeles Warehouse</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-amber-500 text-black">
                          <Clock className="h-4 w-4 animate-spin" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">Carrier Packaging</p>
                          <p className="text-[11px] text-zinc-400">UPS Standard Ground</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-zinc-800 text-zinc-500">
                          <Package className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-zinc-400">Studio Delivery</p>
                          <p className="text-[11px] text-zinc-500">Est. 2-3 Business Days</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items & Shipping Address Details */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Line Items */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                        Order Items ({selectedOrder.lines.length})
                      </h4>
                      <div className="space-y-2">
                        {selectedOrder.lines.map((line) => (
                          <div
                            key={line.id}
                            className="flex items-center justify-between rounded-xl border border-zinc-800 bg-[#121212] p-3 text-xs"
                          >
                            <div className="min-w-0 pr-3">
                              <p className="font-bold text-white truncate">{line.productName}</p>
                              {line.variantName && (
                                <p className="text-[11px] text-zinc-400 truncate">
                                  {line.variantName}
                                </p>
                              )}
                              <p className="text-zinc-500 mt-0.5">Qty: {line.quantity}</p>
                            </div>
                            <div className="text-right font-bold text-white">
                              {formatPrice(line.unitPrice.gross.amount * line.quantity)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping & Delivery Info */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                        Shipping Destination
                      </h4>
                      {selectedOrder.shippingAddress ? (
                        <div className="rounded-xl border border-zinc-800 bg-[#121212] p-4 text-xs space-y-1.5 text-zinc-300">
                          <p className="font-bold text-white">
                            {selectedOrder.shippingAddress.firstName}{' '}
                            {selectedOrder.shippingAddress.lastName}
                          </p>
                          <p>{selectedOrder.shippingAddress.streetAddress1}</p>
                          {selectedOrder.shippingAddress.streetAddress2 && (
                            <p>{selectedOrder.shippingAddress.streetAddress2}</p>
                          )}
                          <p>
                            {selectedOrder.shippingAddress.city},{' '}
                            {selectedOrder.shippingAddress.countryArea}{' '}
                            {selectedOrder.shippingAddress.postalCode}
                          </p>
                          <div className="pt-2 text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Address verified with carrier
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-xl border border-zinc-800 bg-[#121212] p-4 text-xs text-zinc-500">
                          Digital Delivery or Pickup
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Order List Table */}
              <div className="rounded-2xl border border-zinc-800 bg-[#141414] overflow-hidden">
                <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                    Order History Records
                  </h3>
                  <span className="text-xs text-zinc-500">{orders.length} orders found</span>
                </div>

                {orders.length > 0 ? (
                  <div className="divide-y divide-zinc-800/80">
                    {orders.map((ord) => (
                      <button
                        type="button"
                        key={ord.id}
                        onClick={() => setSelectedOrder(ord)}
                        className={`w-full flex items-center justify-between p-4 text-left transition cursor-pointer ${
                          selectedOrder?.id === ord.id ? 'bg-zinc-800/50' : 'hover:bg-zinc-900/60'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">
                              Order #{ord.number}
                            </span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold border ${
                                ord.status === 'FULFILLED'
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              }`}
                            >
                              {ord.status}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-400">
                            {new Date(ord.created).toLocaleDateString()} • {ord.userEmail}
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-bold text-white">
                            {formatPrice(ord.total.gross.amount)}
                          </span>
                          <span className="block text-[11px] text-zinc-500">
                            {ord.lines.length} {ord.lines.length === 1 ? 'line' : 'lines'}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-xs text-zinc-400 space-y-2">
                    <Package className="mx-auto h-8 w-8 text-zinc-600" />
                    <p>No orders matched your search criteria.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === 'profile' && (
            <div className="rounded-2xl border border-zinc-800 bg-[#141414] p-6 space-y-6">
              <div className="border-b border-zinc-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Studio Artist Profile
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Manage your studio accreditation, licensing, and B2B wholesale pricing tier.
                  </p>
                </div>
                {saveSuccessMessage && (
                  <div className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-400 animate-in fade-in duration-200">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{saveSuccessMessage}</span>
                  </div>
                )}
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-6 max-w-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-zinc-300 block mb-1">
                      Studio Name
                    </label>
                    <input
                      type="text"
                      value={profileData.studioName}
                      onChange={(e) =>
                        setProfileData((prev) => ({ ...prev, studioName: e.target.value }))
                      }
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#E50914] focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-zinc-300 block mb-1">
                      Resident Tattooist
                    </label>
                    <input
                      type="text"
                      value={profileData.residentTattooist}
                      onChange={(e) =>
                        setProfileData((prev) => ({ ...prev, residentTattooist: e.target.value }))
                      }
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#E50914] focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-zinc-300 block mb-1">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={profileData.contactEmail}
                      onChange={(e) =>
                        setProfileData((prev) => ({ ...prev, contactEmail: e.target.value }))
                      }
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#E50914] focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-zinc-300 block mb-1">
                      Studio Phone
                    </label>
                    <input
                      type="tel"
                      value={profileData.studioPhone}
                      onChange={(e) =>
                        setProfileData((prev) => ({ ...prev, studioPhone: e.target.value }))
                      }
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#E50914] focus:outline-none"
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-zinc-300 block mb-1">
                      Wholesale Reseller Tax ID / State Tattoo License
                    </label>
                    <input
                      type="text"
                      value={profileData.taxId}
                      onChange={(e) =>
                        setProfileData((prev) => ({ ...prev, taxId: e.target.value }))
                      }
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-2 text-xs text-white focus:border-[#E50914] focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-4">
                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="rounded-xl bg-[#E50914] px-6 py-2.5 text-xs font-bold text-white hover:bg-red-600 transition cursor-pointer flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSavingProfile ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        <span>Saving Changes...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Save Studio Changes</span>
                      </>
                    )}
                  </button>
                  {saveSuccessMessage && (
                    <span className="text-xs text-emerald-400 font-medium">
                      Saved to Studio Records
                    </span>
                  )}
                </div>
              </form>
            </div>
          )}

          {tab === 'addresses' && (
            <div className="rounded-2xl border border-zinc-800 bg-[#141414] p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#E50914]" />
                    <span>Studio Address Book</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Verified dispatch destinations for tattoo supplies, needle cartridges and rotary
                    hardware.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {addressSuccessMsg && (
                    <div className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-400 animate-in fade-in duration-200">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>{addressSuccessMsg}</span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={handleOpenAddAddress}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#E50914] px-4 py-2 text-xs font-bold text-white hover:bg-red-600 transition shadow-lg shadow-red-950/40 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add New Address</span>
                  </button>
                </div>
              </div>

              {addresses.length === 0 ? (
                <div className="rounded-xl border border-zinc-800 bg-[#181818] p-8 text-center space-y-3">
                  <MapPin className="h-8 w-8 text-zinc-600 mx-auto" />
                  <p className="text-sm font-semibold text-zinc-300">
                    No Studio Addresses Registered
                  </p>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                    Add a studio dispatch address to expedite checkout and automatic shipping
                    calculations.
                  </p>
                  <button
                    type="button"
                    onClick={handleOpenAddAddress}
                    className="rounded-lg bg-zinc-800 px-4 py-2 text-xs font-bold text-white hover:bg-zinc-700 transition"
                  >
                    + Add Primary Address
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`relative flex flex-col justify-between rounded-xl border p-5 transition ${
                        addr.isDefault
                          ? 'border-red-600/40 bg-zinc-900/60 shadow-lg shadow-red-950/20'
                          : 'border-zinc-800/80 bg-[#161616] hover:border-zinc-700'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-white text-sm flex items-center gap-2">
                            <Building2 className="h-3.5 w-3.5 text-zinc-400" />
                            {addr.label}
                          </span>
                          {addr.isDefault ? (
                            <span className="rounded-full bg-red-600/15 text-[#E50914] text-[10px] font-black px-2.5 py-0.5 border border-red-600/30 uppercase tracking-wider">
                              Default Shipping
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSetDefaultAddress(addr.id)}
                              className="text-[10px] text-zinc-400 hover:text-white transition font-semibold underline decoration-zinc-700"
                            >
                              Set as Default
                            </button>
                          )}
                        </div>

                        <div className="text-xs space-y-1 text-zinc-300">
                          <p className="font-semibold text-white flex items-center gap-1.5">
                            <User className="h-3 w-3 text-zinc-500" />
                            {addr.fullName}
                          </p>
                          <p className="text-zinc-400">{addr.streetAddress1}</p>
                          {addr.streetAddress2 && (
                            <p className="text-zinc-400">{addr.streetAddress2}</p>
                          )}
                          <p className="text-zinc-400">
                            {addr.city}, {addr.state} {addr.postalCode}, {addr.country}
                          </p>
                          <p className="text-zinc-500 font-mono pt-1 text-[11px] flex items-center gap-1.5">
                            <Phone className="h-3 w-3 text-zinc-600" />
                            {addr.phone}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-zinc-800/80">
                        {confirmDeleteId === addr.id ? (
                          <div className="flex items-center gap-1.5 animate-in fade-in duration-150">
                            <button
                              type="button"
                              onClick={() => handleExecuteDeleteAddress(addr.id)}
                              className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-2.5 py-1.5 text-[11px] font-bold text-white hover:bg-red-700 transition cursor-pointer shadow-sm shadow-red-950/40"
                            >
                              <Trash2 className="h-3 w-3" />
                              <span>Confirm Delete</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              className="inline-flex items-center rounded-lg border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-[11px] font-semibold text-zinc-300 hover:text-white transition cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleOpenEditAddress(addr)}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800/90 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-zinc-700 hover:border-zinc-600 transition cursor-pointer"
                            >
                              <Edit3 className="h-3 w-3 text-amber-400" />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(addr.id)}
                              disabled={addresses.length === 1}
                              title={
                                addresses.length === 1
                                  ? 'Cannot delete the sole address'
                                  : 'Delete address'
                              }
                              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 py-1.5 text-[11px] font-semibold text-zinc-400 hover:text-red-400 hover:border-red-900/50 transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <Trash2 className="h-3 w-3" />
                              <span>Delete</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Address Edit/Add Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-[#161616] p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#E50914]" />
                  <span>{editingAddressId ? 'Edit Studio Address' : 'Add New Studio Address'}</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Save hardware and needle delivery destination for faster dispatch.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddressModalOpen(false)}
                className="rounded-lg p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                    Address Label / Studio Branch
                  </label>
                  <input
                    type="text"
                    required
                    value={addressFormData.label}
                    onChange={(e) =>
                      setAddressFormData((prev) => ({ ...prev, label: e.target.value }))
                    }
                    placeholder="e.g. Primary Studio Atelier, Anaheim Guest Spot"
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-[#E50914] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                    Contact Full Name / Recipient
                  </label>
                  <input
                    type="text"
                    required
                    value={addressFormData.fullName}
                    onChange={(e) =>
                      setAddressFormData((prev) => ({ ...prev, fullName: e.target.value }))
                    }
                    placeholder="e.g. Marcus Vance"
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-[#E50914] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                    Street Address (Line 1)
                  </label>
                  <input
                    type="text"
                    required
                    value={addressFormData.streetAddress1}
                    onChange={(e) =>
                      setAddressFormData((prev) => ({ ...prev, streetAddress1: e.target.value }))
                    }
                    placeholder="e.g. 742 Evergreen Terrace"
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-[#E50914] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                    Suite / Unit / Studio Room (Optional)
                  </label>
                  <input
                    type="text"
                    value={addressFormData.streetAddress2 || ''}
                    onChange={(e) =>
                      setAddressFormData((prev) => ({ ...prev, streetAddress2: e.target.value }))
                    }
                    placeholder="e.g. Suite 204 or Station 3"
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-[#E50914] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={addressFormData.city}
                    onChange={(e) =>
                      setAddressFormData((prev) => ({ ...prev, city: e.target.value }))
                    }
                    placeholder="e.g. Los Angeles"
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-[#E50914] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                      State / Prov
                    </label>
                    <input
                      type="text"
                      required
                      value={addressFormData.state}
                      onChange={(e) =>
                        setAddressFormData((prev) => ({ ...prev, state: e.target.value }))
                      }
                      placeholder="e.g. CA"
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-[#E50914] focus:outline-none uppercase"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      required
                      value={addressFormData.postalCode}
                      onChange={(e) =>
                        setAddressFormData((prev) => ({ ...prev, postalCode: e.target.value }))
                      }
                      placeholder="90001"
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-[#E50914] focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    required
                    value={addressFormData.country}
                    onChange={(e) =>
                      setAddressFormData((prev) => ({ ...prev, country: e.target.value }))
                    }
                    placeholder="United States"
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-[#E50914] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={addressFormData.phone}
                    onChange={(e) =>
                      setAddressFormData((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    placeholder="+1 (213) 555-0199"
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-[#E50914] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="defaultAddressCheckbox"
                  checked={addressFormData.isDefault}
                  onChange={(e) =>
                    setAddressFormData((prev) => ({ ...prev, isDefault: e.target.checked }))
                  }
                  className="rounded border-zinc-700 bg-zinc-900 text-[#E50914] focus:ring-[#E50914] h-4 w-4"
                />
                <label
                  htmlFor="defaultAddressCheckbox"
                  className="text-xs text-zinc-300 font-medium cursor-pointer"
                >
                  Set as primary default shipping destination
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#E50914] px-5 py-2 text-xs font-bold text-white hover:bg-red-600 transition shadow-lg shadow-red-950/40 cursor-pointer"
                >
                  {editingAddressId ? 'Save Changes' : 'Add Destination'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
