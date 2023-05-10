import { Consumer, OrderCompletedEvent, Queues } from "@mendeltickets/common";
import { Order } from "../../models/order";

export class OrderCompletedConsumer extends Consumer<OrderCompletedEvent> {
  readonly queueName = Queues.OrderCompleted;
  messagesBeingProcessed = 0;

  async onMessage(msg: OrderCompletedEvent["data"]): Promise<void> {
    const order = await Order.findOne({
      _id: msg.id,
      version: msg.version - 1,
    });

    if (!order) {
      throw new Error("Order not found");
    }

    order.set({ status: msg.status });
    await order.save();
  }
}
