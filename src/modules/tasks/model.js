import { Schema, model } from 'mongoose';

export const TASK_COLLECTION = 'tasks'
const task = new Schema({
  title: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    lowercase: true,
    trim: true
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  isAddedToChecklist: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    default: 'notStarted'
  },
  description: {
    type: String,
  },
  attachments: Array,
  mentions: [String],
  createdBy: Schema.Types.ObjectId,
  dealId: Schema.Types.ObjectId,
  sectionId: Schema.Types.ObjectId,
  assignee: Schema.Types.ObjectId,
  dueDate: Schema.Types.Date,
}, {
  timestamps: true,
  collection: TASK_COLLECTION
});

export default model(TASK_COLLECTION, task);
