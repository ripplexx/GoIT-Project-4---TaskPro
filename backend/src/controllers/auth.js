import {
  registerUser,
  loginUser,
  logoutUser,
  refreshUserSession,
} from '../services/auth.js';
import { env } from '../utils/env.js';

const isProd = env('NODE_ENV', 'development') === 'production';

function setupSessionCookies(res, session) {
  const cookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    expires: session.refreshTokenValidUntil,
  };

  res.cookie('refreshToken', session.refreshToken, cookieOptions);
  res.cookie('sessionId', session._id.toString(), cookieOptions);
}

export async function registerController(req, res) {
  const { user, session } = await registerUser(req.body);
  setupSessionCookies(res, session);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: { user, accessToken: session.accessToken },
  });
}

export async function loginController(req, res) {
  const { user, session } = await loginUser(req.body);
  setupSessionCookies(res, session);

  res.json({
    status: 200,
    message: 'Successfully logged in!',
    data: { user, accessToken: session.accessToken },
  });
}

export async function logoutController(req, res) {
  await logoutUser(req.cookies.sessionId);

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');
  res.status(204).send();
}

export async function refreshController(req, res) {
  const session = await refreshUserSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });
  setupSessionCookies(res, session);

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: { accessToken: session.accessToken },
  });
}
