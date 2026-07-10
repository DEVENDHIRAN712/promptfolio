import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import * as aiController from '../controllers/ai.controller';

const router = Router();

// Every AI generation endpoint requires JWT bearer authentication
router.use(authMiddleware);

router.post('/generate-portfolio', aiController.generatePortfolio);
router.post('/generate-resume', aiController.generateResume);
router.post('/generate-cover-letter', aiController.generateCoverLetter);
router.post('/generate-linkedin', aiController.generateLinkedIn);
router.post('/generate-readme', aiController.generateReadme);

export default router;
