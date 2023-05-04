import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest } from "@mendeltickets/common";
import { Ticket } from "../models/ticket";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import { amqpConnection } from "../amqpConnection";

const router = express.Router();

router.post(
  "/api/tickets",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id, // if currentUser was null it would've returned an error in the middleware
    });

    await ticket.save();

    // There might be a case where a ticket is saved to the db, but
    // the connection to RabbitMQ will be lost hence the event will not
    // be persisted, which will cause an issue with data integrity between services.
    // Optimal solution would be an event should be saved into the database
    // with a database transaction, meaning both 'ticket' and 'event' should be saved
    // otherwise "Unroll". Each event will have a "sent?" property.
    // Then some code will poll the db and process (send) the events that were not sent yet.
    // Hence, "Cutting a corner".
    await new TicketCreatedPublisher(amqpConnection.connection).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });

    res.status(201).send(ticket);
  }
);

export { router as createTickerRouter };
