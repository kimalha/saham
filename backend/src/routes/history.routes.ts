import { Router } from 'express';
import { HistoryController } from '../controllers/history.controller';

const router = Router();

router.get('/', HistoryController.getAll);
router.get('/:id', HistoryController.getById);
router.delete('/:id', HistoryController.delete);

export default router;
