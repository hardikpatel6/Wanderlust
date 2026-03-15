import mongoose, { Schema, Document } from 'mongoose';

export interface IBlacklistedToken extends Document {
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

const blacklistedTokenSchema = new Schema<IBlacklistedToken>(
  {
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    // The expiresAt field is used to create a TTL (time-to-live) index.
    // MongoDB will automatically delete the document once the expiresAt time is reached.
    expiresAt: {
      type: Date,
      required: true,
      expires: 0, // This tells MongoDB to remove the document when Date.now() >= expiresAt
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const BlacklistedToken = mongoose.model<IBlacklistedToken>('BlacklistedToken', blacklistedTokenSchema);
