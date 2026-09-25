import { randomBytes } from 'crypto';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import mongoose from 'mongoose';
import { FIFTEEN_MINUTES, THIRTY_DAYS } from '../constants/index.js';
import { UsersCollection } from '../db/models/user.js';
import { SessionsCollection } from '../db/models/session.js';

function buildSessionTokens() {
  return {
    accessToken: randomBytes(30).toString('base64url'),
    refreshToken: randomBytes(30).toString('base64url'),
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  };
}

async function createSessionForUser(userId) {
  await SessionsCollection.deleteOne({ userId });
  return SessionsCollection.create({ userId, ...buildSessionTokens() });
}

export async function registerUser({ name, email, password }) {
  const existing = await UsersCollection.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw createHttpError(409, 'An account with this email already exists.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await UsersCollection.create({ name, email, password: hashedPassword });
  const session = await createSessionForUser(user._id);

  return { user, session };
}

export async function loginUser({ email, password }) {
  const user = await UsersCollection.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw createHttpError(401, 'Invalid email or password.');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw createHttpError(401, 'Invalid email or password.');
  }

  const session = await createSessionForUser(user._id);
  return { user, session };
}

export async function logoutUser(sessionId) {
  if (!sessionId || !mongoose.isValidObjectId(sessionId)) return;
  await SessionsCollection.deleteOne({ _id: sessionId });
}

export async function refreshUserSession({ sessionId, refreshToken }) {
  if (!sessionId || !refreshToken || !mongoose.isValidObjectId(sessionId)) {
    throw createHttpError(401, 'Session not found');
  }

  const session = await SessionsCollection.findOne({ _id: sessionId, refreshToken });
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  if (new Date() > session.refreshTokenValidUntil) {
    throw createHttpError(401, 'Session expired');
  }

  await SessionsCollection.deleteOne({ _id: sessionId });
  return SessionsCollection.create({ userId: session.userId, ...buildSessionTokens() });
}
