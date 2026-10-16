import { Link, createFileRoute } from '@tanstack/react-router'
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Clock,
  HelpCircle,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  RefreshCw,
  Send,
  Shield,
  Truck,
  Wrench,
  Zap,
} from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/contact')({
  head: () => ({
    meta: [
      { title: 'Contact Studio Support & Machine Repair | Savage Needles Official' },
      {
        name: 'description',
        content:
          'Get in touch with Savage Needles & Papa Supply technical support. Machine warranty repair, studio warehouse pickup, and bulk order logistics.',
      },
    ],
  }),
  component: ContactSupportPage,
})

function ContactSupportPage() {
  const [formData, setFormData] = useState({
    name: '',
    studio: '',
    email: '',
    subject: 'warranty-repair',
    orderNumber: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      try {
        localStorage.setItem(
          'savage_support_ticket',
          JSON.stringify({ ...formData, timestamp: new Date().toISOString() }),
        )
      } catch {
        // Ignore
      }
    }, 600)
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="border-b border-zinc-800/80 pb-8 text-center space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-600/10 px-3.5 py-1 text-xs font-bold text-red-400">
          <MessageSquare className="h-3.5 w-3.5" />
          <span>Studio Artist Technical & Logistics Desk</span>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl uppercase">
          Contact Studio Support
        </h1>
        <p className="mx-auto max-w-2xl text-sm text-zinc-400">
          Have questions about Papa rotary pen voltage matching, needle taper configurations, or need machine servicing? Our California studio team is here to assist.
        </p>
      </div>

      {/* 3 Contact Channels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-zinc-800 bg-[#161616] p-6 space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600/20 text-red-500">
            <Phone className="h-5 w-5" />
          </div>
          <h2 className="text-base font-bold text-white">Direct Studio Line</h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Emergency needle orders, convention dispatch, and urgent order tracking.
          </p>
          <p className="text-xs font-mono font-bold text-white pt-1">+1 (213) 555-0199</p>
          <span className="text-[10px] text-zinc-500 block">Mon–Fri: 8:00 AM – 6:00 PM PST</span>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-[#161616] p-6 space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
            <Mail className="h-5 w-5" />
          </div>
          <h2 className="text-base font-bold text-white">Support & Orders Desk</h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Invoice questions, custom invoice requests, and wholesale accreditation.
          </p>
          <p className="text-xs font-mono font-bold text-white pt-1">support@savageneedles.com</p>
          <span className="text-[10px] text-zinc-500 block">Guaranteed reply within 4 business hours</span>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-[#161616] p-6 space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
            <Building2 className="h-5 w-5" />
          </div>
          <h2 className="text-base font-bold text-white">Hub & Warehouse</h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Los Angeles logistics hub for studio will-call pickups and machine warranty intake.
          </p>
          <p className="text-xs text-zinc-300 pt-1 leading-snug">
            742 Evergreen Terrace, Suite 200<br />Los Angeles, CA 90001, USA
          </p>
        </div>
      </div>

      {/* Support Ticket Form & Machine Servicing FAQ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 rounded-2xl border border-zinc-800 bg-[#141414] p-6 sm:p-8 space-y-6">
          <div className="border-b border-zinc-800 pb-4">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Wrench className="h-4 w-4 text-red-500" />
              <span>Submit Support / Repair Request</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              File a ticket for Papa machine warranty servicing, cartridge batch inquiries, or order adjustments.
            </p>
          </div>

          {isSubmitted ? (
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/10 p-6 text-center space-y-3">
              <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto" />
              <h4 className="text-sm font-bold text-white">Ticket Submitted Successfully</h4>
              <p className="text-xs text-zinc-400">
                Ticket reference #SN-{Math.floor(100000 + Math.random() * 900000)} has been logged. Our technical engineer will review your details and contact you via email shortly.
              </p>
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="mt-2 rounded-lg bg-zinc-800 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-700 transition"
              >
                Submit Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Marcus Vance"
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-red-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                    Studio Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.studio}
                    onChange={(e) => setFormData((prev) => ({ ...prev, studio: e.target.value }))}
                    placeholder="Black Lotus Tattoo Atelier"
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-red-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="artist@blacklotus.studio"
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-red-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                    Saleor Order # (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.orderNumber}
                    onChange={(e) => setFormData((prev) => ({ ...prev, orderNumber: e.target.value }))}
                    placeholder="e.g. #3 or #18"
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-red-600 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Inquiry Category
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-red-600 focus:outline-none"
                >
                  <option value="warranty-repair">Papa Rotary Machine Warranty & Repair</option>
                  <option value="order-shipping">Order Tracking & Shipping Logistics</option>
                  <option value="cartridge-specs">Needle Cartridge Taper & Spec Consultation</option>
                  <option value="wholesale-terms">B2B Wholesale Account & Invoice Terms</option>
                  <option value="general-inquiry">General Studio Inquiries</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Message / Issue Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                  placeholder="Describe your machine symptoms, voltage anomalies, or equipment requirements..."
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white focus:border-red-600 focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-red-500 transition cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      <span>Send Support Ticket</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Machine Servicing & Warranty FAQ */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-zinc-800 bg-[#161616] p-6 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-400" />
              <span>Papa Rotary 1-Year Guarantee</span>
            </h4>
            <div className="text-xs text-zinc-400 space-y-2.5 leading-relaxed">
              <p>
                Every genuine Papa Rotary Pen machine purchased through Savage Needles includes an unconditional 1-year motor repair guarantee.
              </p>
              <p>
                If your machine experiences voltage drops, bearing noise, or stroke inconsistency, our California technician will repair or replace the drive unit within 48 hours of intake.
              </p>
            </div>
            <div className="pt-2 border-t border-zinc-800 text-[11px] text-zinc-500">
              ⚡ Recommended Operating Voltage: 5.0V – 9.0V (Do not exceed 11V).
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-[#161616] p-6 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Needle Samples for Studios
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Want your artists to test our membrane tension and ink flow? Request a complementary sample pack with your studio verification.
            </p>
            <Link
              to="/wholesale"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-400 transition"
            >
              <span>Learn about Wholesale & Samples →</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
