import { Queues } from "./queues";

export interface TicketCreatedEvent {
  queue: Queues.TicketCreated;
  data: {
    id: string;
    version: number;
    title: string;
    price: number;
    userId: string;
  };
}
