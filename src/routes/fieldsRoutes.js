import express from 'express';
import { createField, getAllFields, getFieldByName } from '../controllers/fieldsController.js';
import { authenticate } from '../middlewares/authMiddlewares.js';


const router = express.Router();

router.post('/api/fields', authenticate, createField);
router.get('/api/fields', getAllFields);
router.get('/api/fields/search/:name', getFieldByName);

export default router; 