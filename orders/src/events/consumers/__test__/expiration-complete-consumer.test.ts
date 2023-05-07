import { ExpirationCompleteEvent, OrderStatus } from "@mendeltickets/common";
import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";
import { ExpirationCompleteConsumer } from "../expiration-complete-consumer";
import { amqpConnection } from "../../../amqpConnection";
import { Order } from "../../../models/order";

const setup = async () => {
  const consumer = new ExpirationCompleteConsumer(amqpConnection.connection);

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "test",
    price: 20,
  });
  await ticket.save();

  const order = Order.build({
    status: OrderStatus.Created,
    userId: "test",
    expiresAt: new Date(),
    ticket,
  });
  await order.save();

  const data: ExpirationCompleteEvent["data"] = {
    orderId: order.id,
  };

  return { consumer, order, data };
};

it("updates the order status to cancelled", async () => {
  const { consumer, data, order } = await setup();

  await consumer.onMessage(data);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});
