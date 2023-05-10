import { Queues } from "./queues";
import { OrderStatus } from "./types/order-status";

export interface OrderCompletedEvent {
  queue: Queues.OrderCompleted;
  data: {
    id: string;
    version: number;
    status: OrderStatus.Complete;
  };
}
