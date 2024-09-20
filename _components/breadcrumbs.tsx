'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Breadcrumbs({ currentPage }: { currentPage?: string }) {
  const pathname = usePathname()
  const crumbs = pathname
    .split('/')
    .filter((crumb) => crumb)
    .slice(1)

  return (
    <div className="px-4 py-2 text-sm inline-flex justify-start items-center gap-4 bg-card-bg rounded-lg shadow-md">
      {crumbs.map((crumb, idx) => {
        const pathToCrumb = `/${crumbs.slice(0, idx + 1).join('/')}`
        const isLast = idx === crumbs.length - 1

        const formattedCrumb = crumb.charAt(0).toUpperCase() + crumb.slice(1)

        return (
          <p key={crumb} className="inline-block">
            {!isLast ? (
              <>
                <Link href={pathToCrumb} className="underline">
                  {formattedCrumb}
                </Link>
                <span className="pl-3 text-foreground/60">&rarr;</span>
              </>
            ) : currentPage ? (
              currentPage
            ) : (
              formattedCrumb
            )}
          </p>
        )
      })}
    </div>
  )
}
