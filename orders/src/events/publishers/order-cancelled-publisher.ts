import { OrderCancelledEvent, Publisher, Queues } from "@mendeltickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly queueName = Queues.OrderCancelled;
}
