export enum Queues {
  TicketCreated = "ticket-created",
  TicketUpdated = "ticket-updated",

  // OrderCreated = "order-created",
  // OrderCancelled = "order-cancelled",
  OrderCreatedExpiration = "order-created-expiration",
  OrderCreatedPayments = "order-created-payments",
  OrderCreatedTickets = "order-created-tickets",

  OrderCancelledTickets = "order-cancelled-tickets",
  OrderCancelledPayments = "order-cancelled-payments",
  OrderCompleted = "order-completed",

  ExpirationComplete = "expiration-complete",

  PaymentCreated = "payment-created",
}
