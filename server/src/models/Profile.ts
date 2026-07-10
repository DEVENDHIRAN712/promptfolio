import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISocialLinks {
  linkedin?: string;
  github?: string;
  twitter?: string;
  portfolio?: string;
}

export interface IProfile extends Document {
  userId: mongoose.Types.ObjectId;
  title?: string;
  bio?: string;
  avatar?: string;
  location?: string;
  socialLinks: ISocialLinks;
  completionPercentage: number;
  aiStatus: 'idle' | 'analyzing' | 'optimized' | 'needs_improvement';
  createdAt: Date;
  updatedAt: Date;
}

const SocialLinksSchema = new Schema<ISocialLinks>({
  linkedin: { type: String, default: '' },
  github: { type: String, default: '' },
  twitter: { type: String, default: '' },
  portfolio: { type: String, default: '' },
}, { _id: false });

const ProfileSchema: Schema<IProfile> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      default: 'Full Stack Software Engineer',
    },
    bio: {
      type: String,
      default: 'Passionate software engineer building AI-powered web applications and modern digital experiences.',
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    },
    location: {
      type: String,
      default: 'San Francisco, CA',
    },
    socialLinks: {
      type: SocialLinksSchema,
      default: () => ({ linkedin: '', github: '', twitter: '', portfolio: '' }),
    },
    completionPercentage: {
      type: Number,
      default: 25,
    },
    aiStatus: {
      type: String,
      enum: ['idle', 'analyzing', 'optimized', 'needs_improvement'],
      default: 'optimized',
    },
  },
  {
    timestamps: true,
  }
);

export const Profile: Model<IProfile> = mongoose.models.Profile || mongoose.model<IProfile>('Profile', ProfileSchema);
export default Profile;
