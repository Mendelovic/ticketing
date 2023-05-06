import { TicketCreatedEvent } from "@mendeltickets/common";
import { amqpConnection } from "../../../amqpConnection";
import { TicketCreatedConsumer } from "../ticket-created-consumer";
import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";

it("creates and saves a ticket", async () => {
  // Create an instance of the listener
  const consumer = new TicketCreatedConsumer(amqpConnection.connection);

  // Create a fake data event
  const data: TicketCreatedEvent["data"] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "test",
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // call the onMessage function with the data object
  await consumer.onMessage(data);

  // Write assertions to make sure a ticket was created
  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});
