import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISocialLinks {
  linkedin?: string;
  github?: string;
  twitter?: string;
  portfolio?: string;
}

export type PortfolioThemeType = 'Apple' | 'Glass' | 'Minimal' | 'Cyberpunk' | 'Developer Terminal' | 'Modern SaaS' | 'Neo Brutalist' | 'Aurora Prism' | 'Creative Studio' | 'Architect Grid';

export interface IProfile extends Document {
  userId: mongoose.Types.ObjectId;
  username?: string;
  title?: string;
  bio?: string;
  avatar?: string;
  location?: string;
  socialLinks: ISocialLinks;
  completionPercentage: number;
  aiStatus: 'idle' | 'analyzing' | 'optimized' | 'needs_improvement';
  theme: PortfolioThemeType;
  isPublished: boolean;
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
    username: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
      sparse: true,
    },
    title: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
    avatar: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    socialLinks: {
      type: SocialLinksSchema,
      default: () => ({ linkedin: '', github: '', twitter: '', portfolio: '' }),
    },
    completionPercentage: {
      type: Number,
      default: 0,
    },
    aiStatus: {
      type: String,
      enum: ['idle', 'analyzing', 'optimized', 'needs_improvement'],
      default: 'idle',
    },
    theme: {
      type: String,
      enum: ['Apple', 'Glass', 'Minimal', 'Cyberpunk', 'Developer Terminal', 'Modern SaaS', 'Neo Brutalist', 'Aurora Prism', 'Creative Studio', 'Architect Grid'],
      default: 'Apple',
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Profile: Model<IProfile> = mongoose.models.Profile || mongoose.model<IProfile>('Profile', ProfileSchema);
export default Profile;
