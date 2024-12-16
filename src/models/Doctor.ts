import mongoose, { Schema, Document, Model } from 'mongoose';

interface DoctorAttributes {
  name: string;
  email: string;
  password: string;
  specialization: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface DoctorDocument extends Document, DoctorAttributes {}

const DoctorSchema: Schema = new Schema<DoctorDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    specialization: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true, 
  }
);

const Doctor: Model<DoctorDocument> =
  mongoose.models.Doctor || mongoose.model<DoctorDocument>('Doctor', DoctorSchema);

export default Doctor;
