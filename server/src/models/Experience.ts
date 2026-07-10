import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IExperience extends Document {
  userId: mongoose.Types.ObjectId;
  company: string;
  role: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
  technologies: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ExperienceSchema: Schema<IExperience> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
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
    description: {
      type: String,
      default: '',
    },
    technologies: [{
      type: String,
    }],
  },
  {
    timestamps: true,
  }
);

export const Experience: Model<IExperience> = mongoose.models.Experience || mongoose.model<IExperience>('Experience', ExperienceSchema);
export default Experience;
