import { Consumer, OrderCancelledEvent, Queues } from "@mendeltickets/common";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCancelledConsumer extends Consumer<OrderCancelledEvent> {
  readonly queueName = Queues.OrderCancelled;
  messagesBeingProcessed = 0;

  async onMessage(msg: OrderCancelledEvent["data"]): Promise<void> {
    const ticket = await Ticket.findById(msg.ticket.id);

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    ticket.set({ orderId: undefined });
    await ticket.save();
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
