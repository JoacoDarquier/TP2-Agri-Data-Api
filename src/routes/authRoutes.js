import express from 'express';
import { login, refreshToken } from '../controllers/authController.js';

const router = express.Router()

router.post('/api/login', login)
router.post('/api/refresh-token', refreshToken)

export default router