// models/user.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  otp: { type: String },
  otpExpiry: { type: Date }
});

const UserModel = mongoose.model('User', UserSchema);
export default UserModel; 