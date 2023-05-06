import amqp from "amqplib";
import { Consumer, Queues, TicketUpdatedEvent } from "@mendeltickets/common";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedConsumer extends Consumer<TicketUpdatedEvent> {
  readonly queueName = Queues.TicketUpdated;
  messagesBeingProcessed = 0;

  constructor(connection: amqp.Connection) {
    super(connection);
  }

  onMessage = async (msg: TicketUpdatedEvent["data"]): Promise<void> => {
    const ticket = await Ticket.findByIdAndPrevVersion(msg);

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    const { title, price } = msg;
    ticket.set({ title, price });
    await ticket.save();
  };
}
