import { useMutation } from '@tanstack/react-query'
import { authService } from '@/features/auth/services/auth.service'
import type { RegisterUserRequest } from '@/models/auth/RegisterUserRequest'

export function useRegister() {
  return useMutation({ mutationFn: (request: RegisterUserRequest) => authService.register(request) })
}
