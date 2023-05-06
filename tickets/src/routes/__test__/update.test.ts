import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../../events/publishers/ticket-updated-publisher";

it("returns a 404 if the provided id does not exist", async () => {
  const randomId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${randomId}`)
    .set("Cookie", global.signin())
    .send({
      title: "test",
      price: 20,
    })
    .expect(404);
});

it("returns a 401 if the user is not authenticated", async () => {
  const randomId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${randomId}`)
    .send({
      title: "test",
      price: 20,
    })
    .expect(401);
});

it("returns a 401 if the user does not own the ticket", async () => {
  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: "test", price: 20 });

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", global.signin())
    .send({ title: "testUpdated", price: 200 })
    .expect(401);
});

it("returns a 40 if the user provides an invalid title or price", async () => {
  const cookie = global.signin();

  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "test", price: 20 });

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "", price: 20 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "testUpdate", price: -20 })
    .expect(400);
});

it("updates the ticket provided valid inputs", async () => {
  const cookie = global.signin();

  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "test", price: 20 });

  const updatedTitle = "UpdatedTitle";
  const updatedPrice = 250;

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", cookie)
    .send({ title: updatedTitle, price: updatedPrice })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${res.body.id}`)
    .send();

  expect(ticketResponse.body.title).toEqual(updatedTitle);
  expect(ticketResponse.body.price).toEqual(updatedPrice);
});

it("publishes an event", async () => {
  const cookie = global.signin();

  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "test", price: 20 });

  const updatedTitle = "UpdatedTitle";
  const updatedPrice = 250;

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", cookie)
    .send({ title: updatedTitle, price: updatedPrice })
    .expect(200);

  expect(TicketUpdatedPublisher.prototype.publish).toHaveBeenCalled();
});

it("rejects updates if the  ticket is reserved", async () => {
  const cookie = global.signin();

  // Create ticket
  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "test", price: 20 });

  // Add orderId (meaning it is reserved and cannot be edited)
  const ticket = await Ticket.findById(res.body.id);
  ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  await ticket!.save();

  // Update ticket
  const updatedTitle = "UpdatedTitle";
  const updatedPrice = 250;

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", cookie)
    .send({ title: updatedTitle, price: updatedPrice })
    .expect(400);
});
