import mongoose from 'mongoose';

const yieldReportSchema = new mongoose.Schema({
    field: { type: mongoose.Schema.Types.ObjectId, ref: 'Field', required: true },
    season: { type: String, required: true },
    crop: { type: String, required: true },
    totalKg: { type: Number, required: true },
    //yieldKgHa: { type: Number }, 
    notes: { type: String }
}, { timestamps: true});

export default mongoose.models.YieldReport || mongoose.model('YieldReport', yieldReportSchema);
