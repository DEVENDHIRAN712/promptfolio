import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISkill extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'DevOps' | 'AI/ML' | 'Other';
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  yearsOfExperience?: number;
  createdAt: Date;
  updatedAt: Date;
}

const SkillSchema: Schema<ISkill> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['Frontend', 'Backend', 'Database', 'DevOps', 'AI/ML', 'Other'],
      default: 'Frontend',
    },
    proficiency: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      default: 'Intermediate',
    },
    yearsOfExperience: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

export const Skill: Model<ISkill> = mongoose.models.Skill || mongoose.model<ISkill>('Skill', SkillSchema);
export default Skill;
