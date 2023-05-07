import { Consumer, OrderCreatedEvent, Queues } from "@mendeltickets/common";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedConsumer extends Consumer<OrderCreatedEvent> {
  readonly queueName = Queues.OrderCreatedExpiration;
  messagesBeingProcessed = 0;

  async onMessage(msg: OrderCreatedEvent["data"]): Promise<void> {
    const delay = new Date(msg.expiresAt).getTime() - new Date().getTime();

    console.log("waiting:", delay);

    await expirationQueue.add({ orderId: msg.id }, { delay });
  }
}
