import express from 'express';
import { 
    createTask, 
    updateTaskStatus, 
    deleteTask, 
    getTasksByField,
    getTaskById 
} from '../controllers/taskController.js';
import { authenticate } from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.post('/api/tasks', authenticate, createTask);
router.put('/api/tasks/:taskId/status', authenticate, updateTaskStatus);
router.delete('/api/tasks/:taskId', authenticate, deleteTask);
router.get('/api/tasks/field/:fieldId', authenticate, getTasksByField);
router.get('/api/tasks/:taskId', authenticate, getTaskById);

export default router;