import { amqpConnection } from "./amqpConnection";

const start = async () => {
  if (!process.env.AMQP_URL) {
    throw new Error("AMQP_URL must be defined");
  }

  try {
    await amqpConnection.connect(
      process.env.AMQP_URL,
      process.env.RABBITMQ_CLIENT_NAME
    );

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
