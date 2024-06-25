import mongoose from 'mongoose';

const BuySchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  supplier: { type: String, required: true },
  entryDate: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.models.Buy || mongoose.model('Buy', BuySchema);
