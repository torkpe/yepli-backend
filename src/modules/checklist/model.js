import { Schema, model } from 'mongoose';

export const CHECKLIST_COLLECTION = 'checklists'
const checklist = new Schema({
  name: String,
  sectionId: Schema.Types.ObjectId,
  createdBy: Schema.Types.ObjectId,
  isDeleted: {
    default: false,
    type: Boolean
  }
}, {
  timestamps: true
});

export default model(CHECKLIST_COLLECTION, checklist);
