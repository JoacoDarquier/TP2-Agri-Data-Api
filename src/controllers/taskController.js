import Task from '../models/Task.js';
import Field from '../models/Field.js';

export const createTask = async (req, res) => {
    const { field, title, description, scheduledFor, status } = req.body;
    const { user } = req;

    if (!field || !title || !scheduledFor) {
        return res.status(400).json({ 
            message: 'The fields field, title and scheduledFor are required' 
        });
    }

    const validStatuses = ['Pending', 'InProgress', 'Done', 'Cancelled'];
    if (status && !validStatuses.includes(status)) {
        return res.status(400).json({ 
            message: `The 'status' field must be one of: ${validStatuses.join(', ')}` 
        });
    }

    try {
        const fieldExists = await Field.findById(field);
        if (!fieldExists) {
            return res.status(404).json({ 
                message: 'The specified field does not exist' 
            });
        }

        const newTask = await Task.create({
            field,
            title,
            description,
            scheduledFor,
            status: status || 'Pending',
            createdBy: user.id
        });

        await newTask.populate([
            { path: 'field', select: 'name cropType' },
            { path: 'createdBy', select: 'name email' }
        ]);

        res.status(201).json(newTask);

    } catch (error) {
        res.status(500).json({ 
            message: 'Error creating the task',
            error: error.message 
        });
    }
};

export const updateTaskStatus = async (req, res) => {
    const { taskId } = req.params;
    const { status } = req.body;
    const { user } = req;

    if (!status) {
        return res.status(400).json({ 
            message: 'The status field is required' 
        });
    }

    const validStatuses = ['Pending', 'InProgress', 'Done', 'Cancelled'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ 
            message: `The 'status' field must be one of: ${validStatuses.join(', ')}` 
        });
    }

    try {
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ 
                message: 'Task not found' 
            });
        }

        if (task.createdBy && user.id && task.createdBy.toString() !== user.id.toString()) {
            return res.status(403).json({ 
                message: 'You do not have permission to modify this task' 
            });
        }

        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { status },
            { new: true }
        ).populate([
            { path: 'field', select: 'name cropType' },
            { path: 'createdBy', select: 'name email' }
        ]);

        res.json({
            message: 'Task status updated successfully',
            task: updatedTask
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Error updating the task status',
            error: error.message 
        });
    }
};

export const deleteTask = async (req, res) => {
    const { taskId } = req.params;
    const { user } = req;

    try {
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ 
                message: 'Task not found' 
            });
        }

        if (task.createdBy && user.id && task.createdBy.toString() !== user.id.toString()) {
            return res.status(403).json({ 
                message: 'You do not have permission to delete this task' 
            });
        }

        await Task.findByIdAndDelete(taskId);

        res.json({
            message: 'Task deleted successfully'
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Error deleting the task',
            error: error.message 
        });
    }
};

export const getTasksByField = async (req, res) => {
    const { fieldId } = req.params;
    const { status } = req.query;

    try {
        const fieldExists = await Field.findById(fieldId);
        if (!fieldExists) {
            return res.status(404).json({ 
                message: 'The specified field does not exist' 
            });
        }

        const filters = { field: fieldId };
        if (status) {
            const validStatuses = ['Pending', 'InProgress', 'Done', 'Cancelled'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({ 
                    message: `The 'status' filter must be one of: ${validStatuses.join(', ')}` 
                });
            }
            filters.status = status;
        }

        const tasks = await Task.find(filters)
            .populate('field', 'name cropType')
            .populate('createdBy', 'name email')
            .sort({ scheduledFor: 1, createdAt: -1 });

        if (tasks.length === 0) {
            return res.status(404).json({ 
                message: 'No tasks were found for this field' 
            });
        }

        res.json(tasks);

    } catch (error) {
        res.status(500).json({ 
            message: 'Error getting the tasks for this field',
            error: error.message 
        });
    }
};

export const getTaskById = async (req, res) => {
    const { taskId } = req.params;

    try {
        const task = await Task.findById(taskId)
            .populate('field', 'name cropType')
            .populate('createdBy', 'name email');

        if (!task) {
            return res.status(404).json({ 
                message: 'Task not found' 
            });
        }

        res.json(task);

    } catch (error) {
        res.status(500).json({ 
            message: 'Error getting the task',
            error: error.message 
        });
    }
};