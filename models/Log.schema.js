import mongoose from 'mongoose';

const LogSchema = new mongoose.Schema(
  {
    action: { type: String },
    method: { type: String },
    info: { type: Object },
  },
  { timestamps: true }
);

export default mongoose.models.Log || mongoose.model('Log', LogSchema);
