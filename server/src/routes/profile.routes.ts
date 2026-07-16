import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import {
  getCompleteProfile,
  updateAbout,
  createExperience,
  updateExperience,
  deleteExperience,
  createEducation,
  updateEducation,
  deleteEducation,
  createSkill,
  updateSkill,
  deleteSkill,
  createProject,
  updateProject,
  deleteProject,
  createCertificate,
  updateCertificate,
  deleteCertificate,
  getPublicProfile,
  updatePublishSettings,
} from '../controllers/profile.controller';

const router = Router();

// Public Portfolio Route (NO auth required)
router.get('/public/:username', getPublicProfile);

// Protected Routes below
router.use(authMiddleware);

// Portfolio Publishing Settings
router.put('/publish', updatePublishSettings);

// Aggregated profile
router.get('/all', getCompleteProfile);

// About & Social Links
router.put('/about', updateAbout);

// Experience
router.post('/experience', createExperience);
router.put('/experience/:id', updateExperience);
router.delete('/experience/:id', deleteExperience);

// Education
router.post('/education', createEducation);
router.put('/education/:id', updateEducation);
router.delete('/education/:id', deleteEducation);

// Skills
router.post('/skill', createSkill);
router.put('/skill/:id', updateSkill);
router.delete('/skill/:id', deleteSkill);

// Projects
router.post('/project', createProject);
router.put('/project/:id', updateProject);
router.delete('/project/:id', deleteProject);

// Certificates
router.post('/certificate', createCertificate);
router.put('/certificate/:id', updateCertificate);
router.delete('/certificate/:id', deleteCertificate);

export default router;
