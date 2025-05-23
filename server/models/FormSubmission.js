import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  originalname: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true },
  buffer: { type: Buffer, required: true } 
}, { _id: false });

const FormSubmissionSchema = new mongoose.Schema({
  // Personal Information
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true 
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },

  identityDocument: [fileSchema], 
  residencyProof: [fileSchema],
  qualifications: [fileSchema],
  businessPermit: [fileSchema],
  liabilityInsurance: [fileSchema],
  companyStatutes: [fileSchema],

  // Address Information
  address: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  zipCode: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true
  },

  // Professional Information
  taxNumber: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  vatNumber: {
    type: String,
    trim: true
  },
  bankDetails: {
    type: String,
    required: true,
    trim: true
  },

  // Pricing Information
  hourlyRate: {
    type: Number,
    required: true,
    min: 0,
    max: 1000
  },
  halfHourRate: {
    type: Number,
    required: true,
    min: 0,
    max: 1000
  },

  // IP & User-Agent
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  }
}, {
  timestamps: true
});

const FormSubmission = mongoose.model('FormSubmission', FormSubmissionSchema);

export default FormSubmission;