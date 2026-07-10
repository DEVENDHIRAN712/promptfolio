import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICertificate extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CertificateSchema: Schema<ICertificate> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    issuer: {
      type: String,
      required: true,
      trim: true,
    },
    issueDate: {
      type: String,
      required: true,
    },
    expiryDate: {
      type: String,
      default: '',
    },
    credentialId: {
      type: String,
      default: '',
    },
    credentialUrl: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const Certificate: Model<ICertificate> = mongoose.models.Certificate || mongoose.model<ICertificate>('Certificate', CertificateSchema);
export default Certificate;
