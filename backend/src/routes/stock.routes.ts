import { Router } from 'express';
import { StockController } from '../controllers/stock.controller';
import { validateRequest } from '../middlewares/validation.middleware';
import { upload } from '../middlewares/upload.middleware';
import {
  createStockSchema,
  updateStockSchema,
  deleteStockSchema
} from '../validators/stock.validator';

const router = Router();

router.get('/', StockController.getAll);
router.get('/:id', StockController.getById);

router.post('/', validateRequest(createStockSchema), StockController.create);
router.put('/:id', validateRequest(updateStockSchema), StockController.update);
router.delete('/:id', validateRequest(deleteStockSchema), StockController.delete);

router.post('/import', upload.single('file'), StockController.bulkImport);
router.post('/sync', StockController.syncFinancialData);

export default router;
