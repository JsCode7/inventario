// models/Product.schema.js
import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  productCode: { type: String, required: true },
  productName: { type: String, required: true },
  stock: { type: Number, required: true },
  entryDate: { type: Date, required: true },
  costPerUnit: { type: Number, required: true },
  totalCost: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
