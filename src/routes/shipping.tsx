import { createFileRoute, Link } from '@tanstack/react-router'
import {
  AlertTriangle,
  Award,
  CheckCircle2,
  Clock,
  HelpCircle,
  Package,
  RotateCcw,
  Shield,
  ShieldCheck,
  Truck,
  Zap,
} from 'lucide-react'

export const Route = createFileRoute('/shipping')({
  head: () => ({
    meta: [
      { title: 'Shipping & Returns Policy | Savage Needles Official Supply' },
      {
        name: 'description',
        content:
          'Official Shipping, EO Gas Sterilization standards, 1-Year Motor Warranty, and Studio Return Policy for Savage Needles & Papa Supply.',
      },
    ],
  }),
  component: ShippingPolicyPage,
})

function ShippingPolicyPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="border-b border-zinc-800/80 pb-8 text-center space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-600/10 px-3.5 py-1 text-xs font-bold text-red-400">
          <Truck className="h-3.5 w-3.5" /> Savage Needles Studio Logistics Standard
        </div>
        <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl uppercase">
          Shipping, Warranty & Returns
        </h1>
        <p className="mx-auto max-w-2xl text-sm text-zinc-400">
          Engineered for professional tattoo studios worldwide. Fast direct dispatch from our Los Angeles Hub with tracked courier delivery.
        </p>
      </div>

      {/* 3 Core Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-zinc-800 bg-[#161616] p-6 space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600/20 text-red-500">
            <Clock className="h-5 w-5" />
          </div>
          <h2 className="text-base font-bold text-white">Same-Day Dispatch</h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            All orders placed before 3:00 PM PST are verified, pick-and-packed at our Los Angeles fulfillment center, and handed to FedEx/UPS the same business day.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-[#161616] p-6 space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h2 className="text-base font-bold text-white">1-Year Studio Warranty</h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            All Papa Rotary Pen machines and Critical power stations carry a 1-year manufacturer replacement warranty covering coreless motors and circuit boards.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-[#161616] p-6 space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
            <RotateCcw className="h-5 w-5" />
          </div>
          <h2 className="text-base font-bold text-white">30-Day Hassle Returns</h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Unopened cartridges in intact blister packaging and undamaged machines can be returned within 30 days of delivery with prepaid return labels provided.
          </p>
        </div>
      </div>

      {/* Detailed Shipping Breakdown */}
      <section className="rounded-2xl border border-zinc-800 bg-[#141414] p-6 sm:p-8 space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Truck className="h-5 w-5 text-red-500" />
          Shipping Speeds & Delivery Rates
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-zinc-800 text-zinc-400 uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4 font-bold">Service Tier</th>
                <th className="py-3 px-4 font-bold">Delivery Window</th>
                <th className="py-3 px-4 font-bold">Orders Under $99</th>
                <th className="py-3 px-4 font-bold">Orders $99+</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              <tr>
                <td className="py-3.5 px-4 font-bold text-white">Standard Express Ground</td>
                <td className="py-3.5 px-4 text-zinc-400">3-5 Business Days</td>
                <td className="py-3.5 px-4 font-mono">$9.99 Flat Rate</td>
                <td className="py-3.5 px-4 font-bold text-emerald-400">FREE EXPRESS</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-bold text-white">Priority Studio Airfreight</td>
                <td className="py-3.5 px-4 text-zinc-400">1-2 Business Days</td>
                <td className="py-3.5 px-4 font-mono">$19.99</td>
                <td className="py-3.5 px-4 font-mono text-amber-400">$12.99 Upgrade</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-bold text-white">International Express (DHL)</td>
                <td className="py-3.5 px-4 text-zinc-400">4-7 Days Worldwide</td>
                <td className="py-3.5 px-4 font-mono">Calculated at Checkout</td>
                <td className="py-3.5 px-4 text-zinc-400">Duties Prepaid (DDP)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Bio-Safety & Sterile Needle Regulation */}
      <section className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 sm:p-8 space-y-4">
        <div className="flex items-start gap-4">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="space-y-2">
            <h2 className="text-base font-bold text-white">
              Tattoo Needle Cartridge Bio-Safety Regulation
            </h2>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Every Savage Needles cartridge is individually sealed in medical-grade blister packaging with ethylene oxide (EO) gas sterilization indicators. In accordance with health department standards and OSHA Bloodborne Pathogens regulations:
            </p>
            <ul className="list-disc pl-5 text-xs text-zinc-400 space-y-1">
              <li>Cartridge boxes with broken blister seals or opened individual wrappers cannot be restocked or returned.</li>
              <li>Defective needle solder or membrane detachment will be credited or replaced immediately without returning the biohazardous unit.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Return Process Instructions */}
      <section className="rounded-2xl border border-zinc-800 bg-[#141414] p-6 sm:p-8 space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <RotateCcw className="h-5 w-5 text-red-500" />
          How to Initiate a Return or Warranty Claim
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
          <div className="space-y-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-600/20 font-mono text-xs font-bold text-red-400">
              1
            </span>
            <h3 className="text-xs font-bold text-white">Find Your Order</h3>
            <p className="text-[11px] text-zinc-400">
              Visit your <Link to="/account" className="text-red-400 hover:underline">Studio Customer Portal</Link> and select the relevant order record.
            </p>
          </div>

          <div className="space-y-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-600/20 font-mono text-xs font-bold text-red-400">
              2
            </span>
            <h3 className="text-xs font-bold text-white">Provide Serial or Photos</h3>
            <p className="text-[11px] text-zinc-400">
              For machines, provide the engraved serial number. For needle inquiries, note the lot number printed on the box.
            </p>
          </div>

          <div className="space-y-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-600/20 font-mono text-xs font-bold text-red-400">
              3
            </span>
            <h3 className="text-xs font-bold text-white">Prepaid Dispatch</h3>
            <p className="text-[11px] text-zinc-400">
              Our support team will dispatch a replacement unit or issue a prepaid return shipping slip within 12 business hours.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <div className="text-center pt-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-7 py-3 text-xs font-bold text-white shadow-lg shadow-red-950/40 hover:bg-red-500 transition active:scale-95 cursor-pointer"
        >
          <span>Return to Catalog Storefront</span>
        </Link>
      </div>
    </div>
  )
}
