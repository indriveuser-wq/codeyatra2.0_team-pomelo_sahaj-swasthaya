import mongoose from 'mongoose';

const MedicalReportSchema = new mongoose.Schema({
  tokenNumber: { type: Number, required: true, ref: 'QueueToken' },
  reportUrl: { type: String, required: true },
  department: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.MedicalReport || mongoose.model('MedicalReport', MedicalReportSchema);