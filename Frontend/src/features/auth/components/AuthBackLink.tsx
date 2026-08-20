import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

interface AuthBackLinkProps {
  label?: string
}

export function AuthBackLink({ label = 'Back to sign in' }: AuthBackLinkProps) {
  return (
    <Link className="inline-flex items-center gap-2 font-semibold text-primary hover:underline" to="/auth/login">
      <ArrowLeft aria-hidden="true" size={18} /> {label}
    </Link>
  )
}
