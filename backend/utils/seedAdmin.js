import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';

dotenv.config();

const seed = async () => {
  await connectDB();
  const phone = process.env.ADMIN_PHONE || '9999999999';
  const exists = await User.findOne({ phone });
  if (exists) {
    console.log(`Admin already exists: ${phone}`);
    process.exit(0);
  }
  await User.create({
    name: process.env.ADMIN_NAME || 'FMS Admin',
    phone,
    password: process.env.ADMIN_PASSWORD || 'admin12345',
    role: 'Admin'
  });
  console.log(`Admin created: ${phone}`);
  process.exit(0);
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
