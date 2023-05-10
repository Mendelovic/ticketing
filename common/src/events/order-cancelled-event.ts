import { Exchanges } from "./exchanges";
import { Queues } from "./queues";

export interface OrderCancelledEvent {
  queue: Queues.OrderCancelledTickets | Queues.OrderCancelledPayments;
  exchange: Exchanges.OrderCancelled;
  data: {
    id: string;
    version: number;
    ticket: {
      id: string;
    };
  };
}
