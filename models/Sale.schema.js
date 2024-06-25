import mongoose from 'mongoose';

const SaleSchema = new mongoose.Schema({
  saleCode: { type: Number, required: true, unique: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quantity: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.models.Sale || mongoose.model('Sale', SaleSchema);
