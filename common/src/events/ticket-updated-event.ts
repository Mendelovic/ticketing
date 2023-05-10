import { Queues } from "./queues";

export interface TicketUpdatedEvent {
  queue: Queues.TicketUpdated;
  data: {
    id: string;
    version: number;
    title: string;
    price: number;
    userId: string;
    orderId?: string;
  };
}
