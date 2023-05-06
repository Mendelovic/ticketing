import amqp from "amqplib";
import { Consumer, Queues, TicketCreatedEvent } from "@mendeltickets/common";
import { Ticket } from "../../models/ticket";

export class TicketCreatedConsumer extends Consumer<TicketCreatedEvent> {
  readonly queueName = Queues.TicketCreated;
  messagesBeingProcessed = 0;

  constructor(connection: amqp.Connection) {
    super(connection);
  }

  onMessage = async (msg: TicketCreatedEvent["data"]): Promise<void> => {
    const { id, title, price } = msg;

    const ticket = Ticket.build({ id, title, price });
    await ticket.save();
  };
}
