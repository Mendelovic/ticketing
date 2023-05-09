import { OrderCreatedEvent, OrderStatus } from "@mendeltickets/common";
import { amqpConnection } from "../../../amqpConnection";
import { OrderCreatedConsumer } from "../order-created-consumer";
import mongoose from "mongoose";
import { Order } from "../../../models/order";

it("replicates the order info", async () => {
  const consumer = new OrderCreatedConsumer(amqpConnection.connection);

  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    expiresAt: "test",
    userId: "fakeID",
    status: OrderStatus.Created,
    ticket: {
      id: "fakeID",
      price: 10,
    },
  };

  await consumer.onMessage(data);

  const order = await Order.findById(data.id);

  expect(order!.price).toEqual(data.ticket.price);
});
