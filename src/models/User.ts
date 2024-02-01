import { Schema, model, models } from "mongoose";

type ModelType = {
  User: any;
};

export type UserType = {
  name: string;
  email: string;
  image: string;
};

const UserSchema = new Schema({
  name: String,
  email: String,
  image: String,
  emailVerified: Date,
});

export const User = (models as ModelType)?.User || model("User", UserSchema);
