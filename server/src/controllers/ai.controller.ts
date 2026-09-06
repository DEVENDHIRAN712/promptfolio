import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AiService } from '../services/ai/ai.service';

export const generatePortfolio = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId || req.user?._id?.toString();
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { focusArea } = req.body;
    const portfolio = await AiService.generatePortfolio(userId, focusArea);
    res.status(200).json({ success: true, portfolio });
  } catch (error: any) {
    console.error('[AI Controller] generatePortfolio Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate AI portfolio.',
    });
  }
};

export const generateResume = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId || req.user?._id?.toString();
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { style, jobTitle, targetCompany, jobDescription } = req.body;
    const resume = await AiService.generateResume(userId, style || 'ATS', jobTitle, targetCompany, jobDescription);
    res.status(200).json({ success: true, resume });
  } catch (error: any) {
    console.error('[AI Controller] generateResume Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate AI resume.',
    });
  }
};

export const generateCoverLetter = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId || req.user?._id?.toString();
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { jobTitle, company, jobDescription } = req.body;
    if (!jobTitle || !company) {
      res.status(400).json({ message: 'Target job title and company are required.' });
      return;
    }

    const coverLetter = await AiService.generateCoverLetter(userId, jobTitle, company, jobDescription);
    res.status(200).json({ success: true, coverLetter });
  } catch (error: any) {
    console.error('[AI Controller] generateCoverLetter Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate AI cover letter.',
    });
  }
};

export const generateLinkedIn = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId || req.user?._id?.toString();
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { jobTarget, focusArea } = req.body;
    const linkedin = await AiService.generateLinkedIn(userId, jobTarget, focusArea);
    res.status(200).json({ success: true, linkedin });
  } catch (error: any) {
    console.error('[AI Controller] generateLinkedIn Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate LinkedIn makeover.',
    });
  }
};

export const generateReadme = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId || req.user?._id?.toString();
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { projectId, projectName, description, technologies } = req.body;
    const readme = await AiService.generateReadme(userId, projectId, projectName, description, technologies);
    res.status(200).json({ success: true, readme });
  } catch (error: any) {
    console.error('[AI Controller] generateReadme Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate GitHub README.',
    });
  }
};
