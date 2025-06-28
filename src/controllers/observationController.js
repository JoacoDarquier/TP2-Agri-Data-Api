import Observation from '../models/Observation.js';
import Field from '../models/Field.js';
import supabase from '../config/supabase.js';


export const createObservation = async (req, res) => {

    const { field, observedAt, kind, data } = req.body;
    const { user } = req;
    const files = req.files;

    const file = req.file;
    if (!field || !kind || !data) {
        return res.status(400).json({ error: "Obligatory data is required. Field, kind and data are required." });
    }
    
    try {
        let imagesUrls = [];
        if ( files && files.length > 0 ) {
            for ( const file of files ) {
                const fileName = `${Date.now()}_${file.originalname}`;
                const filePath = `producers/${user.id}/observations/${fileName}`;

                const { data, error } = await supabase.storage
                    .from(process.env.SUPABASE_BUCKET)
                    .upload(filePath, file.buffer, {
                        contentType: file.mimetype,
                        upsert: true,
                    });

                if ( error ) {
                    return res.status(500).json({ error: "Error uploading the image." });
                }

                const { data: PublicDataUrl } = supabase.storage
                    .from(process.env.SUPABASE_BUCKET)
                    .getPublicUrl(filePath);

                imagesUrls.push(PublicDataUrl.publicUrl);
            }
        }

        const newObservation = await Observation.create({
            field,
            kind,
            data,
            createdBy: user.id,
            images: imagesUrls,
        });

        res.status(201).json(newObservation);

    } catch (error) {
        res.status(500).json({ error: "Error creating the observation." });
    }
}

export const editObservation = async (req, res) => {
    const { observationId } = req.params;
    const updates = req.body;
    const { user } = req;
    const files = req.files;

    if (Object.keys(updates).length === 0 && (!files || files.length === 0)) {
        return res.status(400).json({ error: 'No data provided to update.' });
    }
    
    if (updates.createdBy) {
        delete updates.createdBy;
    }

    try {
        const observacion = await Observation.findById(observationId);

        if (!observacion) {
            return res.status(404).json({ error: "Observation not found." });
        }

        if (observacion.createdBy.toString() !== user.id) {
            return res.status(403).json({ error: "You do not have permission to edit this observation." });
        }

        let newImagesUrls = [];
        if (files && files.length > 0) {
            for (const file of files) {
                const fileName = `${Date.now()}_${file.originalname}`;
                const filePath = `producers/${user.id}/observations/${fileName}`;

                const { data, error } = await supabase.storage
                    .from(process.env.SUPABASE_BUCKET)
                    .upload(filePath, file.buffer, {
                        contentType: file.mimetype,
                        upsert: true,
                    });

                if (error) {
                    return res.status(500).json({ error: "Error uploading the new image." });
                }

                const { data: PublicDataUrl } = supabase.storage
                    .from(process.env.SUPABASE_BUCKET)
                    .getPublicUrl(filePath);

                newImagesUrls.push(PublicDataUrl.publicUrl);
            }
        }

        const finalUpdates = { ...updates };
        
        if (newImagesUrls.length > 0) {
            finalUpdates.images = newImagesUrls;
        }
        const observacionActualizada = await Observation.findByIdAndUpdate(
            observationId,
            { $set: finalUpdates },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            msg: 'Observación actualizada correctamente',
            observacion: observacionActualizada
        });

    } catch (error) {
        console.error("Error al actualizar la observación:", error);
        res.status(500).json({ error: "Error interno al actualizar la observación." });
    }
}

export const deleteObservation = async (req, res) => {
    const { observationId } = req.params;
    const { user } = req;

    try {
        const observation = await Observation.findById(observationId);
        if (!observation) {
            return res.status(404).json({ error: "Observation not found." });
        }
        if (observation.createBy && user.id && observation.createBy.toString() !== user.id.toString()) {
            return res.status(403).json({ error: "You do not have permission to delete this observation." });
        }

        await Observation.findByIdAndDelete(observationId);

        res.json({
            message: 'Observation deleted successfully'
        });

    } catch (error) {
        res.status(500).json({ error: "Internal error deleting the observation." });
    }
}


export const getObservationsByField = async (req, res) => {
    const { fieldId } = req.params;

    try {
        const fieldExists = await Field.findById(fieldId);
        if (!fieldExists) {
            return res.status(404).json({ error: "Field not found." });
        }

        const observations = await Observation.find({ field: fieldId })
            .populate('field', 'name cropType areaHa')
            .sort({ createdAt: -1 });

        if (observations.length === 0) {
            return res.status(404).json({ error: "No observations found for this field." });
        }

        res.json({
            message: `Found ${observations.length} observation(s) for this field`,
            observations
        });

    } catch (error) {
        res.status(500).json({ error: "Error getting the observations of the field." });
    }
}