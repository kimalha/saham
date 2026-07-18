import { Router } from 'express';
import { ExportController } from '../controllers/export.controller';

const router = Router();

router.get('/pdf/:id', ExportController.exportPdf);
router.get('/excel/:id', ExportController.exportExcel);

export default router;
