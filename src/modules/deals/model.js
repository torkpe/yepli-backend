import { Schema, model } from 'mongoose';

const deal = new Schema({
  name: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  value: {
    type: String,
    required: true,
    trim: true
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  type: {
    type: Schema.Types.ObjectId,
    // required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true
});

export default model('deal', deal);
