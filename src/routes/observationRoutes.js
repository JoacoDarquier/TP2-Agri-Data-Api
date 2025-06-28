import express from 'express';
import { createObservation, editObservation, deleteObservation, getObservationsByField } from '../controllers/observationController.js';
import { authenticate } from '../middlewares/authMiddlewares.js';
import { allowUpload, allowMultipleUpload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.post('/api/observations', authenticate, allowMultipleUpload, createObservation);

router.put('/api/observations/:observationId', authenticate, allowMultipleUpload, editObservation);

router.delete('/api/observations/:observationId', authenticate, deleteObservation);

router.get('/api/observations/field/:fieldId', authenticate, getObservationsByField);


export default router;