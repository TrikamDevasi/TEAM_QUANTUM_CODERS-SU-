import mongoose, { Document, Schema } from 'mongoose';

export interface ICareerResult {
  title: string;
  match: number;
  salaryRange: string;
  growth: string;
  missingSkills: string[];
  timeToReady: string;
  roadmap: string[];
}

export interface ICareerPrediction extends Document {
  userId: mongoose.Types.ObjectId;
  skills: string[];
  interests: string[];
  education: string;
  careers: ICareerResult[];
  createdAt: Date;
}

const CareerResultSchema = new Schema<ICareerResult>(
  {
    title:         { type: String, required: true },
    match:         { type: Number, required: true },
    salaryRange:   { type: String, default: '' },
    growth:        { type: String, default: '' },
    missingSkills: { type: [String], default: [] },
    timeToReady:   { type: String, default: '' },
    roadmap:       { type: [String], default: [] },
  },
  { _id: false }
);

const CareerPredictionSchema = new Schema<ICareerPrediction>(
  {
    userId:    { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    skills:    { type: [String], default: [] },
    interests: { type: [String], default: [] },
    education: { type: String, default: '' },
    careers:   { type: [CareerResultSchema], default: [] },
  },
  { timestamps: true }
);

const CareerPrediction = mongoose.model<ICareerPrediction>('CareerPrediction', CareerPredictionSchema);
export default CareerPrediction;
