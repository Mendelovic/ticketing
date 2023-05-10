import { Exchanges } from "./exchanges";
import { Queues } from "./queues";
import { OrderStatus } from "./types/order-status";

export interface OrderCreatedEvent {
  queue:
    | Queues.OrderCreatedTickets
    | Queues.OrderCreatedExpiration
    | Queues.OrderCreatedPayments;
  exchange: Exchanges.OrderCreated;
  data: {
    id: string;
    version: number;
    status: OrderStatus;
    userId: string;
    expiresAt: string;
    ticket: {
      id: string;
      price: number;
    };
  };
}
