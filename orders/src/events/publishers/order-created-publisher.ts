import { OrderCreatedEvent, Publisher, Queues } from "@mendeltickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly queueName = Queues.OrderCreated;
}
