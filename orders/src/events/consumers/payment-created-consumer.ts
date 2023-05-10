import {
  Consumer,
  OrderStatus,
  PaymentCreatedEvent,
  Queues,
} from "@mendeltickets/common";
import { Order } from "../../models/order";
import { OrderCompletedPublisher } from "../publishers/order-completed-publisher";
import { amqpConnection } from "../../amqpConnection";

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

    // Not important to await in this case, read comment below
    new OrderCompletedPublisher(amqpConnection.connection).publish({
      id: order.id,
      version: order.version,
      status: OrderStatus.Complete,
    });

    // Ideally when a change is made on the order that's gonna
    // Increment the version number, and an event should be published
    // Like "order-updated" to prevent mismatch between versions to other services
    // But in the context of this app, once an order status is "complete"
    // We expect that it's never gonna be updated ever again.

    // Update - I went ahead and implemented simple order-update
  }
}
