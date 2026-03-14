import mongoose, { Document, Schema } from 'mongoose';

interface ISkillEntry {
  skillId: mongoose.Types.ObjectId;
  score: number;
  lastAssessed: Date;
  history: { score: number; date: Date }[];
}

interface IIntervention {
  type: string;
  message: string;
  createdAt: Date;
  isRead: boolean;
}

export interface IStudent extends Document {
  userId: mongoose.Types.ObjectId;
  institutionId: mongoose.Types.ObjectId;
  enrollmentNumber: string;
  program: string;
  nsqfLevel: number;
  batch: string;
  state: string;
  gender: string;
  skills: ISkillEntry[];
  overallScore: number;
  careerPathways: string[];
  placementStatus: 'studying' | 'placed' | 'seeking' | 'higher_education';
  placedAt?: Date;
  placedRole?: string;
  salary?: number;
  passportHash?: string;
  interventions: IIntervention[];
}

const StudentSchema = new Schema<IStudent>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    institutionId: { type: Schema.Types.ObjectId, ref: 'Institution', required: true },
    enrollmentNumber: { type: String, required: true, unique: true },
    program: { type: String, required: true },
    nsqfLevel: { type: Number, min: 1, max: 8, required: true },
    batch: { type: String, required: true },
    state: { type: String, required: true },
    gender: { type: String, required: true },
    skills: [
      {
        skillId: { type: Schema.Types.ObjectId, ref: 'Skill' },
        score: { type: Number, min: 0, max: 100 },
        lastAssessed: { type: Date },
        history: [{ score: Number, date: Date }],
      },
    ],
    careerPathways: [{ type: String }],
    placementStatus: {
      type: String,
      enum: ['studying', 'placed', 'seeking', 'higher_education'],
      default: 'studying',
    },
    placedAt: { type: Date },
    placedRole: { type: String },
    salary: { type: Number },
    passportHash: { type: String },
    interventions: [
      {
        type: { type: String },
        message: { type: String },
        createdAt: { type: Date, default: Date.now },
        isRead: { type: Boolean, default: false },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

StudentSchema.virtual('overallScore').get(function (this: IStudent) {
  if (!this.skills || this.skills.length === 0) return 0;
  const total = this.skills.reduce((sum, s) => sum + (s.score || 0), 0);
  return Math.round(total / this.skills.length);
});

const Student = mongoose.model<IStudent>('Student', StudentSchema);
export default Student;
