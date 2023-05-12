import express, { json } from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError } from "@mendeltickets/common";

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";

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

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

// Custom error handler middleware
app.use(errorHandler);

export { app };
