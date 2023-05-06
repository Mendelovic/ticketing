import mongoose from "mongoose";

import { app } from "./app";
import { amqpConnection } from "./amqpConnection";
import { OrderCreatedConsumer } from "./events/consumers/order-created-consumer";
import { OrderCancelledConsumer } from "./events/consumers/order-cancelled-consumer";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }
  if (!process.env.AMQP_URL) {
    throw new Error("AMQP_URL must be defined");
  }

  try {
    await amqpConnection.connect(
      process.env.AMQP_URL,
      process.env.RABBITMQ_CLIENT_NAME
    );

    new OrderCreatedConsumer(amqpConnection.connection).startConsuming();
    new OrderCancelledConsumer(amqpConnection.connection).startConsuming();

    amqpConnection.connection.on("close", () => {
      process.exit();
    });
    process.on("SIGINT", async () => await amqpConnection.connection.close());
    process.on("SIGTERM", async () => await amqpConnection.connection.close());

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }

  app.listen(3000, () => {
    console.log("Listening on port 3000");
  });
};

start();
