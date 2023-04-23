import mongoose from "mongoose";

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

const userSchema = new mongoose.Schema<IUserAttr>({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Workaround the mongoose problem with TS
userSchema.statics.build = (attrs: IUserAttr) => {
  return new User(attrs);
};

const User = mongoose.model<IUserDoc, IUserModel>("User", userSchema);

export { User };
