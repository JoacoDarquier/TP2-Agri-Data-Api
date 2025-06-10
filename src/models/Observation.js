import mongoose from 'mongoose';

const observationSchema = new mongoose.Schema({
    field: { type: mongoose.Schema.Types.ObjectId, ref: 'Field', required: true },
    observedAt:{ type: Date, default: Date.now },
    kind: { type: String, enum: ['Soil','Pest','Weather','Image','Note'], required: true },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
    images: [{ url: String, key: String }], 
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Producer' }
}, { timestamps: true});

export default mongoose.models.Observation || mongoose.model('Observation', observationSchema);
