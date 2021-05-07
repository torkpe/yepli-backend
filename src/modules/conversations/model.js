import { Schema, model } from 'mongoose';

export const CONVERSATIONS_COLLECTION = 'conversations'
const converation = new Schema({
  taskId: Schema.Types.ObjectId,
  dealId: Schema.Types.ObjectId,
  userId: Schema.Types.ObjectId,
  comment: String,
  files: [String],
  mentions: [Schema.Types.String],
  isDeleted: {
    default: false,
    type: Boolean
  }
}, {
  timestamps: true
});

export default model(CONVERSATIONS_COLLECTION, converation);
