import Field from '../models/Field.js';


export const createField = async (req, res) => {
    const { name, cropType, areaHa, location } = req.body;
    const { user } = req;

    if (!name || !cropType || !areaHa || !location) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const newField = await Field.create({
            producer: user.id,
            name,
            cropType,
            areaHa,
            location,
        });
    
        res.status(201).json(newField);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error creating field',
            error: error.message,
            details: error
        });
    }
};


export const getAllFields = async (req, res) => {
    try {
        const fields = await Field.find().sort({ createdAt: -1 });
        res.json(fields);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching fields' });
    }
};

export const getFieldByName = async (req, res) => {
    const { name } = req.params;

    if (!name) {
        return res.status(400).json({ message: 'The field name is required' });
    }

    try {
        const fields = await Field.find({ 
            name: { $regex: name, $options: 'i' } 
        }).populate('producer', 'name email');
        
        if (fields.length === 0) {
            return res.status(404).json({ message: 'No fields found with that name' });
        }

        res.json(fields);
    } catch (error) {
        res.status(500).json({ message: 'Error searching for the field' });
    }
};