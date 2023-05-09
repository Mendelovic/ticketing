import {
  Consumer,
  OrderCancelledEvent,
  OrderStatus,
  Queues,
} from "@mendeltickets/common";
import { Order } from "../../models/order";

export class OrderCancelledConsumer extends Consumer<OrderCancelledEvent> {
  readonly queueName = Queues.OrderCancelledPayments;
  messagesBeingProcessed = 0;

  async onMessage(msg: OrderCancelledEvent["data"]): Promise<void> {
    const order = await Order.findOne({
      _id: msg.id,
      version: msg.version - 1,
    });

    if (!order) {
      throw new Error("Order not found");
    }

    order.set({ status: OrderStatus.Cancelled });
    await order.save();
  }
}
