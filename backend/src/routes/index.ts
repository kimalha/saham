import { Router } from 'express';
import stockRouter from './stock.routes';
import analysisRouter from './analysis.routes';
import historyRouter from './history.routes';

const router = Router();

router.use('/stocks', stockRouter);
router.use('/analysis', analysisRouter);
router.use('/history', historyRouter);

export default router;
