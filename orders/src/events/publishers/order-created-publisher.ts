import {
  OrderCreatedEvent,
  Publisher,
  Queues,
  Exchanges,
} from "@mendeltickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  // TODO: REMINDER - There are 2 queues that can assigned to it.
  // Find an elegant solution for this, right now the naming is confusing.
  readonly queueName = Queues.OrderCreatedTickets; // Queues.OrderCreatedExpiration

  private readonly ticketServiceQueueName: Queues = Queues.OrderCreatedTickets;
  private readonly expirationQueueName: Queues = Queues.OrderCreatedExpiration;

  private readonly exchangeName: OrderCreatedEvent["exchange"] =
    Exchanges.OrderCreated;
  private exchangeType = "fanout";

  // Custom publish
  async publish(data: OrderCreatedEvent["data"]): Promise<void> {
    try {
      const ch = await this.conn.createChannel();
      await ch.assertExchange(this.exchangeName, this.exchangeType, {
        durable: true,
      });

      await ch.assertQueue(this.expirationQueueName);
      await ch.assertQueue(this.ticketServiceQueueName);

      await ch.bindQueue(this.expirationQueueName, this.exchangeName, "");
      await ch.bindQueue(this.ticketServiceQueueName, this.exchangeName, "");

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
