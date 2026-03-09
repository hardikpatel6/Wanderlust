import { Schema, model, HydratedDocument } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password?: string;
  authProvider: "local" | "google";
  googleId?: string;
  role: "guest" | "host" | "admin";
  avatar?: string;
  isEmailVerified: boolean;
  refreshTokens?: string[];
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export type IUserDocument = HydratedDocument<IUser>;

const userSchema = new Schema<IUser>(
{
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  password: {
    type: String,
    select: false
  },
  authProvider: {
    type: String,
    enum: ["local", "google"],
    default: "local"
  },
  googleId: {
    type: String,
    index: true
  },
  role: {
    type: String,
    enum: ["guest", "host", "admin"],
    default: "guest"
  },
  avatar: {
    type: String
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  refreshTokens: [
    {
      type: String
    }
  ],
  resetPasswordToken: String,
  resetPasswordExpire: Date
},
{
  timestamps: true
}
);

const User = model<IUser>("User", userSchema);

export default User;
