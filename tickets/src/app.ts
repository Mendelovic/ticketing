import express, { json } from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import {
  currentUser,
  errorHandler,
  NotFoundError,
} from "@mendeltickets/common";
import { createTickerRouter } from "./routes/new";
import { showTicketRouter } from "./routes/show";
import { indexTicketRouter } from "./routes";
import { updateTicketRouter } from "./routes/update";

const app = express();

// Traffic is being proxied to the app through ingress-nginx
// Express by default does not trust proxy https connection
app.set("trust proxy", true);
app.use(json());

// The cookie will not be encrypted,
// as it's only holding JWT, and JWT cannot be tampered
// - signed: false - the cookie data will not be encrypted with a secret key
// - secure: true - the cookie will only be sent over HTTPS connections

// HTTPS
// app.use(
//   cookieSession({
//     signed: false,
//     secure: process.env.NODE_ENV !== "test",
//   })
// );

// HTTP
app.use(cookieSession({ signed: false, secure: false }));

app.use(currentUser);

app.use(createTickerRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

// Custom error handler middleware
app.use(errorHandler);

export { app };
