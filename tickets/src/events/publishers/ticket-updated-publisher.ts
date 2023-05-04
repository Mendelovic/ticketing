import { Publisher, Queues, TicketUpdatedEvent } from "@mendeltickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly queueName = Queues.TicketUpdated;
}
