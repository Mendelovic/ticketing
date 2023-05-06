import { Consumer, OrderCreatedEvent, Queues } from "@mendeltickets/common";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedConsumer extends Consumer<OrderCreatedEvent> {
  readonly queueName = Queues.OrderCreated;
  messagesBeingProcessed = 0;

  async onMessage(msg: OrderCreatedEvent["data"]): Promise<void> {
    // Find the ticket that the order is reserving
    const ticket = await Ticket.findById(msg.ticket.id);

    // If no ticket, throw error
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    // Mark the ticket as being reserved by setting its orderId property
    ticket.set({ orderId: msg.id });

    // Save the ticket and publish the updated ticket
    await ticket.save();
    
    // await so in case there's an error it won't ack the message
    await new TicketUpdatedPublisher(this.conn).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      version: ticket.version,
      orderId: ticket.orderId,
    });
  }
}
