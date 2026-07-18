import { Router } from 'express';
import stockRouter from './stock.routes';
import analysisRouter from './analysis.routes';
import historyRouter from './history.routes';
import exportRouter from './export.routes';

const router = Router();

router.use('/stocks', stockRouter);
router.use('/analysis', analysisRouter);
router.use('/history', historyRouter);
router.use('/export', exportRouter);

export default router;
