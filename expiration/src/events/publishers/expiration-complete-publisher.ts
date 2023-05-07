import {
  ExpirationCompleteEvent,
  Publisher,
  Queues,
} from "@mendeltickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly queueName = Queues.ExpirationComplete;
}
