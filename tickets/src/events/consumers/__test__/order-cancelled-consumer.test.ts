import mongoose from "mongoose";
import { amqpConnection } from "../../../amqpConnection";
import { Ticket } from "../../../models/ticket";
import { OrderCancelledConsumer } from "../order-cancelled-consumer";
import { OrderCancelledEvent } from "@mendeltickets/common";

const setup = async () => {
  const consumer = new OrderCancelledConsumer(amqpConnection.connection);

  const orderId = new mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({
    title: "test",
    price: 20,
    userId: "testUserID",
    orderId,
  });
  await ticket.save();

  const data: OrderCancelledEvent["data"] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  return { data, ticket, orderId, consumer };
};

it("updates the ticket", async () => {
  const { consumer, data, orderId, ticket } = await setup();

  await consumer.onMessage(data);

  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.orderId).not.toBeDefined();
});
