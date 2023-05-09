import mongoose from "mongoose";
import { amqpConnection } from "../../../amqpConnection";
import { Order } from "../../../models/order";
import { OrderCancelledConsumer } from "../order-cancelled-consumer";
import { OrderCancelledEvent, OrderStatus } from "@mendeltickets/common";

it("updates the status of the order", async () => {
  const consumer = new OrderCancelledConsumer(amqpConnection.connection);

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 20,
    status: OrderStatus.Created,
    userId: "test",
  });
  await order.save();

  const data: OrderCancelledEvent["data"] = {
    id: order.id,
    version: 1,
    ticket: { id: "fakeID" },
  };

  await consumer.onMessage(data);

  const updatedOrder = await Order.findById(data.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});
