import mongoose from 'mongoose';

const fieldSchema = new mongoose.Schema({
    producer: { type: mongoose.Schema.Types.ObjectId, ref: 'Producer', required: true },
    name: { type: String, required: true },
    cropType: { type: String, enum: ['Maize','Soy','Wheat','Pasture','Other'], default:'Other' },
    areaHa: { type: Number, required: true },
    /*boundary: {
        type: { type: String, enum: ['Polygon'], default: 'Polygon' },
        coordinates: { type: [[[Number]]], index: '2dsphere' }
    },*/
    location: {
        type:        { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], index: '2dsphere' }
    }
}, { timestamps: true});

export default mongoose.models.Field || mongoose.model('Field', fieldSchema);
