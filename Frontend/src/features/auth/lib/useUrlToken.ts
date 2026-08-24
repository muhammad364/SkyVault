import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export function useUrlToken() {
  const location = useLocation()
  const navigate = useNavigate()
  const [token] = useState(() => new URLSearchParams(location.search).get('token')?.trim() || null)

  useEffect(() => {
    if (token && location.search)
      navigate(location.pathname, { replace: true, state: location.state })
  }, [location.pathname, location.search, location.state, navigate, token])

  return token
}
