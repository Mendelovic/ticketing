import { PaymentCreatedEvent, Publisher, Queues } from "@mendeltickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly queueName = Queues.PaymentCreated;
}
