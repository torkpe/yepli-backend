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
    default: [
      {
        key: 'Loan Request',
        value: ''
      },
      {
        key: 'Estimated Stablized Value',
        value: ''
      },
      {
        key: 'Cap Rate',
        value: ''
      },
      {
        key: 'Loan to value',
        value: ''
      },
    ]
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
  closingDate: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true
});

export default model(DEAL_COLLECTION, deal);
