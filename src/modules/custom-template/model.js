import { Schema, model } from 'mongoose';

export const TEMAPLATE_COLLECTION = 'templates'
const type = new Schema({
  sections: [Object],
  typeId: Schema.Types.ObjectId,
  createdBy: Schema.Types.ObjectId,
  name: String,
  isDeleted: {
    default: false,
    type: Boolean
  }
}, {
  timestamps: true
});

export default model(TEMAPLATE_COLLECTION, type);
