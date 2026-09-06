import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import mongoose from 'mongoose';
import { User } from '../models/User';
import { Profile } from '../models/Profile';
import { Resume } from '../models/Resume';
import { Experience } from '../models/Experience';
import { Education } from '../models/Education';
import { Skill } from '../models/Skill';
import { Project } from '../models/Project';
import { Certificate } from '../models/Certificate';
import { GitHubConnection } from '../models/GitHubConnection';

const cleanData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('[Clean DB] Error: MONGODB_URI is not defined in environment.');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('[Clean DB] Connected to database for cleanup.');

    // Count before cleanup
    const countsBefore = {
      users: await User.countDocuments(),
      profiles: await Profile.countDocuments(),
      resumes: await Resume.countDocuments(),
      experiences: await Experience.countDocuments(),
      educations: await Education.countDocuments(),
      skills: await Skill.countDocuments(),
      projects: await Project.countDocuments(),
      certificates: await Certificate.countDocuments(),
      githubConnections: await GitHubConnection.countDocuments(),
    };

    console.log('[Clean DB] Counts before deletion:', JSON.stringify(countsBefore));

    // Cascade delete user data
    await Experience.deleteMany({});
    await Education.deleteMany({});
    await Skill.deleteMany({});
    await Project.deleteMany({});
    await Certificate.deleteMany({});
    await GitHubConnection.deleteMany({});
    await Resume.deleteMany({});
    await Profile.deleteMany({});
    await User.deleteMany({});

    // Count after cleanup
    const countsAfter = {
      users: await User.countDocuments(),
      profiles: await Profile.countDocuments(),
      resumes: await Resume.countDocuments(),
      experiences: await Experience.countDocuments(),
      educations: await Education.countDocuments(),
      skills: await Skill.countDocuments(),
      projects: await Project.countDocuments(),
      certificates: await Certificate.countDocuments(),
      githubConnections: await GitHubConnection.countDocuments(),
    };

    console.log('[Clean DB] Counts after deletion:', JSON.stringify(countsAfter));
    console.log('[Clean DB] Database successfully cleaned. All user-related test data removed.');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('[Clean DB] Cleanup failed with error:', (error as Error).message);
    process.exit(1);
  }
};

cleanData();
