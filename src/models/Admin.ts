import mongoose, { Schema, Document, Model } from 'mongoose';

interface AdminAttributes {
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface AdminDocument extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema: Schema<AdminDocument> = new Schema<AdminDocument>(
  {
    name: {
      type: String,
      required: [true, "Admin name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Admin email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ], 
    },
    password: {
      type: String,
      required: [true, "Admin password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
    },
  },
  {
    timestamps: true, 
    versionKey: false,
  }
);

AdminSchema.pre("save", function (next) {
  console.log(`Admin document is being saved: ${this.name}`);
  next();
});

AdminSchema.index({ email: 1 });

const Admin: Model<AdminDocument> =
  mongoose.models.Admin || mongoose.model<AdminDocument>('Admin', AdminSchema);

export default Admin;
