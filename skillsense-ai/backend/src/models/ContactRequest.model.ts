import mongoose, { Document, Schema } from 'mongoose';

export interface IContactRequest extends Document {
  name: string;
  email: string;
  organization: string;
  role: string;
  phone?: string;
  message: string;
  privacyAccepted: boolean;
  status: 'new' | 'contacted' | 'demo_scheduled';
}

const ContactRequestSchema = new Schema<IContactRequest>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    organization: { type: String, required: true },
    role: { type: String, required: true },
    phone: { type: String },
    message: { type: String, required: true },
    privacyAccepted: { type: Boolean, required: true },
    status: {
      type: String,
      enum: ['new', 'contacted', 'demo_scheduled'],
      default: 'new',
    },
  },
  { timestamps: true }
);

const ContactRequest = mongoose.model<IContactRequest>('ContactRequest', ContactRequestSchema);
export default ContactRequest;
