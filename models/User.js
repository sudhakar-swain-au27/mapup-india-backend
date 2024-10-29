import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const { genSalt, hash } = bcrypt;

/**
 * @constant userSchema - Mongoose schema for user accounts
 * @property {String} username - Unique username, required
 * @property {String} password - User password, required and hashed before saving
 * @property {String} fullName - User's full name, required
 * @property {String} email - Unique email address
 * @property {String} role - User role, defaults to 'admin', can be 'user', 'manager', or 'admin'
 * @property {Date} createdDate - The date the user was created, defaults to the current date
 * @property {String} createdBy - Indicates who created the user, defaults to 'system'
 * @property {Date} lastLogin - Records the user's last login date
 */
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  email: { type: String, unique: true },
  role: { type: String, enum: ['user', 'manager', 'admin'], default: 'admin' },
  createdDate: { type: Date, default: Date.now },
  createdBy: { type: String, default: 'system' },
  lastLogin: { type: Date },
});

/**
 * Pre-save hook for hashing password before saving the user document
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await genSalt(10);
  this.password = await hash(this.password, salt);
  next();
});

/**
 * Updates the user's last login date to the current date and saves the document
 */
userSchema.methods.updateLastLogin = async function () {
  this.lastLogin = new Date();
  await this.save();
};

export default mongoose.model('User', userSchema);
