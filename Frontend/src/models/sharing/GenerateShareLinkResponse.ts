export interface GenerateShareLinkResponse {
  shareLinkId: string
  fileId: string
  shareUrl: string
  expiresAt: string | null
  isRevoked: boolean
  createdAt: string
}
