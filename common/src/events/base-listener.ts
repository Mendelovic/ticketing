import amqp from "amqplib";
import { Queues } from "./queues";

interface Event {
  queue: Queues;
  data: any;
}

export abstract class Consumer<T extends Event> {
  abstract queueName: T["queue"];
  abstract messagesBeingProcessed: number;
  protected ch?: amqp.Channel | null;
  protected consumerTag?: string | null;

  abstract onMessage(msg: T["data"]): Promise<void>;

  constructor(protected conn: amqp.Connection) {}

  async startConsuming() {
    try {
      this.ch = await this.conn.createChannel();
      await this.ch.assertQueue(this.queueName);

      console.log("Ready to consume messages...");
      const { consumerTag } = await this.ch.consume(
        this.queueName,
        this.handleMessage.bind(this)
      );
      this.consumerTag = consumerTag;
    } catch (error) {
      console.error(error);
    }
  }

  private async handleMessage(msg: amqp.ConsumeMessage | null) {
    if (!msg) return;
    this.messagesBeingProcessed++;

    const parsedMsg = JSON.parse(msg.content.toString());
    console.log(
      `Received: ${msg.fields.exchange} ${msg.fields.routingKey}`,
      parsedMsg
    );

    try {
      await this.onMessage(parsedMsg);
      // if onMessage resolved successfully run some code
      console.log("Acking message...");
      this.ch!.ack(msg);
    } catch (error) {
      // otherwise if it did not resolve successfully run other code
      console.log("Nacking message...");
      this.ch!.nack(msg);
    } finally {
      console.log("Done!");
      this.messagesBeingProcessed--;
    }
  }

  public async stopConsuming(): Promise<void> {
    if (!this.ch || !this.consumerTag) return;

    try {
      await this.ch.cancel(this.consumerTag);
      this.consumerTag = null;

      while (this.messagesBeingProcessed > 0) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      console.log("Closing channel...");
      await this.ch.close();
      this.ch = null;

      console.log("Closing connection...");
      await this.conn.close();

      console.log("Ready to shutdown!");
    } catch (error) {
      console.error("Error closing connection");
    }
  }
}
