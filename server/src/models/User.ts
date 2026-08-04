import bcrypt from 'bcryptjs';
import { Document, Schema, Types, model } from 'mongoose';

const SALT_ROUNDS = 12;

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // Excluded from queries by default so a stray User.find() can never leak
    // hashes. Login opts back in with .select('+password').
    password: { type: String, required: true, select: false },
  },
  { timestamps: true }
);

// Guarded on isModified so updating a name does not re-hash an existing hash.
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
});

userSchema.methods.comparePassword = function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

export const User = model<IUser>('User', userSchema);
