import mongoose, { Document, Schema } from 'mongoose';

interface IResponse {
  questionId: mongoose.Types.ObjectId;
  answer: string;
  isCorrect: boolean;
  timeTaken: number;
}

export interface IAssessment extends Document {
  studentId: mongoose.Types.ObjectId;
  skillId: mongoose.Types.ObjectId;
  responses: IResponse[];
  score: number;
  adaptiveLevel: number;
  aiAnalysis: string;
  fairnessFlags: string[];
  completedAt: Date;
}

const AssessmentSchema = new Schema<IAssessment>({
  studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  skillId: { type: Schema.Types.ObjectId, ref: 'Skill', required: true },
  responses: [
    {
      questionId: { type: Schema.Types.ObjectId, ref: 'Question' },
      answer: { type: String },
      isCorrect: { type: Boolean },
      timeTaken: { type: Number },
    },
  ],
  score: { type: Number, required: true },
  adaptiveLevel: { type: Number, default: 1 },
  aiAnalysis: { type: String, default: '' },
  fairnessFlags: [{ type: String }],
  completedAt: { type: Date, default: Date.now },
});

const Assessment = mongoose.model<IAssessment>('Assessment', AssessmentSchema);
export default Assessment;
