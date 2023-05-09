import {
  Consumer,
  OrderStatus,
  PaymentCreatedEvent,
  Queues,
} from "@mendeltickets/common";
import { Order } from "../../models/order";

export class PaymentCreatedConsumer extends Consumer<PaymentCreatedEvent> {
  readonly queueName = Queues.PaymentCreated;
  messagesBeingProcessed = 0;

  async onMessage(msg: PaymentCreatedEvent["data"]): Promise<void> {
    const order = await Order.findById(msg.orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    order.set({ status: OrderStatus.Complete });
    await order.save();
    // Ideally when a change is made on the order that's gonna
    // Increment the version number, and an event should be published
    // Like "order-updated" to prevent mismatch between versions to other services
    // But in the context of this app, once an order status is "complete"
    // We expect that it's never gonna be updated ever again.
  }
}
