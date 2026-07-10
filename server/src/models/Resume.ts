import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IParsedResumeData {
  fullName?: string;
  email?: string;
  phone?: string;
  summary?: string;
  skills?: string[];
  rawText?: string;
}

export interface IResume extends Document {
  userId: mongoose.Types.ObjectId;
  fileName: string;
  originalName: string;
  fileUrl: string;
  fileSize: number;
  parsedData: IParsedResumeData;
  healthScore: number;
  reviewed: boolean;
  uploadedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ParsedDataSchema = new Schema<IParsedResumeData>({
  fullName: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  summary: { type: String, default: '' },
  skills: [{ type: String }],
  rawText: { type: String, default: '' },
}, { _id: false });

const ResumeSchema: Schema<IResume> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    parsedData: {
      type: ParsedDataSchema,
      default: () => ({ fullName: '', email: '', phone: '', summary: '', skills: [], rawText: '' }),
    },
    healthScore: {
      type: Number,
      default: 85,
    },
    reviewed: {
      type: Boolean,
      default: false,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const Resume: Model<IResume> = mongoose.models.Resume || mongoose.model<IResume>('Resume', ResumeSchema);
export default Resume;
