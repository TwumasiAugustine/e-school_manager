import mongoose, { Schema, Document, Types } from 'mongoose';
import { IUser } from './User'; // Assuming User model interface exists
import { ITeacher } from './Teacher'; // Assuming Teacher model interface exists
import { IStudent } from './Student'; // Assuming Student model interface exists
import { IClass } from './Class'; // Assuming Class model interface exists

// Interface for Address subdocument
interface IAddress {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

// Interface for Contact subdocument
interface IContact {
  phone?: string;
  email?: string;
  website?: string;
}

// Interface for Facility subdocument
interface IFacility extends Types.Subdocument {
  name: string;
  description?: string;
  capacity?: number;
  status: 'available' | 'maintenance' | 'occupied';
}

// Interface for Holiday subdocument (within Term)
interface ITermHoliday {
  name: string;
  date: Date;
  description?: string;
}

// Interface for Term subdocument (within AcademicCalendar)
interface ITerm {
  name: string;
  startDate: Date;
  endDate: Date;
  holidays?: ITermHoliday[];
}

// Interface for AcademicCalendar subdocument
interface IBranchAcademicCalendar {
  startDate?: Date;
  endDate?: Date;
  terms?: ITerm[];
}

// Interface for Settings subdocument
interface IBranchSettings {
  timezone?: string;
  currency?: string;
  language?: string;
  dateFormat?: string;
  maxStudentsPerClass?: number;
  attendanceThreshold?: number;
  gradingSystem: 'percentage' | 'letter_grade' | 'gpa';
}

// Interface for Department subdocument
interface IDepartment extends Types.Subdocument {
  name: string;
  head?: Types.ObjectId | IUser;
  description?: string;
}

// Interface for Resources subdocument
interface IBranchResources {
  teachers?: (Types.ObjectId | ITeacher)[];
  students?: (Types.ObjectId | IStudent)[];
  classes?: (Types.ObjectId | IClass)[];
}

// Interface for Vendor Contact subdocument
interface IVendorContact {
  name: string;
  phone: string;
  email: string;
}

// Interface for Vendor subdocument
interface IVendor extends Types.Subdocument {
  name: string;
  type: string;
  contact: IVendorContact;
  services: string[];
  status: 'active' | 'inactive' | 'pending';
}

// Interface for Fee Structure subdocument
interface IFeeStructure {
  category: string;
  amount: number;
  frequency: string;
  dueDate: number; // Assuming day of the month or similar
}

// Interface for Payment Method subdocument
interface IPaymentMethod {
  type: string;
  enabled: boolean;
}

// Interface for Financial subdocument
interface IBranchFinancial {
  feeStructure?: IFeeStructure[];
  paymentMethods?: IPaymentMethod[];
}

// Interface for Document subdocument
interface IBranchDocument extends Types.Subdocument {
  type: string;
  name: string;
  url: string;
  uploadedAt: Date;
}

// Interface for Branch document
export interface IBranch extends Document {
  name: string;
  code: string;
  address?: IAddress;
  contact?: IContact;
  principal?: Types.ObjectId | IUser;
  facilities?: Types.DocumentArray<IFacility>;
  academicCalendar?: IBranchAcademicCalendar;
  settings: IBranchSettings;
  departments?: Types.DocumentArray<IDepartment>;
  resources: IBranchResources;
  vendors?: Types.DocumentArray<IVendor>;
  financial?: IBranchFinancial;
  status: 'active' | 'inactive' | 'maintenance';
  documents?: Types.DocumentArray<IBranchDocument>;
  createdAt: Date;
  updatedAt: Date;

  // Virtuals
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;

  // Methods
  isAtCapacity(): boolean;
}

const addressSchema = new Schema<IAddress>({
  street: String,
  city: String,
  state: String,
  zipCode: String,
  country: String
}, { _id: false });

const contactSchema = new Schema<IContact>({
  phone: String,
  email: String,
  website: String
}, { _id: false });

const facilitySchema = new Schema<IFacility>({
  name: { type: String, required: true },
  description: String,
  capacity: Number,
  status: {
    type: String,
    enum: ['available', 'maintenance', 'occupied'],
    default: 'available',
    required: true
  }
});

const termHolidaySchema = new Schema<ITermHoliday>({
    name: { type: String, required: true },
    date: { type: Date, required: true },
    description: String
}, { _id: false });

const termSchema = new Schema<ITerm>({
    name: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    holidays: [termHolidaySchema]
}, { _id: false });

const branchAcademicCalendarSchema = new Schema<IBranchAcademicCalendar>({
    startDate: Date,
    endDate: Date,
    terms: [termSchema]
}, { _id: false });

const branchSettingsSchema = new Schema<IBranchSettings>({
  timezone: String,
  currency: String,
  language: String,
  dateFormat: String,
  maxStudentsPerClass: Number,
  attendanceThreshold: Number,
  gradingSystem: {
    type: String,
    enum: ['percentage', 'letter_grade', 'gpa'],
    default: 'percentage',
    required: true
  }
}, { _id: false });

const departmentSchema = new Schema<IDepartment>({
  name: { type: String, required: true },
  head: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  description: String
});

const branchResourcesSchema = new Schema<IBranchResources>({
  teachers: [{
    type: Schema.Types.ObjectId,
    ref: 'Teacher'
  }],
  students: [{
    type: Schema.Types.ObjectId,
    ref: 'Student'
  }],
  classes: [{
    type: Schema.Types.ObjectId,
    ref: 'Class'
  }]
}, { _id: false });

const vendorContactSchema = new Schema<IVendorContact>({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true }
}, { _id: false });

const vendorSchema = new Schema<IVendor>({
  name: { type: String, required: true },
  type: { type: String, required: true },
  contact: { type: vendorContactSchema, required: true },
  services: [String],
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'active',
    required: true
  }
});

const feeStructureSchema = new Schema<IFeeStructure>({
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    frequency: { type: String, required: true },
    dueDate: { type: Number, required: true }
}, { _id: false });

const paymentMethodSchema = new Schema<IPaymentMethod>({
    type: { type: String, required: true },
    enabled: { type: Boolean, required: true }
}, { _id: false });

const branchFinancialSchema = new Schema<IBranchFinancial>({
    feeStructure: [feeStructureSchema],
    paymentMethods: [paymentMethodSchema]
}, { _id: false });

const branchDocumentSchema = new Schema<IBranchDocument>({
  type: { type: String, required: true },
  name: { type: String, required: true },
  url: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now, required: true }
});


const branchSchema = new Schema<IBranch>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  address: addressSchema,
  contact: contactSchema,
  principal: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  facilities: [facilitySchema],
  academicCalendar: branchAcademicCalendarSchema,
  settings: { type: branchSettingsSchema, required: true },
  departments: [departmentSchema],
  resources: { type: branchResourcesSchema, required: true, default: {} },
  vendors: [vendorSchema],
  financial: branchFinancialSchema,
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active',
    required: true
  },
  documents: [branchDocumentSchema]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for total students
branchSchema.virtual('totalStudents').get(function(this: IBranch) {
  return this.resources?.students?.length ?? 0;
});

// Virtual for total teachers
branchSchema.virtual('totalTeachers').get(function(this: IBranch) {
  return this.resources?.teachers?.length ?? 0;
});

// Virtual for total classes
branchSchema.virtual('totalClasses').get(function(this: IBranch) {
  return this.resources?.classes?.length ?? 0;
});

// Method to check if branch is at capacity
branchSchema.methods.isAtCapacity = function(this: IBranch): boolean {
  const totalStudents = this.totalStudents;
  const maxCapacitySetting = this.settings?.maxStudentsPerClass;
  const totalClasses = this.totalClasses;

  if (maxCapacitySetting === undefined || totalClasses === undefined || totalClasses === 0) {
      return false; // Cannot determine capacity if settings or classes are missing/zero
  }
  const maxCapacity = maxCapacitySetting * totalClasses;
  return totalStudents >= maxCapacity;
};

// Indexes for better query performance
branchSchema.index({ code: 1 });
branchSchema.index({ status: 1 });
branchSchema.index({ 'settings.timezone': 1 });
branchSchema.index({ 'contact.email': 1 });

const Branch = mongoose.model<IBranch>('Branch', branchSchema);

export default Branch;