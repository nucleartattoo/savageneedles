import type { QueryClient } from '@tanstack/react-query'
import { HeadContent, Link, Outlet, Scripts, createRootRouteWithContext } from '@tanstack/react-router'
import { AlertCircle, ArrowLeft, Compass, Home, Zap } from 'lucide-react'
import type { ReactNode } from 'react'
import { CategoryNav } from '~/components/CategoryNav'
import { Footer } from '~/components/Footer'
import { Header } from '~/components/Header'
import styles from '~/styles.css?url'

interface RootContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RootContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Savage Needles | Professional Tattoo Cartridges & Papa Supply' },
      {
        name: 'description',
        content:
          'Savage Needles Official Store. Premium cartridge needles, Papa rotary pen machines, precision grips, and studio essentials.',
      },
    ],
    links: [{ rel: 'stylesheet', href: styles }],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
})

function NotFoundComponent() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 text-center space-y-6">
      <div className="flex justify-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-600/10 border border-red-500/20 text-red-500 shadow-xl">
          <AlertCircle className="h-8 w-8 stroke-[2.5]" />
        </span>
      </div>
      <div className="space-y-2">
        <span className="font-mono text-xs font-bold text-red-500 uppercase tracking-widest">
          Error 404 • Page Not Found
        </span>
        <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl uppercase">
          Studio Equipment Route Lost
        </h1>
        <p className="mx-auto max-w-md text-sm text-zinc-400">
          The requested studio supply, needle configuration, or catalog category could not be located in the Savage Needles system.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
        <Link
          to="/"
          className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-red-950/40 hover:bg-red-500 transition active:scale-95 cursor-pointer"
        >
          <Home className="h-4 w-4" />
          <span>Return to Storefront</span>
        </Link>
        <Link
          to="/categories/$slug"
          params={{ slug: 'savage-cartridges' }}
          className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-2.5 text-xs font-bold text-zinc-300 hover:border-zinc-700 hover:text-white transition active:scale-95 cursor-pointer"
        >
          <Compass className="h-4 w-4 text-amber-400" />
          <span>Browse Savage Cartridges</span>
        </Link>
      </div>
    </div>
  )
}

function RootComponent() {
  return (
    <RootDocument>
      <div className="flex min-h-screen flex-col bg-[#141414] text-zinc-100">
        <Header />
        <CategoryNav />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body className="bg-[#141414] antialiased selection:bg-[#E50914] selection:text-white">
        {children}
        <Scripts />
      </body>
    </html>
  )
}
