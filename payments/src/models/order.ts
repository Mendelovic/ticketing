import { OrderStatus } from "@mendeltickets/common";
import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface IOrderAttrs {
  id: string; // ID needs to be the same as the ID in ordersService
  userId: string;
  price: number;
  status: OrderStatus;
}

interface IOrderDoc extends mongoose.Document {
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
}

interface IOrderModel extends mongoose.Model<IOrderDoc> {
  build(attrs: IOrderAttrs): IOrderDoc;
}

const orderSchema = new mongoose.Schema<IOrderAttrs>(
  {
    userId: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: String, required: true, enum: Object.values(OrderStatus) },
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

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: IOrderAttrs) => {
  return new Order({
    _id: attrs.id,
    price: attrs.price,
    userId: attrs.userId,
    status: attrs.status,
  });
};

const Order = mongoose.model<IOrderDoc, IOrderModel>("Order", orderSchema);

export { Order };
