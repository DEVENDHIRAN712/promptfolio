import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProject extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  liveUrl?: string;
  githubUrl?: string;
  technologies: string[];
  featured: boolean;
  source: 'manual' | 'github';
  stars?: number;
  forks?: number;
  topics?: string[];
  readme?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema<IProject> = new Schema(
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
    description: {
      type: String,
      default: '',
    },
    liveUrl: {
      type: String,
      default: '',
    },
    githubUrl: {
      type: String,
      default: '',
    },
    technologies: [{
      type: String,
    }],
    featured: {
      type: Boolean,
      default: false,
    },
    source: {
      type: String,
      enum: ['manual', 'github'],
      default: 'manual',
    },
    stars: {
      type: Number,
      default: 0,
    },
    forks: {
      type: Number,
      default: 0,
    },
    topics: [{
      type: String,
    }],
    readme: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const Project: Model<IProject> = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
export default Project;
