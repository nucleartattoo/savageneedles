import { Link } from '@tanstack/react-router'
import { getTopCategories } from '~/lib/catalog'

export function CategoryNav() {
  const topCategories = getTopCategories()

  return (
    <div className="border-b border-zinc-800/80 bg-[#0d0d10] py-2.5">
      <div className="no-scrollbar mx-auto flex max-w-7xl items-center gap-6 overflow-x-auto px-4 sm:px-6 lg:px-8 text-xs text-zinc-400">
        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-500 shrink-0">
          Departments:
        </span>
        {topCategories.map((cat) => (
          <Link
            key={cat.id}
            to="/categories/$slug"
            params={{ slug: cat.slug }}
            className="whitespace-nowrap font-medium transition-colors duration-150 hover:text-white"
            activeProps={{
              className:
                'text-white font-bold underline decoration-[#E50914] decoration-2 underline-offset-8',
            }}
          >
            {cat.name}
          </Link>
        ))}
      </div>
    </div>
  )
}
