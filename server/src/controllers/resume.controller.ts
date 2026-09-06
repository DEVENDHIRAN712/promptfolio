import { Response } from 'express';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import { AuthRequest } from '../middleware/auth';
import { Resume, IParsedResumeData } from '../models/Resume';
import { Profile } from '../models/Profile';
import { Skill } from '../models/Skill';

// Configure Multer storage
const uploadDir = process.env.UPLOAD_DIR
  ? path.join(process.env.UPLOAD_DIR, 'resumes')
  : path.resolve(process.cwd(), 'uploads/resumes');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req: AuthRequest, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${req.userId || 'user'}-${uniqueSuffix}${ext}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF resume files are allowed.'));
    }
  },
});

// Helper: Simple heuristic text parser for immediate review
const extractResumeHeuristics = (text: string): IParsedResumeData => {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = text.match(/(\+\d{1,3}[\s-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/);

  // Common skills keyword detection
  const techKeywords = [
    'React', 'React.js', 'TypeScript', 'JavaScript', 'Node.js', 'Express', 'Express.js', 'MongoDB', 'PostgreSQL',
    'GraphQL', 'Docker', 'AWS', 'Python', 'Tailwind CSS', 'Vite', 'Next.js', 'Redux',
    'Git', 'CI/CD', 'Jest', 'C++', 'C#', 'Java', 'Rust', 'Kubernetes', 'Linux'
  ];

  const lowerText = text.toLowerCase();
  const detectedSkills = techKeywords.filter(skill =>
    lowerText.includes(skill.toLowerCase())
  );

  return {
    fullName: lines[0] || 'Extracted Name',
    email: emailMatch ? emailMatch[0] : '',
    phone: phoneMatch ? phoneMatch[0] : '',
    summary: lines.slice(1, 5).join(' '),
    skills: detectedSkills,
    rawText: text.slice(0, 3000), // store first 3k chars for reference
  };
};

// POST /api/resume/upload - Upload and parse PDF
export const uploadAndParseResume = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded. Please provide a PDF resume.' });
      return;
    }

    const filePath = req.file.path;
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);

    const parsedData = extractResumeHeuristics(pdfData.text);

    // Calculate a health score
    let healthScore = 60;
    if (parsedData.email) healthScore += 10;
    if (parsedData.phone) healthScore += 10;
    if (parsedData.skills && parsedData.skills.length >= 4) healthScore += 15;
    if (pdfData.text.length > 500) healthScore += 5;

    const resume = await Resume.create({
      userId: req.userId,
      fileName: req.file.filename,
      originalName: req.file.originalname,
      fileUrl: `/uploads/resumes/${req.file.filename}`,
      fileSize: req.file.size,
      parsedData,
      healthScore: Math.min(healthScore, 100),
      reviewed: false,
    });

    res.status(201).json({
      message: 'Resume uploaded and parsed successfully.',
      resume,
      parsedData,
    });
  } catch (error) {
    console.error('[Resume Parse Error]:', error);
    res.status(500).json({ message: 'Failed to upload or parse resume.', error: (error as Error).message });
  }
};

// Helper to safely escape strings inside RegExp
function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// PUT /api/resume/save/:id - Review and save edited resume data to profile
export const saveReviewedResume = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { fullName, email, phone, summary, skills, applyToProfile } = req.body;

    const resume = await Resume.findOneAndUpdate(
      { _id: id, userId: req.userId },
      {
        $set: {
          'parsedData.fullName': fullName,
          'parsedData.email': email,
          'parsedData.phone': phone,
          'parsedData.summary': summary,
          'parsedData.skills': skills,
          reviewed: true,
        },
      },
      { new: true }
    );

    if (!resume) {
      res.status(404).json({ message: 'Resume record not found.' });
      return;
    }

    // Optionally apply extracted skills and bio to user's modular profile
    if (applyToProfile) {
      if (summary) {
        await Profile.findOneAndUpdate({ userId: req.userId }, { $set: { bio: summary } });
      }
      if (Array.isArray(skills)) {
        for (const skillName of skills) {
          const exists = await Skill.findOne({ userId: req.userId, name: new RegExp(`^${escapeRegExp(skillName.trim())}$`, 'i') });
          if (!exists) {
            await Skill.create({
              userId: req.userId,
              name: skillName.trim(),
              category: 'Other',
              proficiency: 'Intermediate',
            });
          }
        }
      }
    }

    res.status(200).json({ message: 'Resume review saved successfully.', resume });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save reviewed resume.', error: (error as Error).message });
  }
};

// GET /api/resume - Get all resumes for user
export const getResumes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const resumes = await Resume.find({ userId: req.userId }).sort({ uploadedAt: -1 });
    res.status(200).json({ resumes });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch resumes.', error: (error as Error).message });
  }
};
