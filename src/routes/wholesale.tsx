import { Link, createFileRoute } from '@tanstack/react-router'
import {
  Award,
  Building2,
  CheckCircle2,
  FileCheck2,
  HelpCircle,
  Package,
  RefreshCw,
  Send,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Truck,
  Users,
  Zap,
} from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/wholesale')({
  head: () => ({
    meta: [
      { title: 'B2B Wholesale & Studio Accreditation | Savage Needles Official' },
      {
        name: 'description',
        content:
          'Direct factory wholesale pricing, bulk tattoo cartridge needle tiers, and Papa rotary machine distribution for licensed studios and professional artists.',
      },
    ],
  }),
  component: WholesalePage,
})

function WholesalePage() {
  const [formData, setFormData] = useState({
    studioName: '',
    ownerName: '',
    licenseNumber: '',
    email: '',
    phone: '',
    cityState: '',
    artistsCount: '3-5 artists',
    monthlyBoxes: '50-100 boxes',
    instagramHandle: '',
    inquiryNotes: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedSuccess, setSubmittedSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmittedSuccess(true)
      try {
        localStorage.setItem(
          'savage_wholesale_application',
          JSON.stringify({ ...formData, submittedAt: new Date().toISOString() }),
        )
      } catch {
        // Ignore
      }
    }, 800)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 space-y-16">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-b from-[#181818] via-[#141414] to-[#101010] p-8 sm:p-14 text-center space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-red-600/30 bg-red-600/10 px-4 py-1.5 text-xs font-bold text-red-500">
          <Zap className="h-3.5 w-3.5" />
          <span>Official Factory-Direct B2B Studio Supply</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white max-w-3xl mx-auto leading-none">
          Power Your Studio with Wholesale Direct Pricing
        </h1>

        <p className="mx-auto max-w-2xl text-sm sm:text-base text-zinc-400 leading-relaxed">
          Unlock up to 35% margin discounts on Savage Needles medical-grade cartridge boxes, Papa
          rotary pen machines, and critical power supply hardware. Verified for licensed tattoo
          artists and studio owners.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <a
            href="#application-form"
            className="rounded-xl bg-red-600 px-6 py-3 text-xs font-bold text-white shadow-xl shadow-red-950/50 hover:bg-red-500 transition active:scale-95 cursor-pointer"
          >
            Apply for Studio Wholesale Tier
          </a>
          <Link
            to="/categories/$slug"
            params={{ slug: 'savage-cartridges' }}
            className="rounded-xl border border-zinc-700 bg-zinc-800/80 px-6 py-3 text-xs font-semibold text-zinc-300 hover:border-zinc-600 hover:text-white transition"
          >
            Explore Needle Catalog
          </Link>
        </div>
      </div>

      {/* 3 Wholesale Discount Tiers */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-500">
            Transparent Volume Pricing
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-tight">
            Wholesale Accreditation Tiers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tier 1 */}
          <div className="rounded-2xl border border-zinc-800 bg-[#151515] p-6 space-y-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-zinc-400 uppercase">Tier 1</span>
                <span className="rounded bg-zinc-800 px-2.5 py-0.5 text-[10px] font-bold text-zinc-300">
                  Resident Artist
                </span>
              </div>
              <div className="text-3xl font-black text-white">
                15% OFF <span className="text-xs font-normal text-zinc-400">MSRP</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Ideal for solo tattooists and boutique studios stocking daily cartridge needles and
                clip grips.
              </p>
              <ul className="space-y-2 text-xs text-zinc-300 pt-2 border-t border-zinc-800">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Min. Order: 20 cartridge boxes</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Free standard courier delivery</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Dedicated B2B account portal</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Tier 2 (Highlighted) */}
          <div className="relative rounded-2xl border-2 border-red-600 bg-gradient-to-b from-[#1c1c1c] to-[#141414] p-6 space-y-5 flex flex-col justify-between shadow-2xl shadow-red-950/30">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-red-600 px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
              Most Popular Studio Choice
            </div>
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-red-400 uppercase">Tier 2</span>
                <span className="rounded bg-red-600/20 text-red-400 px-2.5 py-0.5 text-[10px] font-bold border border-red-600/30">
                  Master Atelier
                </span>
              </div>
              <div className="text-3xl font-black text-white">
                25% OFF <span className="text-xs font-normal text-zinc-400">MSRP</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Designed for high-traffic tattoo studios and academies ordering bulk weekly needle
                runs.
              </p>
              <ul className="space-y-2 text-xs text-zinc-300 pt-2 border-t border-zinc-800">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Min. Order: 50 cartridge boxes</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Priority same-day dispatch</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Free sample packs on new configs</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Papa rotary machine demo units</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Tier 3 */}
          <div className="rounded-2xl border border-zinc-800 bg-[#151515] p-6 space-y-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-zinc-400 uppercase">Tier 3</span>
                <span className="rounded bg-zinc-800 px-2.5 py-0.5 text-[10px] font-bold text-zinc-300">
                  Distributor & Chain
                </span>
              </div>
              <div className="text-3xl font-black text-white">
                35% OFF <span className="text-xs font-normal text-zinc-400">MSRP</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                For regional supply distributors, franchise studios, and international tattoo
                convention organizers.
              </p>
              <ul className="space-y-2 text-xs text-zinc-300 pt-2 border-t border-zinc-800">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Master carton & pallet shipment</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Custom OEM blister printing available</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Net 30 payment terms (upon credit check)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Guarantees */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 rounded-2xl border border-zinc-800 bg-[#141414] p-6 sm:p-8">
        <div className="flex items-start gap-3.5">
          <FileCheck2 className="h-7 w-7 text-red-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">100% EO Gas Sterilized</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Every single needle cartridge is sealed with ethylene oxide gas indicator strip and
              sterilized in ISO cleanroom environments.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3.5">
          <ShieldCheck className="h-7 w-7 text-red-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">316L Medical Grade Steel</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Precision ground needle tapers with zero lead solder. Safety membrane prevents ink
              backflow into rotary machine grips.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3.5">
          <Truck className="h-7 w-7 text-red-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">Global Express Logistics</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Same-day tracked courier dispatch from California hub with guaranteed delivery
              timelines for studio convention dates.
            </p>
          </div>
        </div>
      </section>

      {/* Wholesale Application Form */}
      <section
        id="application-form"
        className="rounded-3xl border border-zinc-800 bg-[#151515] p-6 sm:p-10 space-y-8"
      >
        <div className="border-b border-zinc-800 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
              <Building2 className="h-6 w-6 text-red-500" />
              <span>Studio Wholesale Application</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Submit your studio accreditation for account activation within 4 business hours.
            </p>
          </div>
          {submittedSuccess && (
            <div className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 text-xs font-bold text-emerald-400 animate-in fade-in">
              <CheckCircle2 className="h-4 w-4" />
              <span>Application Submitted! Verification in Progress</span>
            </div>
          )}
        </div>

        {submittedSuccess ? (
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/10 p-8 text-center space-y-4">
            <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">
              Thank You for Applying, {formData.ownerName || 'Artist'}!
            </h3>
            <p className="text-xs text-zinc-400 max-w-lg mx-auto leading-relaxed">
              We have received your studio wholesale registration for{' '}
              <strong>{formData.studioName || 'Your Studio'}</strong>. Our account team is reviewing
              your license number and will email your B2B discount code and tier confirmation
              shortly.
            </p>
            <div className="pt-2">
              <Link
                to="/account"
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-red-500 transition"
              >
                <span>View Studio Account</span>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Studio or Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.studioName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, studioName: e.target.value }))}
                  placeholder="e.g. Black Lotus Tattoo Atelier"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-2.5 text-xs text-white focus:border-red-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Owner / Resident Artist Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.ownerName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, ownerName: e.target.value }))}
                  placeholder="e.g. Marcus Vance"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-2.5 text-xs text-white focus:border-red-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Business Tax ID / State Tattoo License *
                </label>
                <input
                  type="text"
                  required
                  value={formData.licenseNumber}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, licenseNumber: e.target.value }))
                  }
                  placeholder="e.g. CA-948192-TAT or Reseller Permit"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-2.5 text-xs text-white focus:border-red-600 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Studio Work Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="e.g. supply@blacklotus.studio"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-2.5 text-xs text-white focus:border-red-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="e.g. +1 (213) 555-0199"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-2.5 text-xs text-white focus:border-red-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Studio Location (City, State / Country) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.cityState}
                  onChange={(e) => setFormData((prev) => ({ ...prev, cityState: e.target.value }))}
                  placeholder="e.g. Los Angeles, CA / United States"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-2.5 text-xs text-white focus:border-red-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Number of Resident Tattooists
                </label>
                <select
                  value={formData.artistsCount}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, artistsCount: e.target.value }))
                  }
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-2.5 text-xs text-white focus:border-red-600 focus:outline-none"
                >
                  <option value="1 artist">1 solo artist</option>
                  <option value="2-4 artists">2 - 4 resident artists</option>
                  <option value="5-10 artists">5 - 10 resident artists</option>
                  <option value="10+ artists">10+ studio chain</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Estimated Monthly Cartridge Volume
                </label>
                <select
                  value={formData.monthlyBoxes}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, monthlyBoxes: e.target.value }))
                  }
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-2.5 text-xs text-white focus:border-red-600 focus:outline-none"
                >
                  <option value="20-50 boxes">20 - 50 boxes (Tier 1)</option>
                  <option value="50-100 boxes">50 - 100 boxes (Tier 2)</option>
                  <option value="100-250 boxes">100 - 250 boxes (Tier 2/3)</option>
                  <option value="250+ boxes">250+ master cartons (Tier 3)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Studio Instagram / Portfolio Link
                </label>
                <input
                  type="text"
                  value={formData.instagramHandle}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, instagramHandle: e.target.value }))
                  }
                  placeholder="e.g. @blacklotus.tattoo or https://instagram.com/..."
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-2.5 text-xs text-white focus:border-red-600 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Specific Needle Configs or Hardware Needed (Optional)
                </label>
                <textarea
                  rows={3}
                  value={formData.inquiryNotes}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, inquiryNotes: e.target.value }))
                  }
                  placeholder="Let us know if you require specific needle groupings (e.g. #10 03RL, #12 09RM) or Papa machine demo batches..."
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-2.5 text-xs text-white focus:border-red-600 focus:outline-none resize-none"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-zinc-800">
              <span className="text-[11px] text-zinc-500">
                🔒 Your studio tax license is kept confidential and strictly used for B2B wholesale
                pricing.
              </span>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-red-950/40 hover:bg-red-500 transition cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Verifying Application...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Submit Wholesale Application</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  )
}
