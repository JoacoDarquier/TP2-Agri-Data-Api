import express from 'express';
import { createObservation, addImagesToObservation, getAllObservations, getObservationsByField } from '../controllers/observationController.js';
import { authenticate } from '../middlewares/authMiddlewares.js';
import { uploadMultiple, handleMulterError } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.post('/api/observations', authenticate, uploadMultiple, handleMulterError, createObservation);

router.post('/api/observations/:observationId/images', authenticate, uploadMultiple, handleMulterError, addImagesToObservation);

router.get('/api/observations', getAllObservations);

router.get('/api/observations/field/:fieldId', getObservationsByField);

export default router;
