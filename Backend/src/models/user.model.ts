import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password?: string; // Optional because of Google Sign-in
  googleId?: string; // For users who signed up with Google
  authProvider: 'local' | 'google';
  role: 'guest' | 'host' | 'admin';
  profilePicture: string;
  isVerified: boolean;

  // Airbnb specific properties (basic)
  bio?: string;
  phoneNumber?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };

  createdAt: Date;
  updatedAt: Date;

  // Instance methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default in queries
      required: function (this: any): boolean {
        // Password is required only if the auth provider is local
        return this.authProvider === 'local';
      }
    },
    googleId: {
      type: String,
      sparse: true,
      unique: true,
    },
    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },
    role: {
      type: String,
      enum: ['guest', 'host', 'admin'],
      default: 'guest',
    },
    profilePicture: {
      type: String,
      default: 'default.jpg', // Path to a default profile pic
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
    },
    phoneNumber: {
      type: String,
      match: [/^\+?[1-9]\d{1,14}$/, 'Please add a valid phone number'],
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// Encrypt password using bcrypt before saving
userSchema.pre('save', async function (this: any) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password') || !this.password) {
    return;
  }

  // Generate a salt and hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to verify if a given password matches the db hash
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  // if not a local user or password not selected
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to generate an access token (short-lived)
userSchema.methods.generateAccessToken = function (): string {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_ACCESS_SECRET || 'default_access_secret',
    { expiresIn: process.env.JWT_ACCESS_EXPIRE || '15m' } as jwt.SignOptions
  );
};

// Method to generate a refresh token (long-lived)
userSchema.methods.generateRefreshToken = function (): string {
  return jwt.sign(
    { id: this._id }, // Usually only ID goes in refresh token
    process.env.JWT_REFRESH_SECRET || 'default_refresh_secret',
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' } as jwt.SignOptions
  );
};

export const User = mongoose.model<IUser>('User', userSchema);
