import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { connectGitHubUsername, fetchRepositories, fetchRepoReadme, importRepoToProject } from '../controllers/github.controller';

const router = Router();

router.use(authMiddleware);

router.post('/connect', connectGitHubUsername);
router.get('/repos', fetchRepositories);
router.get('/readme', fetchRepoReadme);
router.post('/import', importRepoToProject);

export default router;
