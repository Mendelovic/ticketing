import request from "supertest";
import { app } from "../../app";

const createTicket = (title: string) => {
  return request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title, price: 10 })
    .expect(201);
};

it("can fetch a list of tickets", async () => {
  await createTicket("test1");
  await createTicket("test2");
  await createTicket("test3");

  const res = await request(app).get("/api/tickets").send().expect(200);

  expect(res.body.length).toEqual(3);
});
