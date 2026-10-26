import bcrypt from 'bcryptjs';
import { User } from '../users/user.model.js';
import { ApiError } from '../../utils/ApiError.js';

export async function registerUser({ name, email, password }) {
  const passwordHash = await bcrypt.hash(password, 12);
  return User.create({ name, email, passwordHash }); // duplicate email -> 11000 -> 409 via error handler
}

export async function loginUser({ email, password }) {
  const user = await User.findOne({ email }).select('+passwordHash');
  const ok = user && (await bcrypt.compare(password, user.passwordHash));
  if (!ok) throw new ApiError(401, 'Invalid email or password');
  return user;
}