import { Publisher, Queues, TicketCreatedEvent } from "@mendeltickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly queueName = Queues.TicketCreated;
}
