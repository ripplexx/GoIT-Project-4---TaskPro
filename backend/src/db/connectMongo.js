import mongoose from 'mongoose';
import { env } from '../utils/env.js';

export async function connectMongo() {
  await mongoose.connect(env('MONGODB_URI'));
  console.log('Connected to MongoDB');
}
