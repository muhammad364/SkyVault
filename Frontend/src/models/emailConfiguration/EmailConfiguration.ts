export interface CreateEmailConfigurationRequest {
  smtpHost: string
  smtpPort: number
  useSsl: boolean
  requiresAuthentication: boolean
  senderEmail: string
  senderDisplayName: string | null
  username: string | null
  password: string | null
  isActive: boolean
}

export interface UpdateEmailConfigurationRequest {
  smtpHost: string
  smtpPort: number
  useSsl: boolean
  requiresAuthentication: boolean
  senderEmail: string
  senderDisplayName: string | null
  username: string | null
  password: string | null
}

export interface EmailConfigurationResponse {
  emailConfigurationId: string
  smtpHost: string
  smtpPort: number
  useSsl: boolean
  requiresAuthentication: boolean
  senderEmail: string
  senderDisplayName: string | null
  username: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}
