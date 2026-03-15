import mongoose, { Schema, Document } from 'mongoose';

export interface IJob extends Document {
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Remote';
  salary: string;
  description: string;
  requirements: string[];
  category: 'Web Development' | 'Data Science' | 'Mobile Development' | 'DevOps' | 'Design' | 'Other';
  postedAt: Date;
}

const JobSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    type: { 
      type: String, 
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'], 
      required: true 
    },
    salary: { type: String, required: true },
    description: { type: String, required: true },
    requirements: { type: [String], default: [] },
    category: { 
      type: String, 
      enum: ['Web Development', 'Data Science', 'Mobile Development', 'DevOps', 'Design', 'Other'], 
      required: true 
    },
    postedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Job || mongoose.model<IJob>('Job', JobSchema);
