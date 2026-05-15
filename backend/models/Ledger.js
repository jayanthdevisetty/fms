import mongoose from 'mongoose';

const ledgerSchema = new mongoose.Schema(
  {
    personName: { type: String, required: true, unique: true, trim: true, index: true },
    phone: { type: String, trim: true },
    openingBalance: { type: Number, default: 0 },
    notes: { type: String, trim: true }
  },
  { timestamps: true }
);

ledgerSchema.index({ personName: 'text' });

export default mongoose.model('Ledger', ledgerSchema);
