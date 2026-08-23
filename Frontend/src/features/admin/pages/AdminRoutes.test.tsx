import { isValidElement } from 'react'
import type { RouteObject } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { router } from '@/app/routes'
import { AdminRoute } from '@/routes/AdminRoute'

describe('Phase 10 routes', () => {
  it('keeps every lazy administration destination behind AdminRoute', () => {
    const routes = router.routes as unknown as RouteObject[]
    const adminRoute = routes.find((route) => route.path === '/admin')

    expect(isValidElement(adminRoute?.element)).toBe(true)
    if (isValidElement(adminRoute?.element)) expect(adminRoute.element.type).toBe(AdminRoute)
    expect(adminRoute?.children?.find((route) => route.index)?.element).toBeDefined()
    for (const path of [
      'users',
      'users/:userId',
      'plans',
      'subscriptions',
      'infrastructure',
      'email',
      'audit',
      'settings',
    ]) {
      expect(adminRoute?.children?.find((route) => route.path === path)?.element).toBeDefined()
    }
  })
})
