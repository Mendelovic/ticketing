import { Queues } from "./queues";

export interface PaymentCreatedEvent {
  queue: Queues.PaymentCreated;
  data: {
    id: string;
    orderId: string;
    stripeId: string;
  };
}
