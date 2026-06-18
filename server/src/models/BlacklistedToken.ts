import mongoose, { Document, Schema } from 'mongoose';

export interface IBlacklistedToken extends Document {
  token: string;
  expiresAt: Date;
}

const blacklistedTokenSchema = new Schema<IBlacklistedToken>({
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true, expires: 0 }, // Document will automatically expire at this time
}, {
  timestamps: true,
});

export const BlacklistedToken = mongoose.model<IBlacklistedToken>('BlacklistedToken', blacklistedTokenSchema);
