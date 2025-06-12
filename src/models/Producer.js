import mongoose from 'mongoose';

const producerSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Producer || mongoose.model('Producer', producerSchema);