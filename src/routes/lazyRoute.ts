import { type ComponentType, createElement, lazy, type ReactNode, Suspense } from 'react'

import { RouteLoadingFallback } from '@/components/feedback/RouteLoadingFallback'

export function lazyNamed<TModule, TExportName extends keyof TModule>(
  load: () => Promise<TModule>,
  exportName: TExportName,
) {
  return lazy(async () => {
    const module = await load()

    return { default: module[exportName] as ComponentType }
  })
}

export function withRouteLoadingFallback(page: ReactNode) {
  return createElement(Suspense, { fallback: createElement(RouteLoadingFallback) }, page)
}
