import { OrderCompletedEvent, Publisher, Queues } from "@mendeltickets/common";

export class OrderCompletedPublisher extends Publisher<OrderCompletedEvent> {
  readonly queueName = Queues.OrderCompleted;
}
