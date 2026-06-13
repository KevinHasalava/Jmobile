import jwt from 'jsonwebtoken';
import User from '@/models/User';
import connectDB from '@/lib/db';

export async function protect(req) {
  await connectDB();
  const authHeader = req.headers.get('authorization');
  
  if (authHeader && authHeader.startsWith('Bearer')) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      if (!user) return null;
      return user;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  return null;
}

export async function admin(user) {
  if (user && user.role === 'admin') {
    return true;
  }
  return false;
}

export function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
}
