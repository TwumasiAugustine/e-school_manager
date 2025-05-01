import mongoose, { Schema, Document, Types } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IBranch } from './Branch'; // Assuming Branch model interface exists

// Interface for Address subdocument (reusable)
interface IAddress {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

// Interface for User document
export interface IUser extends Document {
  
  firstName: string;
  lastName: string;
  email: string;
  password?: string; // Optional because it's selected: false
  role: 'student' | 'teacher' | 'admin' | 'parent' | 'super_admin';
  phoneNumber?: string;
  address?: IAddress;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  profilePicture?: string;
  isActive: boolean;
  lastLogin?: Date;
  branch: Types.ObjectId | IBranch;
  createdAt: Date;
  updatedAt: Date;

  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;

  // Virtuals
  fullName: string;
}

const addressSchema = new Schema<IAddress>({
  street: String,
  city: String,
  state: String,
  zipCode: String,
  country: String
}, { _id: false });

const userSchema = new Schema<IUser>({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    index: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false // Exclude password from query results by default
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin', 'parent'],
    required: true,
    index: true
  },
  phoneNumber: {
    type: String,
    trim: true
    // Add validation for phone number format if needed
  },
  address: addressSchema,
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  profilePicture: {
    type: String,
    default: 'default-profile.png' // Consider storing path or URL
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  lastLogin: {
    type: Date
  },
  branch: {
    type: Schema.Types.ObjectId,
    ref: 'Branch',
    required: true,
    index: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Hash password before saving
userSchema.pre<IUser>('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error); // Pass error to the next middleware
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  // 'this.password' might be undefined if not selected in the query
  // Ensure password field is selected when calling this method
  if (!this.password) {
      throw new Error('Password field not selected in query.');
  }
  return bcrypt.compare(candidatePassword, this.password);
};

// Virtual for full name
userSchema.virtual('fullName').get(function(this: IUser): string {
  return `${this.firstName} ${this.lastName}`.trim();
});

// Ensure virtual fields are included when converting to JSON/Object
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

const User = mongoose.model<IUser>('User', userSchema);

export default User;