import { Consumer, OrderCreatedEvent, Queues } from "@mendeltickets/common";
import { Order } from "../../models/order";

export class OrderCreatedConsumer extends Consumer<OrderCreatedEvent> {
  readonly queueName = Queues.OrderCreatedPayments;
  messagesBeingProcessed = 0;

  async onMessage(msg: OrderCreatedEvent["data"]): Promise<void> {
    const { id, status, ticket, userId } = msg;

    const order = Order.build({ id, status, userId, price: ticket.price });
    await order.save();
  }
}
