import { Schema, model } from 'mongoose';
import Bcrypt from 'bcryptjs';
import moment from 'moment';
const crypto = require('crypto');

export const USER_COLLECTION = 'users';
const user = new Schema({
  firstName: {
    type: String,
    lowercase: true,
    trim: true
  },
  isVerified: {
    type: Boolean,
    default: false,
    lowercase: true,
    trim: true
  },
  lastName: {
    type: String,
    lowercase: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  category: {
    type: String,
    lowercase: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    lowercase: true,
    trim: true
  },
  location: {
    type: String,
    lowercase: true,
    trim: true
  },
  image: {
    type: String,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
  },
  token: {
    token: String,
    expiryDate: Date
  },
  invitedBy: {
    type: Schema.Types.ObjectId,
  },
}, {
  timestamps: true
});

user.pre('save', function(next){
  if(!this.isModified("password")) {
    return next();
  }
  this.password = Bcrypt.hashSync(this.password, 10);
  this.token = generateToken()
  next();
});

user.methods.comparePassword = function(plaintext) {
  return Bcrypt.compareSync(plaintext, this.password)
};

function generateToken() {
  const buf = crypto.randomBytes(48);
  return {
    token: buf.toString('hex'),
    expiryDate: moment().utc().add(2, 'hours')
  }
}

user.methods.generateToken = function() {
  return generateToken()
};

export default model(USER_COLLECTION, user);