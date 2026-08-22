import { isValidElement } from 'react'
import type { RouteObject } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { router } from '@/app/routes'
import { ProtectedRoute } from '@/routes/ProtectedRoute'

describe('WorkspaceHome route', () => {
  it('keeps /vault protected and gives its index a lazy page element', () => {
    const routes = router.routes as unknown as RouteObject[]
    const vaultRoute = routes.find((route) => route.path === '/vault')
    const indexRoute = vaultRoute?.children?.find((route) => route.index)

    expect(vaultRoute).toBeDefined()
    expect(isValidElement(vaultRoute?.element)).toBe(true)
    if (isValidElement(vaultRoute?.element)) {
      expect(vaultRoute.element.type).toBe(ProtectedRoute)
    }
    expect(indexRoute?.element).toBeDefined()
  })
})
