import { Router } from 'express';
import { AnalysisController } from '../controllers/analysis.controller';
import { validateRequest } from '../middlewares/validation.middleware';
import { runAnalysisSchema } from '../validators/analysis.validator';

const router = Router();

router.post('/', validateRequest(runAnalysisSchema), AnalysisController.run);

export default router;
