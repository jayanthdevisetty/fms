import mongoose from 'mongoose';

const commonExpenseSchema = new mongoose.Schema(
  {
    expenseName: {
      type: String,
      enum: ['Tent House Current Bill', 'KSR House Current Bill', 'Bike Petrol', 'Salary', 'Maintenance', 'Food', 'Other'],
      required: true,
      index: true
    },
    amount: { type: Number, required: true, min: 0 },
    month: { type: Number, required: true, min: 1, max: 12, index: true },
    year: { type: Number, required: true, min: 2000, max: 2100, index: true },
    status: { type: String, enum: ['Paid', 'Pending'], default: 'Pending', index: true },
    notes: { type: String, trim: true, maxlength: 500 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

commonExpenseSchema.index({ year: 1, month: 1, status: 1 });

export default mongoose.model('CommonExpense', commonExpenseSchema);
