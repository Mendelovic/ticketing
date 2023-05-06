import mongoose from "mongoose";
import { amqpConnection } from "../../../amqpConnection";
import { Ticket } from "../../../models/ticket";
import { TicketUpdatedConsumer } from "../ticket-updated-consumer";
import { TicketUpdatedEvent } from "@mendeltickets/common";

const setup = async () => {
  // Create a listener
  const consumer = new TicketUpdatedConsumer(amqpConnection.connection);

  // Create and save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "test",
    price: 20,
  });
  await ticket.save();

  // Create a fake data object
  const data: TicketUpdatedEvent["data"] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: "updatedTest",
    price: 12,
    userId: "test",
  };

  return { consumer, ticket, data };
};

it("finds, updates and saves a ticket", async () => {
  const { consumer, data, ticket } = await setup();

  await consumer.onMessage(data);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it("throws an error if the event has a skipped version number", async () => {
  const { consumer, data, ticket } = await setup();

  data.version = 10;

  try {
    await consumer.onMessage(data);

    fail("Expected an error to be thrown");
  } catch (error: any) {
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toEqual("Ticket not found");
  }
});
