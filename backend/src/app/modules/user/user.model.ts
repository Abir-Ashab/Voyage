import { Model, Schema, model } from "mongoose";
import { User } from "./user.interface";

const userSchema = new Schema<User>({
  username: { type: String, required: true },
  email: { type: String, required: true },
  imageURL: { type: String, required: true },
});

export const UserModel = model<User>("User", userSchema);
