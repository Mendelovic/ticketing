import {
  Consumer,
  ExpirationCompleteEvent,
  OrderStatus,
  Queues,
} from "@mendeltickets/common";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";
import { amqpConnection } from "../../amqpConnection";

export class ExpirationCompleteConsumer extends Consumer<ExpirationCompleteEvent> {
  readonly queueName = Queues.ExpirationComplete;
  messagesBeingProcessed = 0;

  async onMessage(msg: ExpirationCompleteEvent["data"]): Promise<void> {
    const order = await Order.findById(msg.orderId).populate("ticket");

    if (!order) {
      throw new Error("Order not found");
    }

    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    await new OrderCancelledPublisher(amqpConnection.connection).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });
  }
}
