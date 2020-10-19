import { Schema, model } from 'mongoose';

export const DEAL_COLLECTION = 'deal'
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
  finance: {
    type: Array,
  },
  others: {
    type: Array
  },
  images: {
    type: [Schema.Types.String],
    default: []
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
    type: Schema.Types.String,
    // required: true,
  },
  members: {
    type: [Schema.Types.ObjectId]
  },
  closingDate: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true
});

export default model(DEAL_COLLECTION, deal);
