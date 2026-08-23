export interface AuditLog {
  auditLogId: string
  administratorId: string
  administratorEmail: string
  action: string
  entityType: string
  entityId: string
  description: string
  createdAt: string
}

export interface AuditLogFilters {
  administratorId: string | null
  action: string | null
  performedFrom: string | null
  performedTo: string | null
  skip: number
  take: number
}
