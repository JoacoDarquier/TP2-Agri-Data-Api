import Observation from '../models/Observation.js';
import Field from '../models/Field.js';
import supabase from '../config/supabase.js';


export const createObservation = async (req, res) => {
    const { field, kind, data, observedAt } = req.body;
    const { user } = req;
    const files = req.files?.images;

    if (!field || !kind || !data) {
        return res.status(400).json({ 
            message: 'The fields field, kind and data are required' 
        });
    }

    const validKinds = ['Soil', 'Pest', 'Weather', 'Image', 'Note'];
    if (!validKinds.includes(kind)) {
        return res.status(400).json({ 
            message: `The 'kind' field must be one of: ${validKinds.join(', ')}` 
        });
    }

    try {
        const fieldExists = await Field.findById(field);
        if (!fieldExists) {
            return res.status(404).json({ 
                message: 'The specified field does not exist' 
            });
        }

        let imageUrls = [];
        if (files && files.length > 0) {
            for (const file of files) {
                const fileName = `${Date.now()}_${file.originalname}`;
                const filePath = `observations/${user._id}/${field}/${fileName}`;

                const { data: uploadData, error } = await supabase.storage
                    .from(process.env.SUPABASE_BUCKET)
                    .upload(filePath, file.buffer, {
                        contentType: file.mimetype,
                        upsert: true
                    });

                if (error) {
                    throw new Error(`Error uploading image: ${error.message}`);
                }

                const { data: publicUrlData } = supabase.storage
                    .from(process.env.SUPABASE_BUCKET)
                    .getPublicUrl(filePath);

                imageUrls.push(publicUrlData.publicUrl);
            }
            
        }

        const newObservation = await Observation.create({
            field,
            kind,
            data: JSON.parse(data),
            images: imageUrls,
            observedAt: observedAt || new Date(),
            createdBy: user._id
        });

        await newObservation.populate([
            { path: 'field', select: 'name cropType' },
            { path: 'createdBy', select: 'name email' }
        ]);

        res.status(201).json(newObservation);

    } catch (error) {
        res.status(500).json({ 
            message: 'Error creating observation',
            error: error.message 
        });
    }
};

export const addImagesToObservation = async (req, res) => {
    const { observationId } = req.params;
    const { user } = req;
    const files = req.files?.images;

    if (!files || files.length === 0) {
        return res.status(400).json({ 
            message: 'No images were provided' 
        });
    }

    try {
        const observation = await Observation.findById(observationId);
        if (!observation) {
            return res.status(404).json({ 
                message: 'Observation not found' 
            });
        }

        if (observation.createdBy.toString() !== user._id.toString()) {
            return res.status(403).json({ 
                message: 'You do not have permission to modify this observation' 
            });
        }

        let newImageUrls = [];
        for (const file of files) {
            const fileName = `${Date.now()}_${file.originalname}`;
            const filePath = `observations/${user._id}/${observation.field}/${fileName}`;

            const { data: uploadData, error } = await supabase.storage
                .from(process.env.SUPABASE_BUCKET)
                .upload(filePath, file.buffer, {
                    contentType: file.mimetype,
                    upsert: true
                });

            if (error) {
                throw new Error(`Error uploading image: ${error.message}`);
            }

            const { data: publicUrlData } = supabase.storage
                .from(process.env.SUPABASE_BUCKET)
                .getPublicUrl(filePath);

            newImageUrls.push(publicUrlData.publicUrl);
        }

        const updatedImages = [...observation.images, ...newImageUrls];

        const updatedObservation = await Observation.findByIdAndUpdate(
            observationId,
            { images: updatedImages },
            { new: true }
        ).populate([
            { path: 'field', select: 'name cropType' },
            { path: 'createdBy', select: 'name email' }
        ]);

        res.json({
            message: 'Images added successfully',
            observation: updatedObservation,
            newImages: newImageUrls
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Error adding images to the observation',
            error: error.message 
        });
    }
};

export const getAllObservations = async (req, res) => {
    try {
        const observations = await Observation.find()
            .populate('field', 'name cropType')
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });
        
        res.json(observations);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error getting observations' 
        });
    }
};

export const getObservationsByField = async (req, res) => {
    const { fieldId } = req.params;

    try {
        const observations = await Observation.find({ field: fieldId })
            .populate('field', 'name cropType')
            .populate('createdBy', 'name email')
            .sort({ observedAt: -1 });
        
        if (observations.length === 0) {
            return res.status(404).json({ 
                message: 'No observations were found for this field' 
            });
        }

        res.json(observations);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error getting observations for this field' 
        });
    }
};