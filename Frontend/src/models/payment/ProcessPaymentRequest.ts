export interface ProcessPaymentRequest {
  cardHolderName: string
  cardNumber: string
  expiryMonth: number
  expiryYear: number
  cvv: string
}
