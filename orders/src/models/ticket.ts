import mongoose from "mongoose";
import { Order, OrderStatus } from "./order";

interface ITicketAttrs {
  title: string;
  price: number;
}
export interface ITicketDoc extends mongoose.Document {
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
}

interface ITicketModel extends mongoose.Model<ITicketDoc> {
  build(attrs: ITicketAttrs): ITicketDoc;
}

const ticketSchema = new mongoose.Schema<ITicketAttrs>(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

ticketSchema.statics.build = (attrs: ITicketAttrs) => {
  return new Ticket(attrs);
};

// Run query to look at all orders. Find an order where the ticket
// is the ticket we just found and the orders status is not cancelled
// if we find an order from that means the ticket is reserved
ticketSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });

  return !!existingOrder;
};

const Ticket = mongoose.model<ITicketDoc, ITicketModel>("Ticket", ticketSchema);

export { Ticket };
