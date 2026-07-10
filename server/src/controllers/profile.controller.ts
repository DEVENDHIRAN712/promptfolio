import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Profile } from '../models/Profile';
import { Experience } from '../models/Experience';
import { Education } from '../models/Education';
import { Skill } from '../models/Skill';
import { Project } from '../models/Project';
import { Certificate } from '../models/Certificate';
import { GitHubConnection } from '../models/GitHubConnection';
import { Resume } from '../models/Resume';

// Helper to calculate profile completion percentage dynamically
const calculateCompletion = async (userId: string): Promise<number> => {
  let score = 0;
  const profile = await Profile.findOne({ userId });
  if (profile?.bio) score += 20;
  if (profile?.avatar) score += 10;
  if (profile?.socialLinks?.linkedin || profile?.socialLinks?.github) score += 15;

  const expCount = await Experience.countDocuments({ userId });
  if (expCount > 0) score += 15;

  const eduCount = await Education.countDocuments({ userId });
  if (eduCount > 0) score += 10;

  const skillCount = await Skill.countDocuments({ userId });
  if (skillCount > 0) score += 15;

  const projCount = await Project.countDocuments({ userId });
  if (projCount > 0) score += 15;

  const bounded = Math.min(score, 100);
  if (profile) {
    profile.completionPercentage = bounded;
    await profile.save();
  }
  return bounded;
};

// GET /api/profile/all - Retrieve aggregated modular profile
export const getCompleteProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    let profile = await Profile.findOne({ userId });
    if (!profile) {
      profile = await Profile.create({ userId });
    }

    const experiences = await Experience.find({ userId }).sort({ startDate: -1 });
    const educations = await Education.find({ userId }).sort({ startDate: -1 });
    const skills = await Skill.find({ userId });
    const projects = await Project.find({ userId }).sort({ createdAt: -1 });
    const certificates = await Certificate.find({ userId }).sort({ issueDate: -1 });
    const githubConnection = await GitHubConnection.findOne({ userId });
    const latestResume = await Resume.findOne({ userId }).sort({ uploadedAt: -1 });

    const completion = await calculateCompletion(userId);

    res.status(200).json({
      profile,
      experiences,
      educations,
      skills,
      projects,
      certificates,
      githubConnection: githubConnection || null,
      latestResume: latestResume || null,
      completionPercentage: completion,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch complete profile.', error: (error as Error).message });
  }
};

// PUT /api/profile/about - Update Profile info & social links
export const updateAbout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { title, bio, location, avatar, socialLinks } = req.body;

    const profile = await Profile.findOneAndUpdate(
      { userId },
      { $set: { title, bio, location, avatar, socialLinks } },
      { new: true, upsert: true }
    );

    await calculateCompletion(userId!);

    res.status(200).json({ message: 'Profile updated successfully', profile });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update about section.', error: (error as Error).message });
  }
};

// ==================== EXPERIENCE CRUD ====================
export const createExperience = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const exp = await Experience.create({ ...req.body, userId: req.userId });
    await calculateCompletion(req.userId!);
    res.status(201).json({ message: 'Experience added', experience: exp });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add experience', error: (error as Error).message });
  }
};

export const updateExperience = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const exp = await Experience.findOneAndUpdate({ _id: id, userId: req.userId }, req.body, { new: true });
    if (!exp) {
      res.status(404).json({ message: 'Experience not found' });
      return;
    }
    await calculateCompletion(req.userId!);
    res.status(200).json({ message: 'Experience updated', experience: exp });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update experience', error: (error as Error).message });
  }
};

export const deleteExperience = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await Experience.findOneAndDelete({ _id: id, userId: req.userId });
    await calculateCompletion(req.userId!);
    res.status(200).json({ message: 'Experience deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete experience', error: (error as Error).message });
  }
};

// ==================== EDUCATION CRUD ====================
export const createEducation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const edu = await Education.create({ ...req.body, userId: req.userId });
    await calculateCompletion(req.userId!);
    res.status(201).json({ message: 'Education added', education: edu });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add education', error: (error as Error).message });
  }
};

export const updateEducation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const edu = await Education.findOneAndUpdate({ _id: id, userId: req.userId }, req.body, { new: true });
    if (!edu) {
      res.status(404).json({ message: 'Education not found' });
      return;
    }
    await calculateCompletion(req.userId!);
    res.status(200).json({ message: 'Education updated', education: edu });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update education', error: (error as Error).message });
  }
};

export const deleteEducation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await Education.findOneAndDelete({ _id: id, userId: req.userId });
    await calculateCompletion(req.userId!);
    res.status(200).json({ message: 'Education deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete education', error: (error as Error).message });
  }
};

// ==================== SKILL CRUD ====================
export const createSkill = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const skill = await Skill.create({ ...req.body, userId: req.userId });
    await calculateCompletion(req.userId!);
    res.status(201).json({ message: 'Skill added', skill });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add skill', error: (error as Error).message });
  }
};

export const updateSkill = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const skill = await Skill.findOneAndUpdate({ _id: id, userId: req.userId }, req.body, { new: true });
    if (!skill) {
      res.status(404).json({ message: 'Skill not found' });
      return;
    }
    await calculateCompletion(req.userId!);
    res.status(200).json({ message: 'Skill updated', skill });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update skill', error: (error as Error).message });
  }
};

export const deleteSkill = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await Skill.findOneAndDelete({ _id: id, userId: req.userId });
    await calculateCompletion(req.userId!);
    res.status(200).json({ message: 'Skill deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete skill', error: (error as Error).message });
  }
};

// ==================== PROJECT CRUD ====================
export const createProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const proj = await Project.create({ ...req.body, userId: req.userId });
    await calculateCompletion(req.userId!);
    res.status(201).json({ message: 'Project added', project: proj });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add project', error: (error as Error).message });
  }
};

export const updateProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const proj = await Project.findOneAndUpdate({ _id: id, userId: req.userId }, req.body, { new: true });
    if (!proj) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }
    await calculateCompletion(req.userId!);
    res.status(200).json({ message: 'Project updated', project: proj });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update project', error: (error as Error).message });
  }
};

export const deleteProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await Project.findOneAndDelete({ _id: id, userId: req.userId });
    await calculateCompletion(req.userId!);
    res.status(200).json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete project', error: (error as Error).message });
  }
};

// ==================== CERTIFICATE CRUD ====================
export const createCertificate = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const cert = await Certificate.create({ ...req.body, userId: req.userId });
    res.status(201).json({ message: 'Certificate added', certificate: cert });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add certificate', error: (error as Error).message });
  }
};

export const updateCertificate = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const cert = await Certificate.findOneAndUpdate({ _id: id, userId: req.userId }, req.body, { new: true });
    if (!cert) {
      res.status(404).json({ message: 'Certificate not found' });
      return;
    }
    res.status(200).json({ message: 'Certificate updated', certificate: cert });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update certificate', error: (error as Error).message });
  }
};

export const deleteCertificate = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await Certificate.findOneAndDelete({ _id: id, userId: req.userId });
    res.status(200).json({ message: 'Certificate deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete certificate', error: (error as Error).message });
  }
};
