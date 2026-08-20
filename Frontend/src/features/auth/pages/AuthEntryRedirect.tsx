import { Navigate, useLocation } from 'react-router-dom'

export default function AuthEntryRedirect() {
  const location = useLocation()
  const mode = new URLSearchParams(location.search).get('mode')
  return <Navigate to={mode === 'register' ? '/auth/register' : '/auth/login'} replace state={location.state} />
}
