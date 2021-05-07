import { Schema, model } from 'mongoose';

export const TYPE_COLLECTION = 'types'
const type = new Schema({
  name: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  createdBy: Schema.Types.ObjectId
}, {
  timestamps: true
});

export default model(TYPE_COLLECTION, type);
