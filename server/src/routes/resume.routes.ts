import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { upload, uploadAndParseResume, saveReviewedResume, getResumes } from '../controllers/resume.controller';

const router = Router();

router.use(authMiddleware);

router.get('/', getResumes);
router.post('/upload', upload.single('resume'), uploadAndParseResume);
router.put('/save/:id', saveReviewedResume);

export default router;
