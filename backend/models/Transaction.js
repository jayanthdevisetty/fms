import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['Income', 'Expense'], required: true, index: true },
    category: { type: String, enum: ['Tent House', 'Chiti'], required: true, index: true },
    personName: { type: String, trim: true, index: true },
    paymentMode: {
      type: String,
      enum: ['Cash', 'PhonePe', 'Google Pay', 'Bank Transfer'],
      required: true
    },
    amount: { type: Number, required: true, min: 0 },
    date: { type: Date, required: true, default: Date.now, index: true },
    notes: { type: String, trim: true, maxlength: 500 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

transactionSchema.index({ category: 1, type: 1, date: -1 });
transactionSchema.index({ personName: 'text', notes: 'text' });

export default mongoose.model('Transaction', transactionSchema);
