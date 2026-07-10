import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEducation extends Document {
  userId: mongoose.Types.ObjectId;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  grade?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EducationSchema: Schema<IEducation> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    institution: {
      type: String,
      required: true,
      trim: true,
    },
    degree: {
      type: String,
      required: true,
      trim: true,
    },
    fieldOfStudy: {
      type: String,
      default: '',
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      default: '',
    },
    current: {
      type: Boolean,
      default: false,
    },
    grade: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const Education: Model<IEducation> = mongoose.models.Education || mongoose.model<IEducation>('Education', EducationSchema);
export default Education;
