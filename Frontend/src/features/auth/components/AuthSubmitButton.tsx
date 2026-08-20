import { LoaderCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AuthSubmitButtonProps {
  pending: boolean
  idleLabel: string
  pendingLabel: string
}

export function AuthSubmitButton({ pending, idleLabel, pendingLabel }: AuthSubmitButtonProps) {
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <LoaderCircle aria-hidden="true" className="animate-spin" size={20} /> : null}
      {pending ? pendingLabel : idleLabel}
    </Button>
  )
}
