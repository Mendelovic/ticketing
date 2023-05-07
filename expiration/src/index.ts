import { amqpConnection } from "./amqpConnection";
import { OrderCreatedConsumer } from "./events/consumers/order-created-consumer";

const start = async () => {
  if (!process.env.AMQP_URL) {
    throw new Error("AMQP_URL must be defined");
  }

  try {
    await amqpConnection.connect(
      process.env.AMQP_URL,
      process.env.RABBITMQ_CLIENT_NAME
    );

    new OrderCreatedConsumer(amqpConnection.connection).startConsuming();

    amqpConnection.connection.on("close", () => {
      process.exit();
    });
    process.on("SIGINT", async () => await amqpConnection.connection.close());
    process.on("SIGTERM", async () => await amqpConnection.connection.close());
  } catch (error) {
    console.error(error);
  }
};

start();
