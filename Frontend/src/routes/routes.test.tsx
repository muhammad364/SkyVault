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
  it('sends signed-out users to login and preserves the requested route', () => {
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
          <Route path="/auth/login" element={<p>Sign in needed</p>} />
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
          expiresAt: new Date(Date.now() + 60_000).toISOString(),
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

  it('keeps administrator sessions out of the user vault', () => {
    act(() =>
      useAuthStore.setState({
        session: {
          accessToken: 'admin-session',
          expiresAt: new Date(Date.now() + 60_000).toISOString(),
          role: 'admin',
        },
      }),
    )

    render(
      <MemoryRouter initialEntries={['/vault']}>
        <Routes>
          <Route
            path="/vault"
            element={
              <ProtectedRoute>
                <p>User vault</p>
              </ProtectedRoute>
            }
          />
          <Route path="/admin" element={<p>Admin workspace</p>} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Admin workspace')).toBeInTheDocument()
    expect(screen.queryByText('User vault')).not.toBeInTheDocument()
  })

  it('sends an authenticated non-admin to the real forbidden experience', () => {
    act(() =>
      useAuthStore.setState({
        session: {
          accessToken: 'user-session',
          expiresAt: new Date(Date.now() + 60_000).toISOString(),
          role: 'user',
        },
      }),
    )

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <p>Admin workspace</p>
              </AdminRoute>
            }
          />
          <Route path="/errors/403" element={<p>Forbidden experience</p>} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Forbidden experience')).toBeInTheDocument()
  })
})
