import YieldReport from '../models/YieldReport.js';
import Field from '../models/Field.js';

// Crear un nuevo yield
export const createYield = async (req, res) => {
    const { field, season, crop, totalKg, notes } = req.body;

    if (!field || !season || !crop || !totalKg) {
        return res.status(400).json({ 
            message: 'Los campos field, season, crop y totalKg son requeridos' 
        });
    }

    if (typeof totalKg !== 'number' || totalKg <= 0) {
        return res.status(400).json({ 
            message: 'El campo totalKg debe ser un número mayor a 0' 
        });
    }

    try {
        // Verificar que el field existe
        const fieldExists = await Field.findById(field);
        if (!fieldExists) {
            return res.status(404).json({ 
                message: 'El campo especificado no existe' 
            });
        }

        const newYield = await YieldReport.create({
            field,
            season,
            crop,
            totalKg,
            notes
        });

        await newYield.populate('field', 'name cropType areaHa');

        res.status(201).json({
            message: 'Yield creado exitosamente',
            yield: newYield
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Error al crear el yield',
            error: error.message 
        });
    }
};

// Eliminar un yield
export const deleteYield = async (req, res) => {
    const { yieldId } = req.params;

    try {
        const yieldReport = await YieldReport.findById(yieldId);
        if (!yieldReport) {
            return res.status(404).json({ 
                message: 'Yield no encontrado' 
            });
        }

        await YieldReport.findByIdAndDelete(yieldId);

        res.json({
            message: 'Yield eliminado exitosamente'
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Error al eliminar el yield',
            error: error.message 
        });
    }
};

// Editar un yield (solo season, crop, totalKg y notes)
export const updateYield = async (req, res) => {
    const { yieldId } = req.params;
    const { season, crop, totalKg, notes } = req.body;

    // Validar que al menos un campo a editar esté presente
    if (!season && !crop && !totalKg && notes === undefined) {
        return res.status(400).json({ 
            message: 'Debe proporcionar al menos un campo para actualizar (season, crop, totalKg o notes)' 
        });
    }

    // Validar totalKg si se proporciona
    if (totalKg !== undefined && (typeof totalKg !== 'number' || totalKg <= 0)) {
        return res.status(400).json({ 
            message: 'El campo totalKg debe ser un número mayor a 0' 
        });
    }

    try {
        const yieldReport = await YieldReport.findById(yieldId);
        if (!yieldReport) {
            return res.status(404).json({ 
                message: 'Yield no encontrado' 
            });
        }

        // Crear objeto con solo los campos permitidos para actualizar
        const updateData = {};
        if (season) updateData.season = season;
        if (crop) updateData.crop = crop;
        if (totalKg) updateData.totalKg = totalKg;
        if (notes !== undefined) updateData.notes = notes;

        const updatedYield = await YieldReport.findByIdAndUpdate(
            yieldId,
            updateData,
            { new: true }
        ).populate('field', 'name cropType areaHa');

        res.json({
            message: 'Yield actualizado exitosamente',
            yield: updatedYield
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Error al actualizar el yield',
            error: error.message 
        });
    }
};

// Obtener todos los yields de un campo específico
export const getYieldsByField = async (req, res) => {
    const { fieldId } = req.params;

    try {
        // Verificar que el field existe
        const fieldExists = await Field.findById(fieldId);
        if (!fieldExists) {
            return res.status(404).json({ 
                message: 'El campo especificado no existe' 
            });
        }

        const yields = await YieldReport.find({ field: fieldId })
            .populate('field', 'name cropType areaHa')
            .sort({ createdAt: -1 });

        if (yields.length === 0) {
            return res.status(404).json({ 
                message: 'No se encontraron yields para este campo' 
            });
        }

        res.json({
            message: `Se encontraron ${yields.length} yield(s) para este campo`,
            yields
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Error al obtener los yields del campo',
            error: error.message 
        });
    }
};
