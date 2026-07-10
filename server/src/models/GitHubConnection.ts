import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGitHubConnection extends Document {
  userId: mongoose.Types.ObjectId;
  username: string;
  avatarUrl?: string;
  profileUrl?: string;
  publicRepos?: number;
  connectedAt: Date;
  lastSyncedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const GitHubConnectionSchema: Schema<IGitHubConnection> = new Schema(
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
      required: true,
      trim: true,
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    profileUrl: {
      type: String,
      default: '',
    },
    publicRepos: {
      type: Number,
      default: 0,
    },
    connectedAt: {
      type: Date,
      default: Date.now,
    },
    lastSyncedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const GitHubConnection: Model<IGitHubConnection> = mongoose.models.GitHubConnection || mongoose.model<IGitHubConnection>('GitHubConnection', GitHubConnectionSchema);
export default GitHubConnection;
