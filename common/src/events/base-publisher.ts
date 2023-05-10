import amqp from "amqplib";
import { Queues } from "./queues";

interface Event {
  queue: Queues;
  data: any;
}

export abstract class Publisher<T extends Event> {
  abstract queueName: T["queue"];

  constructor(protected conn: amqp.Connection) {}

  async publish(data: T["data"]) {
    try {
      const ch = await this.conn.createChannel();
      await ch.assertQueue(this.queueName);

      const isSent = ch.sendToQueue(
        this.queueName,
        Buffer.from(JSON.stringify(data))
      );

      // msg was not sent
      if (!isSent) throw new Error("Message could not be confirmed");

      // msg is successfuly sent
      console.log("Event published to queue:", this.queueName);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
