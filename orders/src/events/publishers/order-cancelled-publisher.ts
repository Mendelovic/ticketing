import {
  Exchanges,
  OrderCancelledEvent,
  Publisher,
  Queues,
} from "@mendeltickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly queueName = Queues.OrderCancelledTickets; // | Queues.OrderCancelledPayments

  private readonly ticketServiceQueueName = Queues.OrderCancelledTickets;
  private readonly paymentServiceQueueName = Queues.OrderCancelledPayments;

  private readonly exchangeName: OrderCancelledEvent["exchange"] =
    Exchanges.OrderCancelled;
  private exchangeType = "fanout";

  // Custom publish
  override async publish(data: OrderCancelledEvent["data"]): Promise<void> {
    try {
      const ch = await this.conn.createChannel();
      await ch.assertExchange(this.exchangeName, this.exchangeType, {
        durable: true,
      });

      await ch.assertQueue(this.ticketServiceQueueName);
      await ch.assertQueue(this.paymentServiceQueueName);

      await ch.bindQueue(this.ticketServiceQueueName, this.exchangeName, "");
      await ch.bindQueue(this.paymentServiceQueueName, this.exchangeName, "");

      const isSent = ch.publish(
        this.exchangeName,
        "",
        Buffer.from(JSON.stringify(data))
      );

      // msg was not sent
      if (!isSent) throw new Error("Message could not be confirmed");

      // msg is successfuly sent
      console.log("Event published to exchange:", this.exchangeName);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
