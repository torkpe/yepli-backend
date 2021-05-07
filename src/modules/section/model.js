import { Schema, model } from 'mongoose';

export const SECTION_COLLECTION = 'sections';

const section = new Schema({
  name: String,
  dealId: Schema.Types.ObjectId,
  createdBy: Schema.Types.ObjectId,
  isDeleted: {
    default: false,
    type: Boolean
  }
}, {
  timestamps: true,
  collection: SECTION_COLLECTION
});

export default model(SECTION_COLLECTION, section);
