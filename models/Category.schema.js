import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }] 
}, { timestamps: true });

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);
