import mongoose from "mongoose";
import { PasswordManager } from "../services/password-manager";

// An interface that describes the properties
// that are required to create a new User.
// This describe what it takes to create a User.
interface IUserAttr {
  email: string;
  password: string;
}

// An interface that describes the properties
// that a User model has.
// This describes what the entire collection of Users looks like (or at least methods associated with the User model)
interface IUserModel extends mongoose.Model<IUserDoc> {
  build(attrs: IUserAttr): IUserDoc;
}

// An interface that describes the properties
// that a User Document has.
// This describes what properties a single User has.
interface IUserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema<IUserAttr>(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    // perhaps not the best location for this logic which is "view level" logic
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

// middleware function implemented in mongoose
// will run every time 'save' on user is called.
// 'this' refers to the user mongo document
userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await PasswordManager.toHash(this.get("password"));
    this.set("password", hashed);
  }

  done();
});

// Workaround the mongoose problem with TS
userSchema.statics.build = (attrs: IUserAttr) => {
  return new User(attrs);
};

const User = mongoose.model<IUserDoc, IUserModel>("User", userSchema);

export { User };
