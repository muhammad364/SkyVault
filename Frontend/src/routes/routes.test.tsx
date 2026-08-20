import { cleanup, render, screen } from '@testing-library/react'
import { act } from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import { AdminRoute } from '@/routes/AdminRoute'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import { useAuthStore } from '@/store/auth.store'

afterEach(() => {
  cleanup()
  act(() => useAuthStore.setState({ session: null }))
  window.localStorage.clear()
})

describe('route guards', () => {
  it('sends signed-out users to the unauthorised route', () => {
    render(
      <MemoryRouter
        initialEntries={['/vault']}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Routes>
          <Route
            path="/vault"
            element={
              <ProtectedRoute>
                <p>Vault route</p>
              </ProtectedRoute>
            }
          />
          <Route path="/errors/401" element={<p>Sign in needed</p>} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Sign in needed')).toBeInTheDocument()
  })

  it('allows admin routes only when session state says admin', () => {
    act(() =>
      useAuthStore.setState({
        session: {
          accessToken: 'phase-1-session',
          expiresAt: '2026-08-20T00:00:00Z',
          role: 'admin',
        },
      }),
    )

    render(
      <MemoryRouter
        initialEntries={['/admin']}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Routes>
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <p>Admin route</p>
              </AdminRoute>
            }
          />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Admin route')).toBeInTheDocument()
  })
})
