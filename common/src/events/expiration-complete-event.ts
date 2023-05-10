import { Queues } from "./queues";

export interface ExpirationCompleteEvent {
  queue: Queues.ExpirationComplete;
  data: {
    orderId: string;
  };
}
