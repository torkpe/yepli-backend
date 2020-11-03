import { Schema, model } from 'mongoose';

export const CONTACT_COLLECTION = 'contacts'
const contact = new Schema({
  firstName: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    lowercase: true,
    trim: true
  },
  address: {
    type: String,
    lowercase: true,
    trim: true
  },
  company: {
    type: String,
    lowercase: true,
    trim: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    lowercase: true,
    trim: true
  },
  addedBy: {
    type: Schema.Types.ObjectId,
    required: true,
    lowercase: true,
    trim: true
  },
}, {
  timestamps: true
});

export default model(CONTACT_COLLECTION, contact);
