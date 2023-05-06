import mongoose from "mongoose";
import { amqpConnection } from "../../../amqpConnection";
import { OrderCreatedConsumer } from "../order-created-consumer";
import { OrderCreatedEvent, OrderStatus } from "@mendeltickets/common";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
  // Create an instance of the listener
  const consumer = new OrderCreatedConsumer(amqpConnection.connection);

  // Create and save a ticket
  const ticket = Ticket.build({
    title: "test",
    price: 99,
    userId: "test",
  });
  await ticket.save();

  // Create a fake data event
  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: "test",
    expiresAt: "fakeExpire",
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  return { consumer, ticket, data };
};

it("sets the orderId of the ticket", async () => {
  const { consumer, data, ticket } = await setup();

  // call the onMessage function with the data object
  await consumer.onMessage(data);

  // Write assertions to make sure orderId was set
  const updatedTicket = await Ticket.findById(ticket.id);
  console.log(updatedTicket?.orderId);
  expect(updatedTicket!.orderId).toEqual(data.id);
});
