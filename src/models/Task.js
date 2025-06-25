import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    field: { type: mongoose.Schema.Types.ObjectId, ref: 'Field', required: true },
    title: { type: String, required: true },
    description: { type: String },
    scheduledFor: { type: Date, required: true },
    status: { type: String, enum: ['Pending','InProgress','Done','Cancelled'], default:'Pending', index:true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Producer', required: true },
}, { timestamps: true});

export default mongoose.models.Task || mongoose.model('Task', taskSchema);
