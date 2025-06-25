import express from 'express';
import { createYield, deleteYield, updateYield, getYieldsByField } from '../controllers/yieldController.js';
import { authenticate } from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.post('/api/yields', authenticate, createYield);
router.delete('/api/yields/:yieldId', authenticate, deleteYield);
router.put('/api/yields/:yieldId', authenticate, updateYield);
router.get('/api/yields/field/:fieldId', authenticate, getYieldsByField);

export default router;